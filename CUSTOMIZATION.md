# Customization Guide

This guide helps you adapt quiz-helper for different quiz platforms and customize it for your specific needs.

## Quick Start: Adapting to Your Quiz Platform

The quiz-helper is designed to be customizable. Here's how to adapt it to work with your specific quiz website:

### Step 1: Inspect Your Quiz Page

1. Open your quiz page in Chrome
2. Right-click on the question text and select **"Inspect"** (or press F12)
3. Find the CSS selector for the container holding the question text
4. Find the CSS selector for the answer buttons/links
5. Find the CSS selector for the confirm/next button

**Pro Tip**: In Chrome DevTools, right-click on an element in the Elements tab and select "Copy > Copy selector" to get a CSS selector automatically.

### Step 2: Update Your Configuration

Edit your `config.json` file with the selectors you found:

```json
{
  "selectors": {
    "questionContainer": ".your-question-container-class",
    "answerButton": "button.your-answer-button-class",
    "confirmButton": "#your-confirm-button-id"
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

### Step 3: Test with Example Quiz

Before testing on your actual quiz platform:
1. Test with the included `example-quiz.html` to ensure basic functionality works
2. See [TESTING.md](TESTING.md) for detailed testing instructions

## Understanding Configurable vs Hard-Coded Elements

### ✅ Easily Configurable (via config.json)

- **Question container selector**: Where the tool looks for question text
- **Answer button selector**: Which elements to click for answers
- **Confirm button selector**: Which button to click to proceed
- **AI model**: Which OpenAI model to use (gpt-4, gpt-4o-mini, etc.)
- **Debug port**: Which port Chrome is listening on

### ⚠️ May Require Code Changes

Some quiz platforms have unique structures that require modifying the source code:

#### 1. Answer Extraction Logic (`src/browser.ts`, line 50)

**Current implementation** (hardcoded for specific site):
```typescript
const answerOptions = await this.page.locator(
  `${this.config.selectors.questionContainer} a.option.option-selector`
).all();
```

This assumes answers are within the question container as `<a class="option option-selector">` elements.

**How to customize**: If your quiz has a different structure, you'll need to modify this line. Examples:

**Example 1: Answers outside question container**
```typescript
// Instead of looking inside questionContainer, look anywhere on page
const answerOptions = await this.page.locator(
  this.config.selectors.answerButton
).all();
```

**Example 2: Answers in a specific wrapper**
```typescript
const answerOptions = await this.page.locator(
  '.answer-choices-wrapper .answer-option'
).all();
```

**Example 3: Multiple answer containers (e.g., grouped by category)**
```typescript
// Get all answer groups first
const answerGroups = await this.page.locator('.answer-group').all();
const answers: string[] = [];
for (const group of answerGroups) {
  const options = await group.locator('.answer-option').all();
  for (const option of options) {
    answers.push(await option.innerText());
  }
}
```

#### 2. Human-Like Behavior Timing

The tool implements realistic delays to appear human-like. You may want to adjust these based on your needs.

**Location**: `src/browser.ts`

**Reading time** (line 129-160):
```typescript
// Base reading time: 4-8 seconds
const baseReadingTime = 4000 + Math.random() * 4000;
```

**Click delays** (line 82):
```typescript
// Thinking time before clicking: 800-2000ms
await this.randomDelay(800, 2000);
```

**To customize**: Adjust the min/max values based on how fast or slow you want interactions to appear.

#### 3. Multiple Answer Selection

The tool already handles multiple-choice questions (e.g., "Select all that apply"). The AI determines how many answers to select based on the question wording.

**No code changes needed** if:
- Multiple answers are selected by clicking multiple buttons
- Each click toggles the selection state

**Code changes needed** if:
- Your quiz uses checkboxes instead of buttons
- Your quiz requires holding Ctrl/Cmd while clicking
- Your quiz has a different selection mechanism

**Example: Checkbox selection**
```typescript
// In src/browser.ts, modify clickAnswer method
async clickAnswer(answerIndex: number): Promise<void> {
  // ... existing code ...
  
  // For checkboxes, click the checkbox input instead of button
  const checkbox = await answerButtons[answerIndex].locator('input[type="checkbox"]');
  await checkbox.check(); // Use .check() instead of .click()
  
  console.log(`Selected answer ${answerIndex + 1}`);
}
```

## Common Quiz Platform Patterns

### Pattern 1: Simple Button-Based Quiz
**Example sites**: Many corporate training platforms

**Characteristics**:
- Question in a div/container
- Multiple choice buttons
- Single "Next" or "Submit" button

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": ".question",
    "answerButton": "button.answer-choice",
    "confirmButton": "button.next"
  }
}
```

