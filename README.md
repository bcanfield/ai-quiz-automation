# quiz-helper

A TypeScript-based automation tool that uses AI to answer quiz questions. This tool connects to your existing browser session, analyzes quiz questions using AI, and automatically selects answers with human-like behavior patterns.

## 🎯 What is this?

Quiz-helper is a **customizable framework** for automating quiz interactions. It's designed to be a starting point that you can adapt to your specific quiz platform by simply updating CSS selectors in a configuration file.

**Perfect for:**
- Automating repetitive training quizzes
- Testing quiz platforms during development
- Educational research on quiz-taking patterns
- Learning browser automation with Playwright

**Not recommended for:**
- Academic dishonesty or cheating on exams
- Violating website terms of service
- Any unethical use cases

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone and install
git clone https://github.com/bcanfield/quiz-helper.git
cd quiz-helper
npm install

# 2. Set up configuration
cp config.example.json config.json
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# 3. Build
npm run build

# 4. Start Chrome with debugging (in one terminal)
# macOS:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug

# 5. Open example quiz in Chrome
# Navigate to: file:///path/to/quiz-helper/example-quiz.html

# 6. Run quiz-helper (in another terminal)
npm start

# Watch it automatically answer the quiz! 🎉
```

**Next Steps**: Adapt it for your quiz platform using [EXAMPLES.md](EXAMPLES.md) or [CUSTOMIZATION.md](CUSTOMIZATION.md)

## ✨ Key Features

- **🔌 Browser Attachment**: Connects to your existing Chrome session (keeps your login/authentication)
- **🧠 AI-Powered Analysis**: Uses OpenAI GPT models to understand and answer questions
- **🤖 Human-Like Behavior**: Random delays, mouse movements, and hesitation patterns
- **⚙️ Highly Configurable**: Change quiz platforms by just updating CSS selectors
- **📝 Multi-Answer Support**: Handles both single-choice and "select all that apply" questions
- **🎨 Easy Customization**: TypeScript codebase designed for extension and modification

## 🎓 For Developers: Using This as a Starting Point

This project is **intentionally designed to be customized**. Here's what you can adapt:

- **CSS Selectors** (config.json): Match any quiz platform's HTML structure
- **AI Provider** (code): Currently OpenAI, but structured to support others
- **Timing Patterns** (code): Adjust delays to match your needs
- **Extraction Logic** (code): Handle complex question formats, images, etc.

### 📚 Documentation for Developers

- **[EXAMPLES.md](EXAMPLES.md)** - Ready-to-use configurations for common quiz platforms
- **[CUSTOMIZATION.md](CUSTOMIZATION.md)** - Complete guide on adapting this tool
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical details and extension points
- **[TESTING.md](TESTING.md)** - How to test your customizations

## Prerequisites

- Node.js (v18 or higher)
- Chrome/Chromium browser
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bcanfield/quiz-helper.git
cd quiz-helper
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## ⚙️ Configuration

### Quick Setup

1. **Copy the example config:**
```bash
cp config.example.json config.json
```

2. **Set your OpenAI API key:**

Either in `.env` file:
```bash
cp .env.example .env
# Edit .env and add your key
OPENAI_API_KEY=sk-your-key-here
```

Or export it:
```bash
export OPENAI_API_KEY=sk-your-key-here
```

3. **Update selectors for your quiz platform:**

Edit `config.json` with your quiz's CSS selectors:
```json
{
  "selectors": {
    "questionContainer": ".question-container",
    "answerButton": "a.btn.choice-link",
    "confirmButton": "#confirm-choice"
  },
  "ai": {
    "provider": "openai",
    "model": "gpt-4o-mini"
  },
  "browser": {
    "debugPort": 9222
  }
}
```

### Finding the Right Selectors

**Don't know what selectors to use?** Here's how to find them:

1. Open your quiz page in Chrome
2. Right-click on the question text → **Inspect**
3. In DevTools, right-click the highlighted element → **Copy** → **Copy selector**
4. Paste into your config.json

Repeat for answer buttons and the confirm/next button.

**Tip**: Test your selectors in Chrome DevTools Console:
```javascript
document.querySelectorAll('.your-selector')  // Should return the elements you expect
```

### Configuration Reference

| Field | Description | Example |
|-------|-------------|---------|
| `selectors.questionContainer` | Element containing question text | `.question-text`, `#quiz-question` |
| `selectors.answerButton` | Clickable answer elements | `button.answer`, `.choice-btn` |
| `selectors.confirmButton` | Button to proceed to next question | `#next-btn`, `.confirm` |
| `ai.provider` | AI provider (currently only "openai") | `openai` |
| `ai.model` | OpenAI model to use | `gpt-4o-mini`, `gpt-4`, `gpt-3.5-turbo` |
| `browser.debugPort` | Chrome remote debugging port | `9222` (default) |

