# Configuration Guide

Complete reference for all configuration options in `config.json`.

## Configuration File Structure

```json
{
  "selectors": {
    "questionContainer": "CSS_SELECTOR",
    "answerButton": "CSS_SELECTOR",
    "confirmButton": "CSS_SELECTOR"
  },
  "ai": {
    "provider": "openai",
    "model": "MODEL_NAME"
  },
  "browser": {
    "debugPort": 9222
  }
}
```

## Selectors

### `selectors.questionContainer`

**Type:** String (CSS selector)  
**Required:** Yes

The CSS selector for the element containing the question text.

The tool will extract all text from this element and its children, so it should wrap the entire question (including any nested `<p>`, `<span>`, or other text elements).

**Examples:**
```json
"questionContainer": ".question-container"
"questionContainer": "#quiz-question"
"questionContainer": "div[data-question]"
"questionContainer": ".quiz-wrapper .question"
```

### `selectors.answerButton`

**Type:** String (CSS selector)  
**Required:** Yes

The CSS selector for answer choice buttons/links.

This selector should match **all** answer options. The tool will get all matching elements and treat each one as a separate answer choice.

**Examples:**
```json
"answerButton": "button.btn.choice-link"
"answerButton": "a.answer-option"
"answerButton": ".choices button"
"answerButton": "div.answer[role='button']"
```

**Important:** Make sure this selector is specific enough that it only matches answer buttons, not other buttons on the page.

### `selectors.confirmButton`

**Type:** String (CSS selector)  
**Required:** Yes

The CSS selector for the button that confirms the answer and moves to the next question.

Usually labeled "Next", "Continue", "Confirm", or "Submit Answer".

**Examples:**
```json
"confirmButton": "button.confirm-next"
"confirmButton": "#submit-answer"
"confirmButton": ".btn-primary"
"confirmButton": "button[aria-label='Next Question']"
```

## AI Configuration

### `ai.provider`

**Type:** String  
**Required:** Yes  
**Current Value:** `"openai"`

The AI provider to use. Currently only OpenAI is supported.

Future versions may support other providers like Anthropic or local models.

### `ai.model`

**Type:** String  
**Required:** Yes

The OpenAI model to use for answering questions.

**Recommended models:**
- `"gpt-4o"` - Most capable, best accuracy (higher cost)
- `"gpt-4o-mini"` - Good balance of performance and cost
- `"gpt-4"` - Previous generation, still very capable
- `"gpt-3.5-turbo"` - Fastest and cheapest, lower accuracy

**Example:**
```json
"model": "gpt-4o-mini"
```

**Cost considerations:**
- Different models have different pricing per token
- More capable models = better accuracy = higher cost per question
- Check [OpenAI pricing](https://openai.com/api/pricing/) for current rates

### API Key

The API key is **not** stored in `config.json` for security reasons.

Set it via environment variable:
```bash
export OPENAI_API_KEY=your-key-here
```

Or create a `.env` file:
```
OPENAI_API_KEY=your-key-here
```

## Browser Configuration

### `browser.debugPort`

**Type:** Number  
**Required:** Yes  
**Default:** `9222`

The port that Chrome is listening on for remote debugging connections.

This must match the port you use when starting Chrome:
```bash
chrome --remote-debugging-port=9222
```

**When to change:**
- If port 9222 is already in use
- If you're running multiple Chrome instances
- If your organization requires a specific port

**Example:**
```json
"debugPort": 9223
```

## Full Example Configuration

```json
{
  "selectors": {
    "questionContainer": ".question-wrapper",
    "answerButton": "button.answer-choice",
    "confirmButton": "#next-btn"
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

## Configuration Tips

1. **Start with the example**: Copy `config.example.json` and modify it
2. **Test selectors first**: Use browser DevTools to verify selectors before running the tool
3. **Be specific**: More specific selectors = fewer false matches
4. **Use the console**: Test with `document.querySelector()` in the browser console
5. **Keep it simple**: Use the simplest selector that uniquely identifies the element

## Validation

Run configuration validation:
```bash
npm test
```

This checks that:
- Configuration file exists and is valid JSON
- All required fields are present
- Field types are correct

Note: It doesn't validate that your selectors work on your target site - you need to test that manually.
