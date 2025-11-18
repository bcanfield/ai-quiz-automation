import { BrowserHelper } from './browser.js';
import { AIHelper } from './ai.js';
import { Config } from './types.js';
import { logger } from './logger.js';

export class QuizHelper {
  private browser: BrowserHelper;
  private ai: AIHelper;

  constructor(config: Config) {
    this.browser = new BrowserHelper(config);
    this.ai = new AIHelper(config);
  }

  async start(): Promise<void> {
    logger.start('Starting Quiz Helper...');

    try {
      // Connect to browser
      await this.browser.connect();

      // Process questions in a loop
      let questionNumber = 1;

      while (await this.browser.hasMoreQuestions()) {
        logger.section(`Question ${questionNumber}`);

        // Extract question and answers
        const question = await this.browser.extractQuestion();
        logger.question(question.text);
        logger.info(`Found ${question.answers.length} answer options`);

        // Simulate realistic reading/thinking time (8-15 seconds)
        await this.browser.simulateReading();

        // Get AI analysis
        const aiResponse = await this.ai.analyzeQuestion(question);

        logger.newline();
        logger.aiSelection(aiResponse.answerIndices.length);
        for (const idx of aiResponse.answerIndices) {
          logger.answer(idx, question.answers[idx]);
        }
        logger.newline();
        logger.reasoning(aiResponse.reasoning);

        // Click each answer with a small delay between clicks
        for (let i = 0; i < aiResponse.answerIndices.length; i++) {
          await this.browser.clickAnswer(aiResponse.answerIndices[i]);

          // Add realistic delay between multiple selections (reduced since AI takes longer)
          // Humans take more time when selecting multiple answers
          if (i < aiResponse.answerIndices.length - 1) {
            const betweenSelectionsDelay = 400 + Math.random() * 600;
            logger.info(`Considering additional answer... (${Math.round(betweenSelectionsDelay / 1000)}s)`);
            await new Promise(resolve => setTimeout(resolve, betweenSelectionsDelay));
          }
        }

        // Click confirm to move to next question
        await this.browser.clickConfirm();

        questionNumber++;
      }

      logger.complete('Quiz completed!');
    } catch (error) {
      logger.error('Error', error);
      throw error;
    } finally {
      await this.browser.disconnect();
    }
  }
}
