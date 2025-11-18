# quiz-helper

An AI-powered browser automation tool that connects to Chrome and answers quiz questions. Built as a proof of concept to explore AI integration with browser automation.

![Demo](.github/demo.gif)

**⚠️ This tool was NOT used for cheating.** It's a technical demonstration created in a controlled environment for learning purposes.

## What is this?

This tool demonstrates:
- Connecting to an existing Chrome session using the Chrome DevTools Protocol
- Extracting content from web pages with configurable CSS selectors
- Using OpenAI to analyze questions and generate answers
- Simulating human-like interaction patterns with random delays

## Quick Start

```bash
# Install
npm install && npm run build

# Setup API key
echo "OPENAI_API_KEY=your-key-here" > .env

# Configure for your quiz site
cp config.example.json config.json
# Edit config.json with your CSS selectors

# Start Chrome with debugging
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Run
npm start
```

## Adapting to Your Quiz Site

The tool is designed to be easily adapted. You only need to:

1. **Find the right CSS selectors** - Inspect your quiz page and identify:
   - Where the question text appears (e.g., `.question-container`)
   - The answer buttons (e.g., `button.choice-link`)
   - The confirm/next button (e.g., `button.confirm-next`)

2. **Update `config.json`** with your selectors

That's it! The rest is abstracted and should work with most step-by-step quiz formats.

See **[Adapting the Tool](docs/ADAPTING.md)** for a detailed guide.

## Documentation

- **[Demo Guide](docs/DEMO.md)** - Step-by-step instructions to run a live demo
- **[Setup & Installation](docs/SETUP.md)** - Detailed setup instructions
- **[Adapting the Tool](docs/ADAPTING.md)** - How to use with different quiz sites
- **[Configuration Guide](docs/CONFIG.md)** - All configuration options explained
- **[Architecture Overview](docs/ARCHITECTURE.md)** - How the code works
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## Important Ethical Warning

**⚠️ READ THIS BEFORE USING**

This tool is a **proof of concept only**. Using automation tools on real assessments:

- **May violate academic integrity policies** and result in serious consequences (expulsion, degree revocation)
- **May violate terms of service** of testing platforms
- **May be illegal** in some jurisdictions under computer fraud laws
- **Will undermine your own learning** - the whole point of education

**This repository is for:**
- Learning about browser automation
- Understanding AI integration patterns
- Building similar tools for legitimate purposes (testing, accessibility, etc.)

**This repository is NOT for:**
- Cheating on real tests or assignments
- Circumventing authentication or security
- Any unauthorized access to systems

By using this code, you accept full responsibility for ensuring your use is legal and ethical.

## License

ISC - See LICENSE file for details

## Disclaimer

This software is for educational and research purposes only. The author assumes no liability for misuse. Users must ensure their usage complies with all applicable laws, institutional policies, and terms of service.