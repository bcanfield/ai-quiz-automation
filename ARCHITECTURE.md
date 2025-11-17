# Architecture Overview

## System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         Quiz Helper CLI                          │
│                        (src/index.ts)                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      QuizHelper Class                            │
│                   (src/quiz-helper.ts)                          │
│                                                                  │
│  Orchestrates the quiz automation workflow:                     │
│  1. Connect to browser                                          │
│  2. Loop through questions                                      │
│  3. Coordinate browser and AI components                        │
└─────────────┬────────────────────────────┬──────────────────────┘
              │                            │
              ▼                            ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│    BrowserHelper         │    │      AIHelper            │
│   (src/browser.ts)       │    │    (src/ai.ts)           │
│                          │    │                          │
│ - connect()              │    │ - analyzeQuestion()      │
│ - extractQuestion()      │    │ - buildPrompt()          │
│ - clickAnswer()          │    │                          │
│ - clickConfirm()         │    │ Uses OpenAI API          │
│ - hasMoreQuestions()     │    │                          │
│                          │    │                          │
│ Uses Playwright CDP      │    │                          │
└────────┬─────────────────┘    └────────┬─────────────────┘
         │                               │
         ▼                               ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│   Chrome Browser         │    │    OpenAI API            │
│   (External)             │    │    (External)            │
│                          │    │                          │
│ - Running with           │    │ - GPT-4 / GPT-3.5        │
│   --remote-debugging     │    │ - Analyzes questions     │
│ - Port 9222              │    │ - Returns answer index   │
└──────────────────────────┘    └──────────────────────────┘
```

## Data Flow

```
1. User starts quiz-helper
   └─> Loads config.json

2. BrowserHelper connects to Chrome
   └─> CDP connection on port 9222
   └─> Accesses active tab

3. For each question:
   
   a) Extract Question
      ├─> Locate .question-container
      ├─> Read all nested text (p, span, etc.)
      ├─> Find all button.btn.choice-link
      └─> Return Question object {text, answers[]}
   
   b) AI Analysis
      ├─> Build prompt with question & answers
      ├─> Send to OpenAI API
      ├─> Parse response (answer index)
      └─> Return AIResponse {answerIndex, confidence}
   
   c) Select Answer
      ├─> Random delay (500-1500ms) [human-like]
      ├─> Click answer button at index
      └─> Log action
   
   d) Confirm & Continue
      ├─> Random delay (1000-2000ms) [human-like]
      ├─> Click button.confirm-next
      ├─> Wait for next question to load
      └─> Loop back to step 3

4. Quiz Complete
   └─> Disconnect from browser
   └─> Exit
```

## Configuration Flow

```
config.json / .env
       │
       ▼
┌──────────────────────┐
│   Config Object      │
│                      │
│ - selectors          │
│   └─ questionContainer: ".question-container"
│   └─ answerButton: "button.btn.choice-link"  
│   └─ confirmButton: "button.confirm-next"
│                      │
│ - ai                 │
│   └─ provider: "openai"
│   └─ apiKey: "sk-..."
│   └─ model: "gpt-4"
│                      │
│ - browser            │
│   └─ debugPort: 9222
└──────────────────────┘
       │
       ▼
   All Components
```

## Key Design Decisions

### 1. Chrome DevTools Protocol (CDP)
- **Why**: Allows connecting to existing browser session
- **Benefit**: No need to launch new browser, preserves authentication
- **How**: Playwright's `connectOverCDP()` method

### 2. Human-Like Delays
- **Why**: Make automation undetectable
- **Implementation**: Random delays between 500-2000ms
- **Pattern**: No fixed timing that could be fingerprinted

### 3. Configurable Selectors
- **Why**: Support different quiz platforms
- **Benefit**: No code changes needed for different sites
- **Format**: Standard CSS selectors in JSON config

### 4. OpenAI Integration
- **Why**: Accurate question answering
- **API**: Chat Completions API with system prompts
- **Temperature**: 0.3 for consistent answers

### 5. TypeScript
- **Why**: Type safety, better IDE support
- **Benefits**: Catch errors at compile time, better documentation
- **Build**: Transpiles to CommonJS for Node.js

## Security Features

1. **API Key Management**
   - Supports environment variables
   - Never committed to git (.gitignore)
   - Can be stored in .env file

2. **No Vulnerable Dependencies**
   - Regular security scans
   - CodeQL analysis
   - GitHub Advisory checks

3. **Minimal Permissions**
   - Only reads from browser
   - Only clicks specified elements
   - No code injection

## Error Handling

```
Try-Catch blocks at:
- Browser connection
- Question extraction
- AI API calls
- Button clicking
- Navigation

