# Configuration Reference

All options in `config.json`.

## File Structure

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

### questionContainer
CSS selector for the element containing the question text.

Examples:
- `".question-container"`
- `"#quiz-question"`
- `"div[data-question]"`

### answerButton
CSS selector matching all answer buttons/links.

Examples:
- `"button.answer"`
- `"a.choice-link"`
- `".choices button"`

### confirmButton
CSS selector for the next/confirm button.

Examples:
- `"#next-btn"`
- `"button.submit"`
- `"button[aria-label='Continue']"`

## AI Configuration

### provider
Currently only `"openai"` is supported.

### model
Which OpenAI model to use:
- `"gpt-4o"` - Best accuracy, higher cost
- `"gpt-4o-mini"` - Good balance (recommended)
- `"gpt-3.5-turbo"` - Fastest, cheaper, less accurate

See [OpenAI pricing](https://openai.com/api/pricing/) for costs.

### API Key
Set via environment variable (not in config for security):
```bash
echo "OPENAI_API_KEY=your-key" > .env
```

## Browser Configuration

### debugPort
Port Chrome listens on for debugging. Default: `9222`

Must match the `--remote-debugging-port` value when starting Chrome.

## Example

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

## Validation

Check your config:
```bash
npm test
```

This validates JSON structure and required fields, but doesn't test if selectors work on your site.