**Code changes**: None needed ✅

### Pattern 2: Form-Based Quiz
**Example sites**: Google Forms, Typeform

**Characteristics**:
- Questions in form elements
- Radio buttons or checkboxes
- "Submit" or "Continue" button

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": ".question-content",
    "answerButton": "label.answer-label",
    "confirmButton": "button[type='submit']"
  }
}
```

**Code changes**: May need to modify click behavior to click label instead of radio button

### Pattern 3: Card-Based Quiz
**Example sites**: Duolingo-style platforms

**Characteristics**:
- Question in a card
- Clickable answer cards
- Automatic progression (no confirm button)

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": ".question-card",
    "answerButton": ".answer-card",
    "confirmButton": ".next-button"
  }
}
```

**Code changes**: May need to adjust wait times if progression is automatic

### Pattern 4: Nested/Complex Structure
**Example sites**: Academic quiz platforms

**Characteristics**:
- Question split across multiple elements (title, description, image)
- Answers in various formats
- Additional context or hints

**Configuration**: Standard selectors
**Code changes**: Definitely needed - modify `extractQuestion()` to handle complex DOM structure

## Advanced Customization

### Adding Support for Different AI Providers

Currently, only OpenAI is supported. To add other providers:

1. Update `src/types.ts` to include new provider options
2. Modify `src/ai.ts` to handle different provider APIs
3. Update config schema in `test/config-validation.ts`

### Custom Delay Patterns

To implement different timing behaviors:

1. Edit `simulateReading()` in `src/browser.ts`
2. Adjust the delay ranges in `clickAnswer()` and `clickConfirm()`
3. Modify hesitation probability (currently 15% at line 85)

### Adding Image/Media Support

If your quiz includes images or media that the AI needs to analyze:

1. Modify `extractQuestion()` to capture image URLs
2. Update `Question` type in `src/types.ts` to include media URLs
3. Modify AI prompt in `src/ai.ts` to include image analysis (requires GPT-4 Vision)

### Logging and Debugging

Add more detailed logging:

```typescript
// In src/browser.ts
console.log('Current URL:', await this.page.url());
console.log('Page title:', await this.page.title());
console.log('Found elements:', await this.page.locator(selector).count());
```

Enable Playwright's debug mode:
```bash
DEBUG=pw:api npm start
```

## Testing Your Customizations

1. **Start small**: Test with the example quiz first
2. **Validate selectors**: Use Chrome DevTools Console to test selectors:
   ```javascript
   document.querySelectorAll('.your-selector')
   ```
3. **Check extraction**: Add logging to see what text/answers are being extracted
4. **Test edge cases**: Try questions with images, code blocks, or special formatting
5. **Verify timing**: Ensure delays look natural and don't trigger rate limiting

## Common Issues and Solutions

### Issue: "No answer options found"

**Cause**: Answer selector doesn't match your quiz structure

**Solution**: 
1. Inspect the answer elements in DevTools
2. Update the selector in config.json or code
3. Ensure answers are visible when extraction happens (check timing)

### Issue: Wrong answers being extracted

**Cause**: Selector is too broad and captures extra text

**Solution**:
1. Make selector more specific
2. Add filtering logic in `extractQuestion()`
3. Check for hidden elements or duplicates

### Issue: Clicks not registering

**Cause**: Elements not ready or covered by other elements

**Solution**:
1. Add wait conditions: `await element.waitFor({ state: 'visible' })`
2. Check z-index and element visibility
3. Try clicking parent or child elements instead

### Issue: AI selecting wrong answers

**Cause**: Question text not extracted correctly or AI needs better model

**Solution**:
1. Verify full question text is being captured (check console logs)
2. Try a more powerful model (gpt-4 instead of gpt-4o-mini)
3. Modify AI prompt in `src/ai.ts` for better guidance

## Best Practices

1. **Always test with the example quiz first** before moving to production sites
2. **Respect website terms of service** - ensure automation is permitted
3. **Start with slower delays** and speed up only if needed
4. **Use specific selectors** to avoid capturing wrong elements
5. **Add error handling** for your specific edge cases
6. **Keep API keys secure** - never commit them to version control
7. **Test thoroughly** before running on important quizzes

## Getting Help

If you're stuck customizing quiz-helper:

1. Check browser console for errors
2. Enable debug logging to see what's happening
3. Test each component separately (extraction, AI, clicking)
4. Compare your quiz structure to the example quiz
5. Create a minimal test case to isolate the issue

## Contributing Your Customizations

If you've adapted quiz-helper for a common quiz platform, consider contributing:

1. Document the platform-specific changes
2. Add example selectors
3. Share any useful modifications
4. Help others with similar needs
