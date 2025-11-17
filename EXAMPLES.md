# Configuration Examples for Common Quiz Platforms

This document provides ready-to-use configuration examples for different types of quiz platforms. Copy the configuration that matches your quiz platform into your `config.json`.

## Table of Contents

1. [Basic Button Quiz](#basic-button-quiz) - Simple quiz with buttons
2. [Form-Based Quiz](#form-based-quiz) - Quiz using form elements
3. [Card-Based Quiz](#card-based-quiz) - Modern card-style quiz
4. [List-Based Quiz](#list-based-quiz) - Answers in a list format
5. [Nested Content Quiz](#nested-content-quiz) - Complex DOM structure

---

## Basic Button Quiz

**Common on**: Corporate training platforms, simple quiz builders

**HTML Structure**:
```html
<div class="question-container">
  <h3>What is the capital of France?</h3>
  <div class="answers">
    <button class="answer-btn">Paris</button>
    <button class="answer-btn">London</button>
    <button class="answer-btn">Berlin</button>
  </div>
</div>
<button class="next-btn">Next Question</button>
```

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": ".question-container",
    "answerButton": "button.answer-btn",
    "confirmButton": ".next-btn"
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

**Code Changes**: None needed ✅

---

## Form-Based Quiz

**Common on**: Google Forms-style platforms, traditional web forms

**HTML Structure**:
```html
<div class="question-section">
  <p class="question-text">What is 2 + 2?</p>
  <form>
    <label class="answer-option">
      <input type="radio" name="q1" value="3"> 3
    </label>
    <label class="answer-option">
      <input type="radio" name="q1" value="4"> 4
    </label>
    <button type="submit" class="submit-btn">Submit</button>
  </form>
</div>
```

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": ".question-section",
    "answerButton": "label.answer-option",
    "confirmButton": "button.submit-btn"
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

**Code Changes**: Clicking the label will trigger the radio button ✅

---

## Card-Based Quiz

**Common on**: Modern educational platforms, gamified quizzes

**HTML Structure**:
```html
<div class="quiz-card">
  <div class="card-header">
    <h2>Question 1</h2>
  </div>
  <div class="card-body">
    <p class="question">Which planet is closest to the sun?</p>
  </div>
  <div class="card-answers">
    <div class="answer-card" data-id="1">Mercury</div>
    <div class="answer-card" data-id="2">Venus</div>
    <div class="answer-card" data-id="3">Earth</div>
  </div>
</div>
<button id="confirm-answer">Confirm</button>
```

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": ".quiz-card .card-body",
    "answerButton": ".answer-card",
    "confirmButton": "#confirm-answer"
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

**Code Changes**: None needed ✅

---

## List-Based Quiz

**Common on**: Assessment platforms, survey tools

**HTML Structure**:
```html
<div id="current-question">
  <div class="q-text">
    <span>What programming language is this repo written in?</span>
  </div>
  <ul class="answer-list">
    <li><a href="#" class="choice-link">JavaScript</a></li>
    <li><a href="#" class="choice-link">Python</a></li>
    <li><a href="#" class="choice-link">TypeScript</a></li>
  </ul>
</div>
<a href="#" id="next-question">Next →</a>
```

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": "#current-question .q-text",
    "answerButton": "a.choice-link",
    "confirmButton": "#next-question"
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

**Code Changes**: None needed ✅

---

## Nested Content Quiz

**Common on**: Complex learning management systems

**HTML Structure**:
```html
<article class="quiz-question">
  <header>
    <h3 class="title">Question 5</h3>
  </header>
  <section class="content">
    <div class="question-wrapper">
      <p>Read the following:</p>
      <blockquote>Some context here</blockquote>
      <p><strong>What is the main idea?</strong></p>
    </div>
    <div class="options-wrapper">
      <button class="opt" data-value="a">Option A</button>
      <button class="opt" data-value="b">Option B</button>
      <button class="opt" data-value="c">Option C</button>
    </div>
  </section>
  <footer>
    <button class="btn-continue">Continue</button>
  </footer>
</article>
```

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": "article.quiz-question .question-wrapper",
    "answerButton": "button.opt",
    "confirmButton": "button.btn-continue"
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

**Code Changes**: None needed ✅

---

## Multiple Choice (Select All That Apply)

**Common on**: Certification exams, advanced assessments

**HTML Structure**:
```html
<div class="question-block">
  <p class="q-prompt">Select all that apply:</p>
  <p class="q-text">Which of these are programming languages?</p>
  <div class="choices">
    <label class="choice-item">
      <input type="checkbox" name="ans[]" value="1">
      <span>Python</span>
    </label>
    <label class="choice-item">
      <input type="checkbox" name="ans[]" value="2">
      <span>HTML</span>
    </label>
    <label class="choice-item">
      <input type="checkbox" name="ans[]" value="3">
      <span>Java</span>
    </label>
  </div>
</div>
<button class="submit">Submit</button>
```

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": ".question-block",
    "answerButton": "label.choice-item",
    "confirmButton": "button.submit"
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

**Notes**: 
- The AI will automatically detect "Select all that apply" in the question text
- It will return multiple answer indices
- The tool will click each answer with delays between them
- Works with checkboxes when clicking the label element

**Code Changes**: None needed ✅ (AI already handles this!)

---

## Dropdown/Select Quiz

**Common on**: Form-based assessments

**HTML Structure**:
```html
<div class="quiz-item">
  <label for="answer-select">What is the correct answer?</label>
  <select id="answer-select" class="answer-dropdown">
    <option value="">-- Select an answer --</option>
    <option value="a">Option A</option>
    <option value="b">Option B</option>
    <option value="c">Option C</option>
  </select>
</div>
<button id="submit-answer">Submit</button>
```

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": ".quiz-item label",
    "answerButton": "#answer-select option",
    "confirmButton": "#submit-answer"
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

**Code Changes**: ⚠️ **Required** - Need to modify `clickAnswer()` to use `selectOption()` instead of `click()`

**See**: [CUSTOMIZATION.md](CUSTOMIZATION.md#multiple-answer-selection) for code example

---

## Image-Based Quiz

**Common on**: Visual learning platforms

**HTML Structure**:
```html
<div class="visual-question">
  <p>Identify this landmark:</p>
  <img src="image.jpg" alt="landmark">
  <div class="image-choices">
    <button class="img-option">Eiffel Tower</button>
    <button class="img-option">Big Ben</button>
    <button class="img-option">Statue of Liberty</button>
  </div>
</div>
<button class="proceed">Next</button>
```

**Configuration**:
```json
{
  "selectors": {
    "questionContainer": ".visual-question",
    "answerButton": ".img-option",
    "confirmButton": ".proceed"
  },
  "ai": {
    "provider": "openai",
    "model": "gpt-4o"
  },
  "browser": {
    "debugPort": 9222
  }
}
```

**Code Changes**: ⚠️ **Required** - Need to extract image URL and send to GPT-4 Vision

**Notes**:
- Use `gpt-4o` or `gpt-4-vision-preview` (models with vision capabilities)
- Modify `extractQuestion()` to include image URL
- Update AI prompt to handle image analysis

**See**: [CUSTOMIZATION.md](CUSTOMIZATION.md#adding-imagemedia-support) for code example

---

## How to Use These Examples

1. **Find the example** that most closely matches your quiz platform
2. **Copy the configuration** to your `config.json`
3. **Test with a single question** to verify it works
4. **Adjust selectors** if your exact HTML is slightly different
5. **Check "Code Changes"** - if it says "Required", see [CUSTOMIZATION.md](CUSTOMIZATION.md) for instructions

## Testing Your Configuration

Before running on real quizzes:

```bash
# 1. Update your config.json with one of the examples above

# 2. Open Chrome DevTools Console on your quiz page

# 3. Test each selector:
document.querySelectorAll('.your-question-container')  // Should return 1 element
document.querySelectorAll('.your-answer-button')      // Should return all answers
document.querySelectorAll('.your-confirm-button')     // Should return 1 element

# 4. If counts look good, run the tool
npm start
```

## Need Help?

- **Selector not working?** See [CUSTOMIZATION.md](CUSTOMIZATION.md#common-issues-and-solutions)
- **Need code changes?** See [CUSTOMIZATION.md](CUSTOMIZATION.md#understanding-configurable-vs-hard-coded-elements)
- **Complex quiz structure?** See [ARCHITECTURE.md](ARCHITECTURE.md#extension-points)

## Contributing Examples

Have a configuration for a common platform not listed here? Please contribute:

1. Document the platform name
2. Provide HTML structure example
3. Share working configuration
4. Note any code changes needed
5. Submit a pull request!
