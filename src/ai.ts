import OpenAI from 'openai';
import { Config, Question, AIResponse } from './types';

export class AIHelper {
  private client: OpenAI;
  private config: Config;

  constructor(config: Config) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.ai.apiKey
    });
  }

  async analyzeQuestion(question: Question): Promise<AIResponse> {
    const prompt = this.buildPrompt(question);

    try {
      const response = await this.client.chat.completions.create({
        model: this.config.ai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that answers quiz questions. Respond with only the index number (0-based) of the correct answer.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 10
      });

      const answerText = response.choices[0]?.message?.content?.trim();
      
      if (!answerText) {
        throw new Error('No response from AI');
      }

      const answerIndex = parseInt(answerText, 10);

      if (isNaN(answerIndex) || answerIndex < 0 || answerIndex >= question.answers.length) {
        throw new Error(`Invalid answer index from AI: ${answerText}`);
      }

      return {
        answerIndex,
        confidence: 0.9 // Could be calculated from response
      };
    } catch (error) {
      throw new Error(`AI analysis failed: ${error}`);
    }
  }

  private buildPrompt(question: Question): string {
    let prompt = `Question: ${question.text}\n\nAnswers:\n`;
    
    question.answers.forEach((answer, index) => {
      prompt += `${index}. ${answer}\n`;
    });

    prompt += '\nProvide only the index number (0-based) of the correct answer.';
    
    return prompt;
  }
}