Errors are:
- Logged to console
- Propagated up
- Handled gracefully
- User-friendly messages
```

## Extension Points

### For Developers: What You Can Customize

The architecture is designed with clear extension points for different use cases:

### 1. Configuration-Based (No Code Changes) ✅

**File**: `config.json`

```json
{
  "selectors": {
    "questionContainer": ".your-selector",  // ← Change for your quiz
    "answerButton": ".your-button-class",   // ← Change for your quiz
    "confirmButton": "#your-next-button"    // ← Change for your quiz
  },
  "ai": {
    "model": "gpt-4o-mini"  // ← Use different OpenAI models
  },
  "browser": {
    "debugPort": 9222  // ← Use different debug port
  }
}
```

**When this is enough**: Your quiz has a simple structure with buttons, single container, standard confirmation flow.

### 2. Answer Extraction Logic (Code Changes Required) ⚠️

**File**: `src/browser.ts`, line 50

**Current implementation** (specific to original use case):
```typescript
const answerOptions = await this.page.locator(
  `${this.config.selectors.questionContainer} a.option.option-selector`
).all();
```

**When you need to change this**:
- Answers are not inside the question container
- Answers have a different DOM structure
- You need to handle dropdowns, radio buttons, or checkboxes
- Multiple answer containers on the page

**Example customization**:
```typescript
// For answers outside question container
const answerOptions = await this.page.locator(
  this.config.selectors.answerButton
).all();

// For grouped answers
const groups = await this.page.locator('.answer-group').all();
// ... process each group
```

### 3. AI Prompt Engineering (Easy Code Changes) ✅

**File**: `src/ai.ts`, `buildPrompt()` method

**When to customize**:
- Your quiz has special formatting (code, math, etc.)
- You want to provide additional context to the AI
- Questions have images or media
- You need to adjust how multi-select questions are handled

**Example**:
```typescript
private buildPrompt(question: Question): string {
  let prompt = `You are answering a technical quiz about ${this.config.subject}.\n\n`;
  prompt += `Question: ${question.text}\n\nAnswer options:\n`;
  // ... rest of prompt
}
```

### 4. Human-Like Timing (Easy Code Changes) ✅

**File**: `src/browser.ts`, various methods

| Method | What It Controls | Line # |
|--------|------------------|--------|
| `simulateReading()` | Reading time (4-8 seconds) | 129 |
| `clickAnswer()` | Thinking time (800-2000ms) | 82 |
| `clickAnswer()` | Hesitation probability (15%) | 85 |
| `clickConfirm()` | Review time (1.2-2.5s) | 100 |

**Example customization**:
```typescript
// Make it faster for testing
const baseReadingTime = 1000 + Math.random() * 1000; // 1-2 seconds

// Remove hesitation for speed
// Comment out lines 85-88

// Make confirmation instant
await this.randomDelay(100, 200); // Very quick
```

### 5. Different AI Providers (Moderate Code Changes) 📝

**Files**: `src/ai.ts`, `src/types.ts`

**Current**: Only OpenAI supported

**To add new provider**:
1. Update `AIHelper` class to accept provider in constructor
2. Create provider-specific API calls
3. Update config schema
4. Handle different response formats

**Example structure**:
```typescript
class AIHelper {
  private provider: AIProvider;
  
  constructor(config: Config) {
    switch(config.ai.provider) {
      case 'openai':
        this.provider = new OpenAIProvider(config);
        break;
      case 'anthropic':
        this.provider = new AnthropicProvider(config);
        break;
    }
  }
}
```

### 6. Complex Question Extraction (Advanced Code Changes) 🔴

**File**: `src/browser.ts`, `extractQuestion()` method

**When needed**:
- Questions with images, videos, or code blocks
- Multi-part questions
- Questions split across multiple DOM elements
- Need to capture additional context (hints, examples)

**Example - Adding image support**:
```typescript
async extractQuestion(): Promise<Question> {
  const questionContainer = await this.page.locator(
    this.config.selectors.questionContainer
  ).first();
  
  const questionText = await questionContainer.innerText();
  
  // NEW: Extract image if present
  const images = await questionContainer.locator('img').all();
  const imageUrls = await Promise.all(
    images.map(img => img.getAttribute('src'))
  );
  
  // ... extract answers ...
  
  return {
    text: questionText,
    answers,
    imageUrls  // NEW field
  };
}
```

### 7. Adding New Features (Design Your Own) 💡

The architecture supports adding:

- **Progress tracking**: Save state between runs
- **Answer verification**: Log correct/incorrect
- **Screenshot capture**: Document each question
- **Multi-quiz support**: Handle quiz lists
- **Parallel processing**: Answer multiple quizzes
- **Custom reporting**: Export results to CSV/JSON

**Example - Adding screenshot feature**:
```typescript
// In quiz-helper.ts, after extractQuestion()
await this.page.screenshot({ 
  path: `question-${questionNumber}.png` 
});
```

## Recommended Customization Path

For other developers using this as a starting point:

1. **Start**: Test with example quiz (no changes needed)
2. **Easy**: Update selectors in config.json for your quiz
3. **Medium**: Modify answer extraction if structure differs
4. **Advanced**: Adjust timing, AI prompts, or add features
5. **Expert**: Add new providers, complex extraction, new features

See [CUSTOMIZATION.md](../CUSTOMIZATION.md) for detailed examples of each level.
