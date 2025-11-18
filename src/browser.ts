import { chromium, Browser, Page } from 'playwright';
import { Config, Question } from './types.js';
import { logger } from './logger.js';

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
      logger.connected(`Browser tab: ${await this.page.title()}`);
    } catch (error) {
      throw new Error(`Failed to connect to browser: ${error}`);
    }
  }

  async extractQuestion(): Promise<Question> {
    if (!this.page) {
      throw new Error('Browser not connected');
    }

    logger.extracting('Extracting question...');

    // Extract question text from nested elements
    const questionContainer = await this.page.locator(this.config.selectors.questionContainer).first();
    const questionText = await questionContainer.innerText();

    // Extract answer options using the configured selector
    const answerOptions = await this.page.locator(this.config.selectors.answerButton).all();
    const answers: string[] = [];

    for (const option of answerOptions) {
      const text = await option.innerText();
      answers.push(text.trim());
    }

    if (answers.length === 0) {
      throw new Error('No answer options found. This might be a results or submit page.');
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

    // Simulate thinking/decision time before clicking (reduced)
    await this.randomDelay(400, 1000);

    // Occasionally hesitate before clicking (10% chance) - simulating second-guessing
    if (Math.random() < 0.10) {
      logger.info('Reconsidering answer...');
      await this.randomDelay(500, 1200);
    }

    await answerButtons[answerIndex].click();
    logger.action(`Clicked answer ${answerIndex + 1}`);
  }

  async clickConfirm(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not connected');
    }

    // Pause to review answer before confirming (reduced)
    await this.randomDelay(600, 1200);

    // Wait for confirm button to be enabled (not have is-disabled class)
    const confirmButton = this.page.locator(this.config.selectors.confirmButton).first();
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 });

    // Natural delay before actually clicking confirm
    await this.randomDelay(200, 500);

    await confirmButton.click();
    logger.action('Clicked confirm button');

    // Wait for next question to load (reduced)
    await this.randomDelay(800, 1500);
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

  async simulateReading(): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not connected');
    }

    // Base reading time: 2-4 seconds (reduced since AI takes longer)
    const baseReadingTime = 2000 + Math.random() * 2000;

    // Occasionally take longer (10% chance) - simulating careful consideration
    const extraTime = Math.random() < 0.1 ? 500 + Math.random() * 1000 : 0;

    const totalTime = baseReadingTime + extraTime;

    if (extraTime > 0) {
      logger.info(`Reading question carefully... (${Math.round(totalTime / 1000)}s)`);
    } else {
      logger.info(`Reading question... (${Math.round(totalTime / 1000)}s)`);
    }

    // Simulate natural reading by breaking it into smaller chunks with micro-pauses
    const chunks = 3 + Math.floor(Math.random() * 3); // 3-5 chunks
    const chunkTime = totalTime / chunks;

    for (let i = 0; i < chunks; i++) {
      await new Promise(resolve => setTimeout(resolve, chunkTime));

      // Occasionally move mouse slightly to simulate activity (20% chance per chunk)
      if (Math.random() < 0.2) {
        await this.simulateMouseMovement();
      }
    }
  }

  private async simulateMouseMovement(): Promise<void> {
    if (!this.page) return;

    try {
      // Small random mouse movement to simulate human reading behavior
      const x = 100 + Math.random() * 300;
      const y = 100 + Math.random() * 200;
      await this.page.mouse.move(x, y, { steps: 5 + Math.floor(Math.random() * 10) });
    } catch {
      // Ignore errors from mouse movement
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
