# Testing Guide

This guide explains how to test the quiz-helper tool using the provided example quiz.

## Prerequisites

1. Node.js installed
2. Chrome browser installed
3. OpenAI API key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Create your configuration:
```bash
cp config.example.json config.json
```

4. Edit `config.json` and add your OpenAI API key

## Testing with Example Quiz

### Step 1: Open Example Quiz

1. Start Chrome with remote debugging:

**macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
```

**Windows:**
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

**Linux:**
```bash
google-chrome --remote-debugging-port=9222
```

2. In the Chrome window that opens, navigate to the example quiz:
```
file:///path/to/quiz-helper/example-quiz.html
```

Or start a local server:
```bash
npx http-server . -p 8080
```
Then open: `http://localhost:8080/example-quiz.html`

### Step 2: Run Quiz Helper

In a separate terminal, run:
```bash
npm start
```

Or with custom config:
```bash
npm start config.json
```

### Step 3: Observe

The quiz helper should:
1. Connect to your Chrome browser
2. Read the question text
3. Analyze the question using AI
4. Click the correct answer button
5. Click the confirm button
6. Repeat for all questions

## Expected Behavior

- The tool should correctly answer the questions in the example quiz:
  - Question 1: "Paris" (capital of France)
  - Question 2: "4" (2 + 2)
  - Question 3: "Mars" (the Red Planet)
- Random delays should make interactions appear natural
- Console output should show progress for each question

## Troubleshooting

### "Failed to connect to browser"
- Ensure Chrome is running with the `--remote-debugging-port=9222` flag
- Check that no other application is using port 9222

### Selectors Not Matching
The example quiz uses these selectors (which match the default config):
- Question container: `.question-container`
- Answer buttons: `button.btn.choice-link`
- Confirm button: `button.confirm-next`

If you're testing with a different quiz platform, update these selectors in your `config.json`.

### AI Gives Wrong Answers
- Try using a more capable model (e.g., `gpt-4` instead of `gpt-3.5-turbo`)
- Check that the question text is being extracted correctly
- Verify your OpenAI API key is valid and has sufficient credits

## Configuration Validation

Run the configuration validation test:
```bash
npm test
```

This will verify that your configuration file has all required fields.

## Manual Testing Checklist

- [ ] Tool connects to browser successfully
- [ ] Question text is extracted correctly
- [ ] All answer options are found
- [ ] Correct answer is selected
- [ ] Confirm button is clicked
- [ ] Tool proceeds to next question
- [ ] Tool completes when no more questions
- [ ] Random delays are applied (timing appears natural)
- [ ] No errors in console output

## Security Testing

The tool has been tested with:
- CodeQL security scanning (no vulnerabilities found)
- npm audit (no vulnerabilities found)
- GitHub Advisory Database (no vulnerable dependencies)

## Testing with Real Quiz Platforms

⚠️ **Important**: Before testing with real quiz platforms:

1. Ensure you have permission to use automation
2. Review the platform's terms of service
3. Test in a sandbox/demo environment first
4. Update selectors in `config.json` to match the platform's HTML structure

To find the correct selectors:
1. Open the quiz page in Chrome
2. Right-click on elements and select "Inspect"
3. Note the CSS classes and IDs
4. Update your config.json accordingly
