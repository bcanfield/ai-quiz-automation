import { BrowserHelper } from './browser';
import { AIHelper } from './ai';
import { Config } from './types';

export class QuizHelper {
  private browser: BrowserHelper;
  private ai: AIHelper;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.browser = new BrowserHelper(config);
    this.ai = new AIHelper(config);
  }

  async start(): Promise<void> {
    console.log('Starting Quiz Helper...');

    try {
      // Connect to browser
      await this.browser.connect();

      // Process questions in a loop
      let questionNumber = 1;

      while (await this.browser.hasMoreQuestions()) {
        console.log(`\n--- Question ${questionNumber} ---`);

        // Extract question and answers
        const question = await this.browser.extractQuestion();
        console.log('Question:', question.text);
        console.log(`Found ${question.answers.length} answer options`);

        // Simulate realistic reading/thinking time (8-15 seconds)
        await this.browser.simulateReading();

        // Get AI analysis
        const aiResponse = await this.ai.analyzeQuestion(question);

        console.log(`AI selected ${aiResponse.answerIndices.length} answer(s):`);
        for (const idx of aiResponse.answerIndices) {
          console.log(`  [${idx}] ${question.answers[idx]}`);
        }
        console.log(`Reasoning: ${aiResponse.reasoning}`);

        // Click each answer with a small delay between clicks
        for (let i = 0; i < aiResponse.answerIndices.length; i++) {
          await this.browser.clickAnswer(aiResponse.answerIndices[i]);

          // Add realistic delay between multiple selections (reduced since AI takes longer)
          // Humans take more time when selecting multiple answers
          if (i < aiResponse.answerIndices.length - 1) {
            const betweenSelectionsDelay = 400 + Math.random() * 600;
            console.log(`Considering additional answer... (${Math.round(betweenSelectionsDelay / 1000)}s)`);
            await new Promise(resolve => setTimeout(resolve, betweenSelectionsDelay));
          }
        }

        // Click confirm to move to next question
        await this.browser.clickConfirm();

        questionNumber++;
      }

      console.log('\nQuiz completed!');
    } catch (error) {
      console.error('Error:', error);
      throw error;
    } finally {
      await this.browser.disconnect();
    }
  }
}
