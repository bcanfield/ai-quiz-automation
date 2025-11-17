import { chromium, Browser, Page } from 'playwright';
import { Config, Question } from './types';

export class BrowserHelper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Connect to existing browser instance via CDP
      this.browser = await chromium.connectOverCDP(
        `http://localhost:${this.config.browser.debugPort}`
      );
      
      const contexts = this.browser.contexts();
      if (contexts.length === 0) {
        throw new Error('No browser contexts found. Make sure a browser tab is open.');
      }

      const pages = contexts[0].pages();
      if (pages.length === 0) {
        throw new Error('No pages found. Make sure a browser tab is open.');
      }

      // Use the first page (active tab)
      this.page = pages[0];
      console.log('Connected to browser tab:', await this.page.title());
    } catch (error) {
      throw new Error(`Failed to connect to browser: ${error}`);
    }
  }

  async extractQuestion(): Promise<Question> {
    if (!this.page) {
      throw new Error('Browser not connected');
    }

    // Extract question text from nested elements
    const questionContainer = await this.page.locator(this.config.selectors.questionContainer).first();
    const questionText = await questionContainer.innerText();

    // Extract answer options
    const answerButtons = await this.page.locator(this.config.selectors.answerButton).all();
    const answers: string[] = [];
    
    for (const button of answerButtons) {
      const text = await button.innerText();
      answers.push(text.trim());
    }

    return {
      text: questionText.trim(),
      answers
    };
  }

  async clickAnswer(answerIndex: number): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not connected');
    }

    const answerButtons = await this.page.locator(this.config.selectors.answerButton).all();
    
    if (answerIndex < 0 || answerIndex >= answerButtons.length) {
      throw new Error(`Invalid answer index: ${answerIndex}`);
    }

    // Add random delay to simulate human behavior
    await this.randomDelay(500, 1500);
    
    await answerButtons[answerIndex].click();
    console.log(`Clicked answer ${answerIndex + 1}`);
  }

  async clickConfirm(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not connected');
    }

    // Add random delay to simulate human behavior
    await this.randomDelay(1000, 2000);
    
    await this.page.locator(this.config.selectors.confirmButton).first().click();
    console.log('Clicked confirm button');
    
    // Wait for next question to load
    await this.randomDelay(1000, 2000);
  }

  async hasMoreQuestions(): Promise<boolean> {
    if (!this.page) {
      throw new Error('Browser not connected');
    }

    try {
      const questionContainer = await this.page.locator(this.config.selectors.questionContainer).first();
      return await questionContainer.isVisible();
    } catch {
      return false;
    }
  }

  private async randomDelay(min: number, max: number): Promise<void> {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  async disconnect(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}
