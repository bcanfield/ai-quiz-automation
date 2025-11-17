# quiz-helper

A TypeScript-based automation tool that uses AI to answer quiz questions in an undetectable way. This is an ethical proof of concept that demonstrates browser automation and AI integration.

## Features

- **Browser Attachment**: Connects to an existing browser session (pre-authenticated)
- **Smart Text Extraction**: Reads question text from nested DOM elements (p tags, spans, etc.)
- **AI-Powered Answers**: Uses OpenAI to analyze questions and select correct answers
- **Human-Like Behavior**: Implements random delays to simulate natural interaction
- **Configurable Selectors**: Supports custom CSS selectors for different quiz platforms
- **Automatic Progression**: Clicks answer buttons and confirm buttons to move through quiz

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

## Configuration

1. Copy the example configuration:
```bash
cp config.example.json config.json
```

2. Edit `config.json` with your settings:
```json
{
  "selectors": {
    "questionContainer": ".question-container",
    "answerButton": "button.btn.choice-link",
    "confirmButton": "button.confirm-next"
  },
  "ai": {
    "provider": "openai",
    "apiKey": "YOUR_API_KEY_HERE",
    "model": "gpt-4"
  },
  "browser": {
    "debugPort": 9222
  }
}
```

### Configuration Options

- **selectors.questionContainer**: CSS selector for the element containing the question text
- **selectors.answerButton**: CSS selector for answer choice buttons
- **selectors.confirmButton**: CSS selector for the button to proceed to next question
- **ai.apiKey**: Your OpenAI API key (or set via `OPENAI_API_KEY` environment variable)
- **ai.model**: OpenAI model to use (e.g., "gpt-4", "gpt-3.5-turbo")
- **browser.debugPort**: Chrome debugging port (default: 9222)

## Usage

### Step 1: Start Chrome with Remote Debugging

Start Chrome with remote debugging enabled:

**macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-profile
```

> **Note for macOS**: Using `--user-data-dir` with a temporary directory is required to ensure Chrome starts with debugging enabled. If you need to use your existing Chrome profile, first close all Chrome instances completely before running the command.

**Windows:**
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

**Linux:**
```bash
google-chrome --remote-debugging-port=9222
```

### Step 2: Navigate to Quiz

Open your browser and navigate to the quiz page. Make sure you're logged in and ready to start.

### Step 3: Run Quiz Helper

Run the quiz helper:
```bash
npm start
```

Or specify a custom config file:
```bash
npm start path/to/config.json
```

## How It Works

1. **Connection**: Connects to your running Chrome browser via Chrome DevTools Protocol (CDP)
2. **Detection**: Locates the question container and reads all nested text content
3. **Analysis**: Sends the question and answer choices to OpenAI for analysis
4. **Selection**: Clicks the button corresponding to the AI-selected answer
5. **Progression**: Clicks the confirm button to move to the next question
6. **Repeat**: Continues until no more questions are found

## Human-Like Behavior

The tool implements several features to make interactions appear natural:

- Random delays between actions (500-1500ms for clicks, 1000-2000ms for navigation)
- Uses standard browser automation (Playwright) that mimics real user interactions
- No detectable patterns in timing or behavior

## Security & Ethics

⚠️ **Important**: This tool is provided as a proof of concept for educational purposes. Consider the following:

- Always ensure you have permission to automate interactions on the target website
- Be aware of terms of service for quiz platforms you interact with
- Use responsibly and ethically
- API keys should be kept secure and never committed to version control

## Development

### Build
```bash
npm run build
```

### Development Mode (with auto-reload)
```bash
npm run dev
```

## Troubleshooting

### "Failed to connect to browser"
- Ensure Chrome is running with `--remote-debugging-port=9222`
- Check that the debug port in your config matches the one Chrome is using

### "No browser contexts found"
- Make sure you have at least one Chrome window/tab open

### "Invalid answer index from AI"
- The AI might not have understood the question format
- Try using a more capable model (e.g., "gpt-4" instead of "gpt-3.5-turbo")
- Check that your selectors are correctly extracting question text

### Selectors Not Working
- Use browser DevTools to inspect the quiz page structure
- Update the selectors in your config.json to match the actual DOM structure
- Ensure selectors are specific enough to target the right elements

## License

ISC

## Disclaimer

This software is for educational and research purposes only. Users are responsible for ensuring their use complies with applicable laws, regulations, and terms of service.