> **Note**: API key is read from `OPENAI_API_KEY` environment variable, not from config.json (for security)

## 🚀 Usage

### First Time? Start with the Example Quiz

Before using with a real quiz platform, test with the included example:

```bash
# 1. Build the project
npm run build

# 2. Start Chrome with debugging
# macOS:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug

# Windows:
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222

# Linux:
google-chrome --remote-debugging-port=9222

# 3. In Chrome, open the example quiz
# Navigate to: file:///path/to/quiz-helper/example-quiz.html
# Or run: npx http-server . -p 8080
# Then open: http://localhost:8080/example-quiz.html

# 4. Run quiz-helper (in a new terminal)
npm start
```

Watch as it automatically answers the three example questions!

### Using with Your Quiz Platform

Once the example works:

1. **Start Chrome with remote debugging** (see commands above)

   > **macOS Note**: The `--user-data-dir` flag creates a separate profile. If you need your existing profile (for saved logins), close ALL Chrome instances first, then run without that flag.

2. **Navigate to your quiz** in the Chrome window that opened

3. **Log in** and get to the first question

4. **Update your config.json** with the correct selectors for your quiz platform (see Configuration section above)

5. **Run quiz-helper** in a separate terminal:
   ```bash
   npm start
   ```

The tool will:
- ✅ Connect to your Chrome browser
- ✅ Read the question text
- ✅ Send it to OpenAI for analysis
- ✅ Click the correct answer(s)
- ✅ Click confirm/next button
- ✅ Repeat until quiz is complete

### Pro Tips

- **Test selectors first**: Open Chrome DevTools Console and test your selectors with `document.querySelectorAll('.your-selector')`
- **Watch the console**: The tool logs each step so you can see what it's doing
- **Start slow**: Use the example quiz to verify everything works before trying your actual quiz
- **Keep Chrome visible**: Don't minimize the window - let the tool click in the foreground

## 🔧 How It Works

```
┌─────────────────┐
│  Your Chrome    │  ← You open quiz page & log in
│  Browser        │
└────────┬────────┘
         │ Chrome DevTools Protocol (CDP)
         │ on port 9222
         ▼
┌─────────────────┐
│  Quiz Helper    │  ← Connects to your Chrome
│  (This Tool)    │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│Extract │ │Send to AI│
│Question│ │(OpenAI)  │
└───┬────┘ └────┬─────┘
    │           │
    └─────┬─────┘
          ▼
    ┌──────────┐
    │Click the │
    │Answer(s) │
    └────┬─────┘
         ▼
    ┌──────────┐
    │  Click   │
    │ Confirm  │
    └────┬─────┘
         ▼
    Repeat until done
```

### Detailed Flow

1. **Connection**: Uses Playwright to connect to Chrome via CDP (no new browser launch needed!)
2. **Extraction**: Finds question container, reads all text, finds answer buttons
3. **AI Analysis**: Sends question + answers to OpenAI, which returns the correct answer index(es)
4. **Human Simulation**: Waits 4-8 seconds (reading time), moves mouse occasionally
5. **Answer Selection**: Clicks answer button(s) with 800-2000ms thinking delay
6. **Confirmation**: Waits 1.2-2.5s (review time), clicks confirm button
7. **Next Question**: Waits for page to load, repeats from step 2

All delays are randomized to appear natural and avoid detection patterns.

## 🕐 Human-Like Behavior

Quiz-helper implements realistic patterns to mimic human quiz-taking:

| Behavior | Implementation | Customizable? |
|----------|---------------|---------------|
| **Reading Time** | 4-8 seconds per question, occasionally longer | ✅ Yes (code) |
| **Mouse Movement** | Random small movements during reading | ✅ Yes (code) |
| **Thinking Time** | 800-2000ms before clicking answer | ✅ Yes (code) |
| **Hesitation** | 15% chance to pause and reconsider (1-2.5s) | ✅ Yes (code) |
| **Review Time** | 1.2-2.5s pause before confirming | ✅ Yes (code) |
| **Multi-Select Delay** | 800-2000ms between multiple answer selections | ✅ Yes (code) |

**Want to adjust these?** See [CUSTOMIZATION.md](CUSTOMIZATION.md) for details on modifying timing patterns.

## Security & Ethics

⚠️ **Important**: This tool is provided as a proof of concept for educational purposes. Consider the following:

- Always ensure you have permission to automate interactions on the target website
- Be aware of terms of service for quiz platforms you interact with
- Use responsibly and ethically
- API keys should be kept secure and never committed to version control

## 👨‍💻 Development & Customization

### Scripts

```bash
npm run build    # Compile TypeScript to JavaScript
npm run dev      # Run with auto-reload (great for testing changes)
npm start        # Run the compiled version
npm test         # Validate configuration file structure
```

### Project Structure

