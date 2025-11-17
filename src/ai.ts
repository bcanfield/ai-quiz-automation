import { generateText, Output, stepCountIs } from 'ai';
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
    console.log('Analyzing question with AI (web search enabled)...');

    try {
      const result = await generateText({
        model: openai.responses(this.config.ai.model),
        prompt: this.buildPrompt(question),
        tools: {
          web_search_preview: openai.tools.webSearch({
            searchContextSize: 'high',
          }),
        },
        toolChoice: 'required', // Force initial web search
        stopWhen: stepCountIs(5), // Allow up to 5 steps for multiple searches if needed
        onStepFinish: ({ toolCalls, sources }) => {
          // Log tool calls (search queries)
          if (toolCalls?.length > 0) {
            toolCalls.forEach(call => {
              if (!call.dynamic && call.toolName === 'web_search_preview') {
                console.log(`🔍 Web search triggered`);
              }
            });
          }

          // Log sources retrieved
          if (sources?.length > 0) {
            console.log(`📚 Sources retrieved (${sources.length}):`);
            sources.forEach(source => {
              if (source.sourceType === 'url') {
                console.log(`   - ${source.url}`);
              }
            });
          }
        },
        output: Output.object({
          schema: z.object({
            answerIndices: z.array(z.number()).describe('Array of 0-based answer indices'),
            reasoning: z.string().describe('Explanation for the answer selection'),
          }),
        }),
        temperature: 0.2,
      });

      // Log final sources summary
      if (result.sources && result.sources.length > 0) {
        console.log(`\n✅ Total sources consulted: ${result.sources.length}`);
      }

      // Validate indices
      for (const idx of result.output.answerIndices) {
        if (idx < 0 || idx >= question.answers.length) {
          throw new Error(`Invalid answer index from AI: ${idx}`);
        }
      }

      console.log(`AI selected ${result.output.answerIndices.length} answer(s): ${result.output.answerIndices.join(', ')}`);
      console.log(`Reasoning: ${result.output.reasoning}`);

      return result.output;
    } catch (error) {
      throw new Error(`AI analysis failed: ${error}`);
    }
  }

  private buildPrompt(question: Question): string {
    let prompt = `You are an expert at answering technical certification exam questions. You have access to web search to find authoritative, up-to-date information.

${this.config.ai.customPrompt ? `CUSTOM INSTRUCTIONS:
${this.config.ai.customPrompt}

` : ''}WEB SEARCH STRATEGY:
CRITICAL - Before searching, identify the KEY TECHNICAL TERMS in the question
- You MUST perform at least 2 web searches before answering.
- Your search query MUST include these exact technical terms
- Verify that search results actually discuss the key technical term from the question
- If results don't mention the key term, perform a new search with better keywords
- For "associated with" or "related to" questions, look for direct technical relationships and definitional connections
- Search for official documentation, certification guides, and authoritative technical sources
- If initial results are unclear or conflicting, perform additional targeted searches
- Prioritize recent and official sources over general information
- Compare results from multiple searches to ensure accuracy

ANSWER SELECTION RULES:
EXAM PATTERN AWARENESS:
- If the question mentions a specific technology (e.g., "hypervisor", "VPN", "SSL"), the correct answer often:
  * Directly defines or categorizes that technology (e.g., hypervisor IS virtualization software)
  * Has a technical parent-child or "type-of" relationship
- Beware of distractor answers that are generally related to security but not to the specific technology mentioned in the question

By default, select only ONE correct answer.

Only provide multiple answers if the question EXPLICITLY indicates it with phrases such as:
- "Select all that apply"
- "Choose 2 answers" or "Select 2 answers" or "Pick 2 answers"
- "Select the three best options" or "Choose three" or "Select 3"
- "Select multiple"
- Or any similar phrasing that specifies a number or "all that apply"

IMPORTANT: If the question specifies a NUMBER (e.g., "select 3", "choose two"), you MUST provide exactly that many answer indices.

If the question does not explicitly state to select multiple answers, you MUST provide exactly one answer.

`;
    prompt += `Question: ${question.text}\n\nAnswer options:\n`;

    question.answers.forEach((answer, index) => {
      prompt += `${index}. ${answer}\n`;
    });

    prompt += '\n\nProvide the index/indices (0-based) of the correct answer(s) and explain your reasoning based on the authoritative sources you found.';

    return prompt;
  }
}
