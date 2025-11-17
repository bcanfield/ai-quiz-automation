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
        console.log('Answers:', question.answers);
        
        // Get AI analysis
        const aiResponse = await this.ai.analyzeQuestion(question);
        console.log(`AI selected answer: ${aiResponse.answerIndex} - "${question.answers[aiResponse.answerIndex]}"`);
        
        // Click the answer
        await this.browser.clickAnswer(aiResponse.answerIndex);
        
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
