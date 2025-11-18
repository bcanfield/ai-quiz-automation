# Testing Guide

Quick guide to verify ai-quiz-automation works.

## Quick Test

```bash
# Install and build
npm install && npm run build

# Setup API key
echo "OPENAI_API_KEY=your-key" > .env

# Start Chrome with debugging
chrome --remote-debugging-port=9222

# Open example quiz in Chrome
open example-quiz.html

# Run the tool
npm start
```

The tool should automatically answer all three questions in the example quiz.

## What to Expect

Console output will show:
1. Connecting to browser
2. For each question:
   - Question text extracted
   - Number of answer options found
   - Reading time simulation
   - AI's selected answer and reasoning
   - Clicking answer and confirm buttons
3. "Quiz completed!" when done

## Configuration Validation

Test your config file:
```bash
npm test
```

This validates the JSON structure and required fields.

## Testing with Your Quiz Site

See **[docs/ADAPTING.md](docs/ADAPTING.md)** for a complete guide on:
- Finding the right CSS selectors
- Testing selectors before running
- Common selector patterns for different quiz types

## Troubleshooting

See **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** for solutions to:
- Connection issues
- Selector problems
- API errors
- Performance tuning

## Security

The codebase is scanned with:
- CodeQL (no vulnerabilities)
- npm audit (no vulnerable dependencies)
- GitHub Advisory Database checks
