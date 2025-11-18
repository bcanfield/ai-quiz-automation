# Architecture

How the code works.

## High-Level Overview

```
┌─────────────────────────────────────────────────┐
│           CLI Entry Point (index.ts)             │
│  - Loads config                                  │
│  - Validates environment                         │
│  - Starts QuizHelper                             │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│         QuizHelper (ai-quiz-automation.ts)              │
│  Main orchestration loop:                        │
│  1. Connect to browser                           │
│  2. While questions exist:                       │
│     - Extract question                           │
│     - Get AI answer                              │
│     - Click answer                               │
│     - Click confirm                              │
└────────┬──────────────────────┬─────────────────┘
         │                      │
         ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│  BrowserHelper   │   │    AIHelper      │
│  (browser.ts)    │   │    (ai.ts)       │
│                  │   │                  │
│ Controls Chrome  │   │ Talks to OpenAI  │
│ via Playwright   │   │                  │
└────────┬─────────┘   └────────┬─────────┘
         │                      │
         ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│  Chrome Browser  │   │   OpenAI API     │
└──────────────────┘   └──────────────────┘
```

## Key Components

### 1. CLI Entry Point (`src/index.ts`)

The script that runs when you execute `npm start`.

**Responsibilities:**
- Load configuration from `config.json`
- Load environment variables (`.env`)
- Validate that `OPENAI_API_KEY` is set
- Create and start `QuizHelper` instance

### 2. QuizHelper (`src/ai-quiz-automation.ts`)

The main coordinator that runs the automation loop.

**Responsibilities:**
- Connect to browser
- Loop through questions until none remain
- Coordinate between browser and AI components
- Handle errors gracefully

**Key method:** `start()` - The main loop

### 3. BrowserHelper (`src/browser.ts`)

Handles all browser interactions via Playwright.

**Key methods:**
- `connect()` - Connect to Chrome via CDP
- `extractQuestion()` - Get question text and answer options from page
- `clickAnswer(index)` - Click an answer button
- `clickConfirm()` - Click the next/confirm button
- `hasMoreQuestions()` - Check if there are more questions to answer
- `simulateReading()` - Wait with human-like timing

**Human-like behavior:**
- Random delays (800-2500ms between actions)
- Occasional hesitation (15% chance)
- Simulated reading time (4-8 seconds per question)
- Random mouse movements during reading
- Variable pauses before confirming

### 4. AIHelper (`src/ai.ts`)

Interfaces with OpenAI to analyze questions.

**Key method:**
- `analyzeQuestion(question)` - Send question to AI and get answer

**How it works:**
1. Builds a prompt with question text and answer options
2. Instructs AI to identify if it's single or multi-select
3. Uses structured output (Zod schema) to ensure valid response
4. Returns answer index/indices and reasoning

**AI Instructions:**
- Default to single answer unless question explicitly says otherwise
- Look for phrases like "select all that apply" or "choose 2 answers"
- Provide reasoning for the choice

### 5. Type Definitions (`src/types.ts`)

TypeScript interfaces for type safety:
- `Config` - Configuration file structure
- `Question` - Question text + answer array
- `AIResponse` - AI's answer selection + reasoning

## Data Flow

```
1. User runs: npm start

2. index.ts loads config.json and .env
   └─> Creates QuizHelper instance

3. QuizHelper.start() begins
   └─> BrowserHelper.connect()
       └─> Connects to Chrome on port 9222

4. Main loop begins:
   
   ┌─> BrowserHelper.hasMoreQuestions()
   │   └─> Checks if question container exists
   │
   ├─> BrowserHelper.extractQuestion()
   │   ├─> Finds question container
   │   ├─> Extracts all text content
   │   ├─> Finds all answer buttons
   │   └─> Returns Question object
   │
   ├─> BrowserHelper.simulateReading()
   │   └─> Waits 4-8 seconds with micro-delays
   │
   ├─> AIHelper.analyzeQuestion()
   │   ├─> Builds prompt
   │   ├─> Calls OpenAI API
   │   ├─> Parses structured response
   │   └─> Returns AIResponse
   │
   ├─> BrowserHelper.clickAnswer(index)
   │   ├─> Waits 800-2000ms
   │   ├─> Maybe hesitates (15% chance)
   │   └─> Clicks the button
   │
   └─> BrowserHelper.clickConfirm()
       ├─> Waits 1200-2500ms
       ├─> Clicks confirm button
       └─> Waits for next page (1500-2500ms)

5. Loop continues until hasMoreQuestions() returns false

6. Browser disconnects, process exits
```

