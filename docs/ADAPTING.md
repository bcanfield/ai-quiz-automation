# Adapting the Tool

How to configure ai-quiz-automation for different quiz websites.

## The Core Concept

Ai-quiz-automation is designed to be site-agnostic. It works by locating elements on the page using CSS selectors. To adapt it for a new quiz site, you simply need to identify the right selectors.

## Step-by-Step Guide

### 1. Open Your Quiz Site

Navigate to your quiz site in Chrome and have a question visible.

### 2. Inspect Elements

Right-click on different parts of the quiz and select "Inspect" to open DevTools.

### 3. Identify Three Key Elements

You need to find CSS selectors for:

**A. Question Container** - The element that contains the question text
- Look for a `<div>` or section that wraps the question
- It should contain all the question text (including any nested `<p>`, `<span>`, etc.)
- Common patterns: `.question`, `.question-container`, `#question-text`, `[data-question]`

**B. Answer Buttons** - The clickable elements for each answer choice
- These are usually `<button>`, `<a>`, or `<div>` elements
- There should be multiple matches (one for each answer option)
- Common patterns: `.answer-choice`, `button.option`, `.choice-btn`, `a.answer`

**C. Confirm Button** - The button to proceed to the next question
- Usually labeled "Next", "Continue", "Confirm", or "Submit"
- Common patterns: `.next-btn`, `#confirm`, `button.submit`, `.continue`

### 4. Test Your Selectors

Use Chrome DevTools Console to verify your selectors work:

```javascript
// Test question container - should return one element
document.querySelector('.your-question-selector')

// Test answer buttons - should return multiple elements
document.querySelectorAll('.your-answer-selector')

// Test confirm button - should return one element
document.querySelector('.your-confirm-selector')
```

### 5. Update config.json

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

### 6. Test It

1. Start Chrome with debugging: `--remote-debugging-port=9222`
2. Navigate to your quiz (logged in and ready)
3. Run: `npm start`
4. Watch the console output to verify it's working

## Example Configurations

### Example 1: Simple Quiz
```json
{
  "selectors": {
    "questionContainer": ".quiz-question",
    "answerButton": "button.answer",
    "confirmButton": "#next-question"
  }
}
```

### Example 2: Complex Nested Structure
```json
{
  "selectors": {
    "questionContainer": "div[data-testid='question-content']",
    "answerButton": "div.answer-row button",
    "confirmButton": "button[aria-label='Continue']"
  }
}
```

### Example 3: Link-based Answers
```json
{
  "selectors": {
    "questionContainer": "#question-wrapper",
    "answerButton": "a.choice-link",
    "confirmButton": "button.btn-primary"
  }
}
```

## Troubleshooting Selectors

### Question Text Not Extracted Properly

The tool reads all text from the question container, including nested elements. If you're getting too much or too little text:

- Make your selector more specific (target a smaller container)
- Use DevTools to find the exact element that contains just the question

### Answer Buttons Not Found

If the tool can't find answer buttons:

- Check that your selector matches **all** answer options
- Try selecting in the Console: `document.querySelectorAll('your-selector')`
- Look for a parent element that's common to all answers

### Confirm Button Disabled

Some quiz sites disable the confirm button until an answer is selected. The tool waits for the button to be enabled automatically.

If it's not working:
- Check if there's a different class when enabled (e.g., `.is-disabled` removed)
- The button must be clickable after selecting an answer

## Platform-Specific Notes

### Single Page Apps (React, Vue, etc.)

Modern quiz sites often use dynamic rendering. The tool handles this well because:
- It waits for elements to be visible before interacting
- It checks for the existence of questions before proceeding

### Multi-Select Questions

The tool automatically handles multiple choice questions. The AI detects phrases like "select all that apply" and returns multiple answer indices.

### Timed Quizzes

The tool includes realistic delays (4-8 seconds reading time, 1-2 seconds between actions) but this may not be fast enough for very short time limits. You can modify delays in `src/browser.ts` if needed.

## Need Help?

If you're stuck:
1. Check **[Troubleshooting](TROUBLESHOOTING.md)**
2. Review the example quiz in `example-quiz.html` to see the expected structure
3. Open an issue on GitHub with your selector attempts
