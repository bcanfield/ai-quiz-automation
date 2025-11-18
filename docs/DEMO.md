# Quiz Helper Demo Guide

This guide shows how to run a live demo of the quiz-helper tool using the included example quiz.

## Prerequisites

1. **API Key**: Ensure your `.env` file has a valid OpenAI API key:
   ```bash
   OPENAI_API_KEY=sk-your-api-key-here
   ```

2. **Dependencies**: Install if you haven't already:
   ```bash
   npm install
   ```

3. **Chrome**: Google Chrome must be installed.

## Running the Demo

You'll need **3 terminal windows** open in this directory:

### Terminal 1: Start the Web Server

```bash
npm run demo
```

This serves the example quiz at `http://localhost:8000/example-quiz.html`

Leave this running.

### Terminal 2: Start Chrome with Remote Debugging

**macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug \
  http://localhost:8000/example-quiz.html
```

**Linux:**
```bash
google-chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug \
  http://localhost:8000/example-quiz.html
```

**Windows (PowerShell):**
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir=C:\temp\chrome-debug `
  http://localhost:8000/example-quiz.html
```

This will:
- Open Chrome with debugging enabled
- Load the example quiz page
- Use an isolated profile (won't interfere with your regular Chrome)

**Note:** If Chrome is already running, close it first, or the debugging flag won't work.

### Terminal 3: Run the Quiz Helper

Wait a few seconds for Chrome to fully load the page, then:

```bash
npm start
```

## What to Watch

The tool will:
1. Connect to the Chrome instance
2. Read the question: "What is the capital of France?"
3. Simulate thinking time (8-15 seconds)
4. Click "Paris"
5. Click "Confirm Answer"
6. Move to question 2: "What is 2 + 2?"
7. Click "4"
8. Continue to question 3: "Which planet is known as the Red Planet?"
9. Click "Mars"
10. Complete the quiz

The console output shows:
- Each question being processed
- AI's reasoning for each answer
- Timing delays to simulate human behavior

## Example Output

```
Starting Quiz Helper...
Connected to Chrome (version: ...)

--- Question 1 ---
Question: What is the capital of France?
Found 4 answer options
Reading question... (11s)
AI selected 1 answer(s):
  [1] Paris
Reasoning: Paris is the capital and largest city of France.
Clicking answer button 1: Paris
Confirm button clicked

--- Question 2 ---
Question: What is 2 + 2?
...

Quiz completed!
```

## Cleanup

Press `Ctrl+C` in each terminal to stop:
1. Terminal 1: Stops the web server
2. Terminal 2: Close Chrome window
3. Terminal 3: Tool has already exited

## Troubleshooting

**"Configuration file not found"**
- Make sure `config.json` exists in the project root
- The config is already set up for the example quiz

**"Failed to connect to Chrome"**
- Ensure Chrome is running with the `--remote-debugging-port=9222` flag
- Check that no other process is using port 9222

**"OPENAI_API_KEY not set"**
- Create or update your `.env` file with a valid API key
- Don't commit your `.env` file to git

**Tool clicks wrong elements**
- The CSS selectors in `config.json` are configured for `example-quiz.html`
- If you modify the HTML, update the selectors accordingly

## Adapting for Real Quizzes

To use this with a real quiz site:
1. See [ADAPTING.md](docs/ADAPTING.md) for detailed instructions
2. Update `config.json` with the correct CSS selectors for your target site
3. Read [ETHICAL_USE.md](docs/ETHICAL_USE.md) for important warnings
