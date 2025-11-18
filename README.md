<div align="center">

# 🤖 AI Quiz Automation

**AI-powered browser automation using Chrome DevTools Protocol**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

[📚 **Full Documentation**](https://bcanfield.github.io/quiz-helper/) • [🚀 Quick Start](#quick-start) • [⚙️ Configuration](https://bcanfield.github.io/quiz-helper/CONFIG.html)

![Demo](.github/demo.gif)

</div>

---

## Overview

A proof-of-concept tool demonstrating AI integration with browser automation. Connects to Chrome via DevTools Protocol, extracts quiz questions using CSS selectors, and uses OpenAI to generate answers.

**⚠️ Educational use only** — See [ethical guidelines](https://bcanfield.github.io/quiz-helper/ETHICAL_USE.html)

## Quick Start

```bash
# Install dependencies
npm install

# Add OpenAI API key
echo "OPENAI_API_KEY=your-key-here" > .env

# Configure selectors for your quiz site
cp config.example.json config.json

# Start Chrome with debugging enabled (macOS shown - see Setup Guide for other OS)
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Run the automation
npm start
```

## Key Features

- 🔌 **Chrome DevTools Protocol** — Connect to existing browser sessions
- 🎯 **CSS Selector Configuration** — Adapt to any quiz site in minutes
- 🤖 **OpenAI Integration** — AI powered answer selection
- ⏱️ **Human-like Timing** — Configurable delays for realistic interaction
- 📝 **Multi-select Detection** — Automatically handles different question types

## Documentation

📘 Visit **[bcanfield.github.io/quiz-helper](https://bcanfield.github.io/quiz-helper/)** for complete documentation:

- **[Setup Guide](https://bcanfield.github.io/quiz-helper/SETUP.html)** — Installation and configuration
- **[Testing](https://bcanfield.github.io/quiz-helper/TESTING.html)** — Run the example quiz
- **[Adapting](https://bcanfield.github.io/quiz-helper/ADAPTING.html)** — Configure for different quiz sites
- **[Configuration Reference](https://bcanfield.github.io/quiz-helper/CONFIG.html)** — All available options
- **[Architecture](https://bcanfield.github.io/quiz-helper/ARCHITECTURE.html)** — Technical deep dive
- **[Troubleshooting](https://bcanfield.github.io/quiz-helper/TROUBLESHOOTING.html)** — Common issues

## ⚠️ Important

This is a **proof of concept** for educational purposes only. Using automation on real assessments may:
- Violate academic integrity policies
- Break platform terms of service  
- Be illegal under computer fraud laws

**Read the [ethical use guidelines](https://bcanfield.github.io/quiz-helper/ETHICAL_USE.html) before proceeding.**

## License

[MIT](LICENSE) — Use responsibly and at your own risk.