# Troubleshooting

Common issues and how to fix them.

## Connection Issues

### "Failed to connect to browser"

**Cause:** The tool can't connect to Chrome via the debugging port.

**Solutions:**

1. **Verify Chrome is running with debugging enabled:**
   ```bash
   # Check if the port is listening
   curl http://localhost:9222/json
   ```
   You should see JSON output with browser info.

2. **Make sure the port matches:**
   - Check `config.json` → `browser.debugPort`
   - Must match the `--remote-debugging-port` value you used to start Chrome

3. **Close all Chrome instances and restart:**
   ```bash
   # Kill all Chrome processes
   pkill -9 chrome  # Linux/Mac
   
   # Start fresh
   chrome --remote-debugging-port=9222
   ```

4. **Check if port is in use:**
   ```bash
   lsof -i :9222  # Mac/Linux
   netstat -ano | findstr :9222  # Windows
   ```

### "No browser contexts found"

**Cause:** Chrome is running but has no tabs open.

**Solution:** Open at least one tab in the Chrome window.

### "No pages found"

**Cause:** Similar to above - no active pages.

**Solution:** Make sure you have a tab open with your quiz site loaded.

## Selector Issues

### "No answer options found"

**Cause:** The `answerButton` selector doesn't match any elements.

**Debug steps:**

1. **Test the selector in DevTools Console:**
   ```javascript
   document.querySelectorAll('your-answer-selector')
   // Should return multiple elements
   ```

2. **Common mistakes:**
   - Using `#id` when there are multiple elements (use `.class` instead)
   - Selector is too specific and doesn't match all answers
   - Page hasn't finished loading (tool should wait automatically)

3. **Fix:** Update `config.json` with the correct selector

### "Invalid answer index from AI"

**Cause:** The AI returned an answer index that doesn't exist.

**Possible reasons:**

1. **Wrong number of answers extracted:**
   - Check console output: "Found X answer options"
   - Verify this matches the actual number of answers on screen

2. **AI misunderstood the question:**
   - Try a more capable model (`gpt-4o` instead of `gpt-3.5-turbo`)
   - Check that question text is extracted correctly (not too much/little)

3. **Question format is unusual:**
   - The AI works best with standard multiple-choice questions
   - May struggle with very complex or ambiguous questions

### Question Text Too Long or Includes Extra Content

**Cause:** The `questionContainer` selector is too broad and includes surrounding content.

**Solution:**
1. Inspect the page to find a more specific selector
2. Target the smallest element that contains just the question
3. Test in console: `document.querySelector('selector').innerText`

## Runtime Issues

### Tool Clicks Wrong Answer

**Cause:** Either the AI chose wrong or the selectors are matching elements in wrong order.

**Debug steps:**

1. **Check if selectors are correct:**
   ```javascript
   // In DevTools console
   document.querySelectorAll('your-answer-selector').forEach((el, i) => {
     console.log(i, el.textContent);
   });
   ```
   The order should match what you see on screen.

2. **Verify AI's choice:**
   - Check console output for AI's reasoning
   - Sometimes the AI is actually correct but the quiz answer key is wrong!

3. **Try a better model:**
   - Switch to `gpt-4o` in config for better accuracy

### Confirm Button Not Clicking

**Cause:** Button might be disabled, not visible, or wrong selector.

**Debug steps:**

1. **Check if button is enabled:**
   ```javascript
   document.querySelector('your-confirm-selector').disabled
   // Should be false after selecting an answer
   ```

2. **Check visibility:**
   ```javascript
   document.querySelector('your-confirm-selector').offsetParent !== null
   ```

3. **Verify selector:**
   - Make sure it targets the correct button
   - Some sites have multiple buttons, use a specific selector

### Tool Stops After First Question

**Cause:** Can't find the question container on the next page.

**Possible reasons:**

1. **Page hasn't loaded yet:**
   - The tool waits automatically, but sometimes needs more time
   - Increase delays in `src/browser.ts` if needed

2. **Selector changed:**
   - Some sites use different selectors on different questions
   - You might need to use a more general selector

3. **Quiz is actually complete:**
   - Check if you've reached a results page or end screen

## API Issues

### "OPENAI_API_KEY environment variable is not set"

**Solution:**
```bash
export OPENAI_API_KEY=your-key-here
```

Or create `.env` file:
```
OPENAI_API_KEY=your-key-here
```

### "Rate limit exceeded"

**Cause:** You've hit OpenAI's rate limits.

**Solutions:**
1. Wait a few minutes and try again
2. Upgrade your OpenAI plan for higher limits
3. Use a slower model (fewer requests per minute)

### "Insufficient quota"

**Cause:** Your OpenAI account is out of credits.

**Solution:** Add credits to your OpenAI account at platform.openai.com

## Performance Issues

### Tool is Too Slow

The tool includes realistic delays to appear human-like. If you need it faster for testing:

**Edit `src/browser.ts`:**
- `simulateReading()`: Reduce from 4-8 seconds to 1-2 seconds
- `randomDelay()`: Reduce the min/max values throughout

**Warning:** Faster operation may be more detectable and could trigger anti-bot measures.

### Tool is Too Fast

If the site is detecting automation, increase delays in `src/browser.ts`:
- Make reading times longer
- Add more variation to delays
- Increase the chance of "hesitation" behaviors

## Still Having Issues?

1. **Check the example quiz:**
   - Run the tool against `example-quiz.html` to verify it works
   - This confirms the problem is with your configuration, not the tool

2. **Enable verbose logging:**
   - The tool already logs most actions to console
   - Check the console output carefully for clues

3. **Inspect the live page:**
   - While the tool is running, you can still use DevTools
   - Watch what elements are being selected

4. **Open an issue:**
   - If you're still stuck, open a GitHub issue
   - Include: your config, console output, and description of the problem
