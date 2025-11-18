# Setup & Installation

Complete setup guide for ai-quiz-automation.

## Requirements

- Node.js 18 or higher
- Chrome or Chromium browser
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

## Installation Steps

### 1. Clone and Install

```bash
git clone https://github.com/bcanfield/ai-quiz-automation.git
cd ai-quiz-automation
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Configure API Key

Create a `.env` file:

```bash
echo "OPENAI_API_KEY=your-actual-api-key" > .env
```

Or export it in your shell:

```bash
export OPENAI_API_KEY=your-actual-api-key
```

### 4. Create Configuration

```bash
cp config.example.json config.json
```

The default configuration works with the included `example-quiz.html` for testing.

## Starting Chrome with Debugging

The tool needs to connect to Chrome via the Chrome DevTools Protocol. Start Chrome with remote debugging enabled:

### macOS

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug-profile
```

**Note:** The `--user-data-dir` flag with a temp directory ensures Chrome starts fresh with debugging enabled.

### Windows

```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

### Linux

```bash
google-chrome --remote-debugging-port=9222
```

## Testing Your Setup

1. With Chrome running with debugging enabled, open the example quiz:
   ```bash
   open example-quiz.html  # macOS
   # Or navigate to file:///path/to/ai-quiz-automation/example-quiz.html
   ```

2. Run the tool:
   ```bash
   npm start
   ```

3. Watch it automatically answer the three example questions.

## What's Next?

Once you've verified the tool works with the example quiz:

- Read **[Adapting the Tool](ADAPTING.md)** to use it with your own quiz site
- Check **[Configuration Guide](CONFIG.md)** for all available options
- See **[Troubleshooting](TROUBLESHOOTING.md)** if you run into issues
