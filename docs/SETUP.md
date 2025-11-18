# Setup & Installation

## Requirements

- Node.js 18+
- Chrome browser
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

## Install

```bash
git clone https://github.com/bcanfield/ai-quiz-automation.git
cd ai-quiz-automation
npm install && npm run build
```

## Configure

**1. Add your API key:**
```bash
echo "OPENAI_API_KEY=your-key" > .env
```

**2. Copy the example config:**
```bash
cp config.example.json config.json
```

The default config works with `example-quiz.html` for testing.

## Start Chrome with Debugging

The tool connects to Chrome using the Chrome DevTools Protocol.

**macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug
```

**Linux:**
```bash
google-chrome --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug
```

**Windows:**
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir=C:\temp\chrome-debug
```

The `--user-data-dir` flag uses a temporary profile so your normal Chrome isn't affected.

## Test It

See [Testing](TESTING.md) for a complete walkthrough of running the example quiz.

## Next Steps

- [Testing](TESTING.md) - Verify it works
- [Adapting](ADAPTING.md) - Configure for your quiz site
- [Troubleshooting](TROUBLESHOOTING.md) - Fix common issues
