---
layout: default
title: Home
---

# AI Quiz Automation

A browser automation tool that connects to Chrome and uses AI to answer quiz questions. Built as a proof of concept for learning about browser automation and AI integration.

⚠️ **Important:** This is for educational purposes only. Read the [Ethical Use Guidelines](ETHICAL_USE.html) before proceeding.

## Quick Start

```bash
# Install dependencies
npm install && npm run build

# Add your OpenAI API key
echo "OPENAI_API_KEY=your-key" > .env

# Copy and edit config for your quiz site
cp config.example.json config.json

# Start Chrome with debugging enabled
chrome --remote-debugging-port=9222

# Run the tool
npm start
```

## Documentation

### Getting Started
- **[Setup](SETUP.md)** - Installation and configuration
- **[Testing](TESTING.md)** - Run the example quiz to verify it works
- **[Adapting](ADAPTING.md)** - Configure for different quiz sites

### Reference
- **[Configuration](CONFIG.md)** - All configuration options
- **[Architecture](ARCHITECTURE.md)** - How the code works
- **[Troubleshooting](TROUBLESHOOTING.md)** - Solutions to common issues

## ⚠️ Ethics & Legal Notice

**This tool is for learning purposes only.** Using automation on real assessments:
- Violates academic integrity policies
- May be illegal under computer fraud laws
- Defeats the purpose of education
- Can result in expulsion or degree revocation

See **[Ethical Use Guidelines](ETHICAL_USE.html)** for complete details.

## How It Works

The tool uses:
- **Chrome DevTools Protocol** to connect to an existing browser session
- **Playwright** for browser automation
- **OpenAI** to analyze questions and select answers
- **CSS selectors** to find questions and answer buttons on any quiz site

You configure it by identifying three things on your quiz page:
1. Where the question text appears
2. Where the answer buttons are
3. Where the confirm/next button is

The tool handles the rest—extracting text, asking the AI, and clicking buttons with human-like timing.

## Contributing

Found a bug or have an improvement? Open an issue or submit a pull request.

## License

ISC - See LICENSE file for details.
