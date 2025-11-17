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

To adapt for different quiz platforms:

1. **Update Selectors** (config.json)
   - questionContainer: CSS selector for question area
   - answerButton: CSS selector for answer choices
   - confirmButton: CSS selector for next/submit button

2. **Modify AI Prompt** (src/ai.ts)
   - Adjust system message
   - Change prompt format
   - Handle different response formats

3. **Custom Delays** (src/browser.ts)
   - Adjust randomDelay() parameters
   - Add platform-specific timing

4. **Different AI Provider** (src/ai.ts)
   - Add support for Anthropic, Google, etc.
   - Implement provider interface
   - Update config structure
