# Testing Guide

Verify the tool works with the included example quiz.

## Prerequisites

- Node.js installed
- OpenAI API key
- Chrome browser

## Steps

**1. Install and build:**
```bash
npm install && npm run build
```

**2. Add your API key:**
```bash
echo "OPENAI_API_KEY=your-key" > .env
```

**3. Start a local server for the example quiz:**
```bash
npm run demo
```
This serves `example-quiz.html` at `http://localhost:8000`

**4. In a new terminal, start Chrome with debugging:**

macOS:
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug \
  http://localhost:8000/example-quiz.html
```

Linux:
```bash
google-chrome --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug \
  http://localhost:8000/example-quiz.html
```

Windows:
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  --remote-debugging-port=9222 `
  --user-data-dir=C:\temp\chrome-debug `
  http://localhost:8000/example-quiz.html
```

**5. In another terminal, run the tool:**
```bash
npm start
```

## What You'll See

The tool will:
1. Connect to Chrome
2. Read each question (3 total)
3. Wait 4-8 seconds (simulating reading)
4. Select the correct answer
5. Click the confirm button
6. Move to the next question

Console output shows each step, including the AI's reasoning.

## Validate Your Config

Check your config file is valid:
```bash
npm test
```

## Next Steps

Once the example works:
- See [Adapting](ADAPTING.md) to use it on a real quiz site
- Check [Troubleshooting](TROUBLESHOOTING.md) if you hit issues