```
quiz-helper/
├── src/
│   ├── index.ts        # Entry point, loads config
│   ├── quiz-helper.ts  # Main orchestrator
│   ├── browser.ts      # Browser automation (Playwright)
│   ├── ai.ts           # OpenAI integration
│   └── types.ts        # TypeScript interfaces
├── test/
│   └── config-validation.ts  # Config validation test
├── config.json         # Your configuration (not in git)
├── config.example.json # Example configuration
├── example-quiz.html   # Test quiz page
├── README.md           # This file
├── CUSTOMIZATION.md    # Detailed customization guide
├── ARCHITECTURE.md     # Technical architecture
└── TESTING.md          # Testing guide
```

### Extending the Tool

**Want to customize for your quiz platform?** Check out:

- **[CUSTOMIZATION.md](CUSTOMIZATION.md)** - Complete guide for adapting to different quiz platforms
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Understand the codebase structure
- **[TESTING.md](TESTING.md)** - How to test your changes

### Quick Customization Examples

**Change timing to be faster:**
```typescript
// In src/browser.ts, line 135
const baseReadingTime = 2000 + Math.random() * 2000; // 2-4 seconds instead of 4-8
```

**Support dropdown answers:**
```typescript
// In src/browser.ts, add new method
async selectDropdownAnswer(answerIndex: number): Promise<void> {
  const dropdown = await this.page.locator('select.answer-dropdown');
  await dropdown.selectOption({ index: answerIndex });
}
```

**Add support for image questions:**
```typescript
// In src/browser.ts, modify extractQuestion()
const imageUrl = await questionContainer.locator('img').getAttribute('src');
return { text: questionText, answers, imageUrl };
```

## 🔍 Troubleshooting

### Common Issues

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| "Failed to connect to browser" | Chrome not running with debug port | Start Chrome with `--remote-debugging-port=9222` |
| "No browser contexts found" | No Chrome window open | Open at least one Chrome tab |
| "No answer options found" | Wrong selectors | Inspect your quiz page, update `config.json` selectors |
| AI selects wrong answers | Poor question extraction | Check console to see extracted text; verify selectors |
| Clicks don't register | Elements not ready | Quiz may need code changes (see CUSTOMIZATION.md) |
| "OPENAI_API_KEY not set" | Missing API key | Run `export OPENAI_API_KEY=your-key` or add to `.env` |

### Debugging Steps

1. **Start with the example quiz** - If that works, issue is with your config
2. **Check the console output** - Tool logs each step
3. **Test your selectors in DevTools Console**:
   ```javascript
   // Should return 1 element (the question)
   document.querySelectorAll('.question-container').length
   
   // Should return your answer options
   document.querySelectorAll('button.answer').length
   ```
4. **Enable Playwright debug mode**:
   ```bash
   DEBUG=pw:api npm start
   ```
5. **Check what text is being extracted** - Look for "Question:" in console output

### Still Stuck?

See [CUSTOMIZATION.md](CUSTOMIZATION.md) for detailed guidance on adapting to different quiz platforms, or check [TESTING.md](TESTING.md) for step-by-step testing instructions.

## 🎨 What's Configurable vs What's Hard-Coded

Understanding what you can change without touching code vs what requires code changes:

### ✅ Configurable (config.json only)

- CSS selectors for question, answers, confirm button
- AI model choice (gpt-4, gpt-4o-mini, etc.)
- Browser debug port
- These work for **most** standard quiz platforms

### ⚠️ May Need Code Changes

- **Answer extraction logic** (`src/browser.ts:50`) - If answers aren't inside question container or have unique structure
- **Timing patterns** (`src/browser.ts`) - If you want faster/slower interactions
- **AI prompts** (`src/ai.ts`) - For special question formats
- **Complex DOM structures** - Multi-part questions, images, etc.

### 🔍 Current Implementation Details

The original implementation is configured for a specific quiz platform with:
- Questions in `.question-container`
- Answers as `<a>` links with classes `.option.option-selector` **inside** the question container
- Confirm button with ID `#confirm-choice`
- Human-like delays: 4-8s reading, 800-2000ms thinking
- Support for single and multiple-choice questions

**Your platform different?** That's expected! See:
- [EXAMPLES.md](EXAMPLES.md) - Pre-made configs for common platforms
- [CUSTOMIZATION.md](CUSTOMIZATION.md) - How to modify for your platform
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical details for advanced customization

## 📖 Additional Documentation

- **[EXAMPLES.md](EXAMPLES.md)** - Configuration examples for 8+ common quiz types
- **[CUSTOMIZATION.md](CUSTOMIZATION.md)** - 400+ line guide for adapting to your platform
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design and extension points
- **[TESTING.md](TESTING.md)** - How to test and validate your changes

## License

ISC

## Disclaimer

This software is for educational and research purposes only. Users are responsible for ensuring their use complies with applicable laws, regulations, and terms of service.