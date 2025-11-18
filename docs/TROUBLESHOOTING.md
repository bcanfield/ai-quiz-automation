---
layout: default
title: Troubleshooting
---

# Troubleshooting

## Connection Issues

**"Failed to connect to browser"**

Check Chrome is running with debugging:
```bash
curl http://localhost:9222/json
```

If that fails:
- Verify port matches in `config.json`
- Kill Chrome and restart: `pkill -9 chrome && chrome --remote-debugging-port=9222`
- Check port isn't in use: `lsof -i :9222`

**"No browser contexts found" or "No pages found"**

Open at least one tab in Chrome.

## Selector Issues

**"No answer options found"**

Test your selector:
```javascript
document.querySelectorAll('your-selector')  // Should return multiple elements
```

Common fixes:
- Use `.class` instead of `#id` for multiple elements
- Make selector less specific
- Update `config.json`

**"Invalid answer index from AI"**

- Check console: "Found X answer options" matches what's on screen
- Try a better model: `gpt-4o` instead of `gpt-3.5-turbo`
- Verify question text is extracted correctly

**Question text wrong**

Make your `questionContainer` selector more specific. Test:
```javascript
document.querySelector('selector').innerText
```

## Runtime Issues

**Wrong answer clicked**

Check answer order:
```javascript
document.querySelectorAll('your-selector').forEach((el, i) => {
  console.log(i, el.textContent);
});
```

Should match screen order. If AI reasoning seems correct, maybe the answer key is wrong.

**Confirm button not clicking**

Verify it's enabled and visible:
```javascript
document.querySelector('selector').disabled  // Should be false
document.querySelector('selector').offsetParent !== null  // Should be true
```

**Stops after first question**

- Page may still be loading (tool waits automatically)
- Selector might be different on next question (use more general selector)
- Check if quiz is actually complete

## API Issues

**"OPENAI_API_KEY not set"**
```bash
echo "OPENAI_API_KEY=your-key" > .env
```

**"Rate limit exceeded"**

Wait a few minutes or upgrade your OpenAI plan.

**"Insufficient quota"**

Add credits at platform.openai.com

## Performance

**Too slow for testing?**

Edit `src/browser.ts` to reduce delays (but may be more detectable).

**Getting detected?**

Increase delays and add more variation in `src/browser.ts`.

## Still Stuck?

1. Test with `example-quiz.html` to verify the tool works
2. Check console output for clues
3. Open a GitHub issue with your config and error details
