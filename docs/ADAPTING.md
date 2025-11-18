---
layout: default
title: Adapting the Tool
---

# Adapting the Tool

Configure the tool for any quiz website by finding the right CSS selectors.

## How It Works

The tool finds elements on the page using CSS selectors. You need three selectors:

1. **Question Container** - Element with the question text
   - Examples: `.question`, `#question-text`, `.quiz-wrapper .question`

2. **Answer Buttons** - Clickable elements for each answer
   - Examples: `button.answer`, `.choice-btn`, `a.answer-link`

3. **Confirm Button** - Button to go to next question
   - Examples: `.next-btn`, `#confirm`, `button.submit`

## Finding Selectors

**1. Open your quiz in Chrome**

**2. Right-click and select "Inspect"**

**3. Find the elements** and note their classes or IDs

**4. Test in DevTools Console:**
```javascript
// Should return one element
document.querySelector('.question')

// Should return multiple elements
document.querySelectorAll('button.answer')

// Should return one element
document.querySelector('.next-btn')
```

## Update Your Config

Edit `config.json`:

```json
{
  "selectors": {
    "questionContainer": ".your-question-selector",
    "answerButton": ".your-answer-selector",
    "confirmButton": ".your-confirm-selector"
  },
  "ai": {
    "provider": "openai",
    "model": "gpt-4o-mini"
  },
  "browser": {
    "debugPort": 9222
  }
}
```

## Test It

```bash
# Start Chrome with debugging
chrome --remote-debugging-port=9222

# Navigate to your quiz, then run:
npm start
```

Watch the console to verify it's working correctly.

## Example Configs

**Simple quiz:**
```json
{
  "selectors": {
    "questionContainer": ".quiz-question",
    "answerButton": "button.answer",
    "confirmButton": "#next-question"
  }
}
```

**Using data attributes:**
```json
{
  "selectors": {
    "questionContainer": "div[data-testid='question']",
    "answerButton": "div.answer-row button",
    "confirmButton": "button[aria-label='Continue']"
  }
}
```

## Troubleshooting

**Question text wrong:** Make your selector more specific to target just the question.

**Can't find answers:** Verify your selector matches all answer buttons in the console.

**Confirm button not clicking:** Some sites disable it until an answer is selected. The tool waits automatically.

**Multi-select questions:** The AI detects phrases like "select all that apply" and handles them.

**Dynamic sites (React, Vue):** The tool waits for elements to load, so most modern sites work fine.

See [Troubleshooting](TROUBLESHOOTING.md) for more help.
