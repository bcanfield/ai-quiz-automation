import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { Config, Question, AIResponse } from './types';

export class AIHelper {
  private config: Config;

  constructor(config: Config) {
    this.config = config;

    // Verify API key is set in environment
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    console.log('OpenAI provider initialized with model:', config.ai.model);
  }

  async analyzeQuestion(question: Question): Promise<AIResponse> {
    console.log('Analyzing question with AI...');

    try {
      const { object } = await generateObject({
        model: openai(this.config.ai.model),
        schema: z.object({
          answerIndices: z.array(z.number()).describe(
            'Array of 0-based indices of the correct answer(s). Return a single index in the array for single-answer questions, or multiple indices for multiple-answer questions.'
          ),
          reasoning: z.string().describe(
            'Brief explanation of why these answer(s) are correct.'
          ),
        }),
        prompt: this.buildPrompt(question),
        temperature: 0.3,
      });

      // Validate indices
      for (const idx of object.answerIndices) {
        if (idx < 0 || idx >= question.answers.length) {
          throw new Error(`Invalid answer index from AI: ${idx}`);
        }
      }

      console.log(`AI selected ${object.answerIndices.length} answer(s): ${object.answerIndices.join(', ')}`);
      console.log(`Reasoning: ${object.reasoning}`);

      return object;
    } catch (error) {
      throw new Error(`AI analysis failed: ${error}`);
    }
  }

  private buildPrompt(question: Question): string {
    let prompt = `Answer the following quiz question. By default, select only ONE correct answer.\n\nOnly provide multiple answers if the question EXPLICITLY indicates it with phrases such as:\n- "Select all that apply"\n- "Choose 2 answers" or "Select 2 answers" or "Pick 2 answers"\n- "Select the three best options" or "Choose three" or "Select 3"\n- "Select multiple"\n- Or any similar phrasing that specifies a number or "all that apply"\n\nIMPORTANT: If the question specifies a NUMBER (e.g., "select 3", "choose two"), you MUST provide exactly that many answer indices.\n\nIf the question does not explicitly state to select multiple answers, you MUST provide exactly one answer.\n\n`;
    prompt += `Question: ${question.text}\n\nAnswer options:\n`;

    question.answers.forEach((answer, index) => {
      prompt += `${index}. ${answer}\n`;
    });

    prompt += '\nProvide the index/indices (0-based) of the correct answer(s) and explain your reasoning.';

    return prompt;
  }
}