## Design Decisions

### Why Chrome DevTools Protocol?

Using CDP (via Playwright's `connectOverCDP`) lets us:
- Connect to an **existing** Chrome session
- Preserve authentication/cookies
- Not need to manage browser lifecycle
- Work with any site the user can access

Alternative would be launching a new browser, which would require re-authentication for each run.

### Why Random Delays?

To make automation less detectable:
- Fixed timing patterns are easy to fingerprint
- Random delays simulate human variability
- Different delay ranges for different actions (reading vs clicking)
- Occasional "hesitation" mimics real human behavior

### Why Configurable Selectors?

Every quiz site has different HTML structure. Making selectors configurable means:
- No code changes needed for different sites
- Users can adapt it themselves
- One codebase supports many platforms

### Why TypeScript?

- Type safety catches errors early
- Better IDE support and autocomplete
- Self-documenting interfaces
- Transpiles to JavaScript for Node.js

### Why OpenAI's Structured Output?

Using `generateObject()` with a Zod schema ensures:
- AI response is always valid JSON
- We get exactly the fields we need
- No parsing errors or unexpected formats
- Type-safe response handling

## Extension Points

Want to modify the tool? Here's what to change:

### Use a Different AI Provider

Edit `src/ai.ts`:
- Import your provider's SDK
- Modify `analyzeQuestion()` to call their API
- Update config schema to support provider-specific options

### Add More Human-Like Behaviors

Edit `src/browser.ts`:
- Add scroll simulation
- Add reading pattern tracking
- Vary delays based on question complexity
- Add mouse hover over answers before clicking

### Support Different Question Types

Edit `src/ai.ts`:
- Update the prompt to handle new formats
- Add detection for other multi-answer indicators
- Handle ranking questions, true/false, fill-in-blank, etc.

### Add Logging/Analytics

Edit `src/ai-quiz-automation.ts`:
- Track success rate
- Log all questions and answers to a file
- Record timing for each question
- Export results to CSV

## Security

### API Key Handling

- Never stored in `config.json`
- Only in environment variables or `.env`
- `.env` is gitignored
- Loaded via `dotenv` package

### No Vulnerable Dependencies

Project uses:
- CodeQL scanning
- npm audit
- GitHub Advisory Database checks

### Minimal Permissions

The tool only:
- Reads from the browser DOM
- Clicks specified elements
- Never injects code or modifies page content

## File Structure

```
ai-quiz-automation/
├── src/
│   ├── index.ts          # Entry point
│   ├── ai-quiz-automation.ts    # Main orchestrator
│   ├── browser.ts        # Browser automation
│   ├── ai.ts             # OpenAI integration
│   └── types.ts          # TypeScript interfaces
├── test/
│   └── config-validation.ts  # Config checker
├── docs/
│   ├── SETUP.md          # Installation guide
│   ├── ADAPTING.md       # How to adapt for your site
│   ├── CONFIG.md         # Configuration reference
│   ├── TROUBLESHOOTING.md  # Common problems
│   └── ARCHITECTURE.md   # This file
├── config.example.json   # Example configuration
├── example-quiz.html     # Test quiz page
├── package.json          # Dependencies & scripts
└── tsconfig.json         # TypeScript config
```

## Build Process

```bash
npm run build
```

This runs TypeScript compiler (`tsc`) which:
1. Reads `tsconfig.json`
2. Compiles all `.ts` files in `src/`
3. Outputs to `dist/` directory
4. Includes type checking and error reporting

The compiled JavaScript in `dist/` is what actually runs when you use `npm start`.
