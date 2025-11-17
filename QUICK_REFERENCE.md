# Quick Reference Guide

One-page reference for developers using quiz-helper.

## 📋 Setup Checklist

```bash
□ git clone & npm install
□ cp config.example.json config.json
□ cp .env.example .env
□ Add OPENAI_API_KEY to .env
□ npm run build
□ Start Chrome with --remote-debugging-port=9222
□ Test with example-quiz.html
□ Update config.json for your quiz platform
```

## ⚙️ Configuration Template

```json
{
  "selectors": {
    "questionContainer": ".question",      // ← Element with question text
    "answerButton": "button.answer",       // ← Clickable answer elements
    "confirmButton": "#next-btn"           // ← Button to proceed
  },
  "ai": {
    "provider": "openai",
    "model": "gpt-4o-mini"                 // or "gpt-4"
  },
  "browser": {
    "debugPort": 9222
  }
}
```

## 🔍 Finding Selectors (30 seconds)

1. Open quiz in Chrome
2. Right-click element → **Inspect**
3. Right-click in DevTools → **Copy** → **Copy selector**
4. Paste into config.json

**Test in Console:**
```javascript
document.querySelectorAll('.your-selector').length  // Should be > 0
```

## 🚀 Running the Tool

```bash
# Terminal 1: Start Chrome with debugging
# macOS:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug

# Windows:
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222

# Linux:
google-chrome --remote-debugging-port=9222

# Terminal 2: Run quiz-helper
npm start
```

## 🔧 Common Issues & Fixes

| Error | Fix |
|-------|-----|
| "Failed to connect to browser" | Start Chrome with `--remote-debugging-port=9222` |
| "No answer options found" | Wrong selector - inspect page and update config.json |
| "OPENAI_API_KEY not set" | Add to .env file or `export OPENAI_API_KEY=your-key` |
| AI wrong answers | Use better model: `"model": "gpt-4"` |
| Selectors not matching | Check selector in DevTools Console first |

## 📁 Project Structure

```
src/
├── index.ts        → Entry point (loads config)
├── quiz-helper.ts  → Main orchestrator
├── browser.ts      → Browser automation ⚠️ May need editing
├── ai.ts           → AI integration
└── types.ts        → TypeScript types
```

## ✅ What's Configurable (config.json)

- CSS selectors
- AI model
- Debug port

## ⚠️ What Needs Code Changes

**File: `src/browser.ts`**

### Line 50: Answer extraction
```typescript
// Current (may need changing):
const answerOptions = await this.page.locator(
  `${this.config.selectors.questionContainer} a.option.option-selector`
).all();

// For most platforms, change to:
const answerOptions = await this.page.locator(
  this.config.selectors.answerButton
).all();
```

### Lines 82-160: Timing adjustments
```typescript
// Line 135: Reading time (4-8 seconds)
const baseReadingTime = 4000 + Math.random() * 4000;

// Line 82: Thinking time (800-2000ms)
await this.randomDelay(800, 2000);

// Line 100: Review time (1200-2500ms)
await this.randomDelay(1200, 2500);
```

## 🎯 Decision Tree: Do I Need Code Changes?

```
Is your quiz like the example quiz?
├─ Yes → Just update config.json ✅
└─ No → Answer these:

   Are answers inside the question container?
   ├─ Yes → Just update config.json ✅
   └─ No → Edit browser.ts line 50 ⚠️

   Are answers clickable buttons/links?
   ├─ Yes → Just update config.json ✅
   └─ No (dropdown/checkbox) → Edit browser.ts ⚠️

   Single or multi-select questions?
   ├─ Both handled automatically ✅
   └─ Tool clicks all selected answers

   Do questions have images?
   ├─ No → Just update config.json ✅
   └─ Yes → Edit browser.ts + ai.ts ⚠️
```

## 📚 Documentation Map

| Need | Read |
|------|------|
| Pre-made config for your platform | [EXAMPLES.md](EXAMPLES.md) |
| How to modify code | [CUSTOMIZATION.md](CUSTOMIZATION.md) |
| Understanding the architecture | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Testing your changes | [TESTING.md](TESTING.md) |
| Everything | [README.md](README.md) |

## 💻 Development Commands

```bash
npm run build     # Compile TypeScript
npm run dev       # Run with auto-reload
npm start         # Run compiled version
npm test          # Validate config
```

## 🐛 Debugging

**Enable verbose logging:**
```bash
DEBUG=pw:api npm start
```

**Check what's being extracted:**
Look for console output:
```
Question: [extracted text here]
Found X answer options
```

**Test selectors:**
```javascript
// In Chrome DevTools Console
document.querySelectorAll('.question-container')  // Question
document.querySelectorAll('button.answer')        // Answers
document.querySelectorAll('#next-btn')            // Confirm
```

## 🎨 Customization Quick Links

### Faster interactions
Edit `src/browser.ts`:
- Line 135: Change `4000 + Math.random() * 4000` to smaller values
- Line 82: Change `800, 2000` to smaller values

### Different AI model
Edit `config.json`:
```json
"model": "gpt-4"  // More expensive but more accurate
```

### Answers outside question container
Edit `src/browser.ts` line 50:
```typescript
const answerOptions = await this.page.locator(
  this.config.selectors.answerButton
).all();
```

### Support images
Edit `src/browser.ts` `extractQuestion()`:
```typescript
const imageUrl = await questionContainer.locator('img').getAttribute('src');
```

## 📊 Example Workflow

1. ✅ Test with `example-quiz.html` (verify tool works)
2. ✅ Open your quiz in Chrome DevTools
3. ✅ Find selectors for question, answers, confirm
4. ✅ Update `config.json`
5. ✅ Test selectors in Console
6. ✅ Run `npm start`
7. ❓ Does it work?
   - Yes → Done! 🎉
   - No → Check [EXAMPLES.md](EXAMPLES.md) or [CUSTOMIZATION.md](CUSTOMIZATION.md)

## 🔐 Security Best Practices

- ✅ Never commit API keys to git (.gitignore has .env)
- ✅ Use environment variables for secrets
- ✅ Respect website terms of service
- ✅ Test in sandbox environments first

## 🎓 Learning Resources

**New to browser automation?**
- [Playwright Docs](https://playwright.dev)
- Check `src/browser.ts` for examples

**New to AI integration?**
- [OpenAI API Docs](https://platform.openai.com/docs)
- Check `src/ai.ts` for examples

**TypeScript questions?**
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Getting Help

1. Check [EXAMPLES.md](EXAMPLES.md) - Is there a matching platform?
2. Check [CUSTOMIZATION.md](CUSTOMIZATION.md) - Is your issue covered?
3. Enable debug mode: `DEBUG=pw:api npm start`
4. Test selectors in Chrome Console
5. Check console output for extracted text

## ⚡ Power User Tips

- Use `npm run dev` for live reload during development
- Test selectors before running full quiz
- Start with slower delays, speed up later
- Keep Chrome window visible (tool needs foreground)
- Use gpt-4o-mini for cost savings, gpt-4 for accuracy
- Check example-quiz.html to understand expected structure

---

**Still need help?** Read the full guides:
- [README.md](README.md) - Complete overview
- [EXAMPLES.md](EXAMPLES.md) - 8+ configuration examples
- [CUSTOMIZATION.md](CUSTOMIZATION.md) - Detailed customization guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [TESTING.md](TESTING.md) - Testing guide
