import { generateText, generateObject, Output, stepCountIs, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { Config, Question, AIResponse } from './types';

interface ConstraintAnalysis {
  criticalWords: string[];
  constraints: Array<{
    constraint: string;
    invalidatesOptions: number[];
  }>;
  searchFocusAreas: string[];
  validationChecklist: string[];
}

interface EvaluationResult {
  qualityScore: number;
  passesAllConstraints: boolean;
  constraintChecks: Array<{
    constraint: string;
    passes: boolean;
    explanation: string;
  }>;
  issues: string[];
  improvementSuggestions: string[];
}

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
    console.log('Analyzing question with AI (Evaluator-Optimizer workflow)...');

    const MAX_ITERATIONS = 3;
    const CONFIDENCE_THRESHOLD = 90;
    let iteration = 0;

    // Step 1: Analyze constraints (once)
    console.log('\n🧠 Analyzing question constraints...');
    const constraints = await this.analyzeConstraints(question);

    // Evaluator-Optimizer loop
    while (iteration < MAX_ITERATIONS) {
      iteration++;
      console.log(`\n🔄 Iteration ${iteration}/${MAX_ITERATIONS}`);

      // Generate answer with web search
      const answer = await this.generateAnswer(question, constraints);

      // Evaluate answer quality
      const evaluation = await this.evaluateAnswer(question, answer, constraints);
      console.log(`   Score: ${evaluation.qualityScore}/100`);
      console.log(`   Constraints: ${evaluation.passesAllConstraints ? '✅ Pass' : '❌ Fail'}`);

      // Check if answer meets quality threshold
      if (evaluation.qualityScore >= CONFIDENCE_THRESHOLD && evaluation.passesAllConstraints) {
        console.log(`\n✅ Answer validated with high confidence`);
        return answer;
      }

      // If not final iteration, log issues and try again
      if (iteration < MAX_ITERATIONS) {
        console.log(`\n⚠️  Quality below threshold - trying again...`);
        if (evaluation.issues.length > 0) {
          console.log(`   Issues: ${evaluation.issues.join(', ')}`);
        }
      } else {
        console.log(`\n⚠️  Max iterations reached - returning best attempt`);
        return answer;
      }
    }

    throw new Error('Failed to generate answer');
  }

  private async analyzeConstraints(question: Question) {
    const analysis = await generateObject({
      model: openai(this.config.ai.model),
      schema: z.object({
        criticalWords: z.array(z.string()).describe('Critical words/phrases that change answer validity'),
        constraints: z.array(z.object({
          constraint: z.string(),
          invalidatesOptions: z.array(z.number())
        })),
        searchFocusAreas: z.array(z.string()).describe('Specific technical terms to search'),
        validationChecklist: z.array(z.string()).describe('Questions to verify each answer')
      }),
      prompt: `Analyze this question for critical constraints:

Question: ${question.text}

Options:
${question.answers.map((a, i) => `${i}. ${a}`).join('\n')}

Identify:
1. Critical qualifiers (e.g., "still supported" = NOT end-of-life, "targeting X" = vulnerability IN X)
2. Negations (e.g., "NOT", "except")
3. Scope limiters (e.g., "for this app" vs general)
4. Technical terms needing exact definitions

For each constraint, specify which options it eliminates.`,
    });

    console.log(`   ✅ Found ${analysis.object.criticalWords.length} critical words: ${analysis.object.criticalWords.join(', ')}`);
    console.log(`   ✅ Identified ${analysis.object.constraints.length} constraints`);

    return analysis.object;
  }

  private async generateAnswer(
    question: Question,
    constraints: ConstraintAnalysis
  ): Promise<AIResponse> {
    const result = await generateText({
      model: openai.responses(this.config.ai.model),
      prompt: this.buildSearchPrompt(question, constraints),
      tools: {
        web_search_preview: openai.tools.webSearch({
          searchContextSize: 'high',
        }),
      },
      toolChoice: 'required', // Force web search
      stopWhen: stepCountIs(5),
      onStepFinish: ({ sources }) => {
        if (sources?.length > 0) {
          console.log(`   📚 ${sources.length} sources retrieved`);
        }
      },
      output: Output.object({
        schema: z.object({
          answerIndices: z.array(z.number()),
          reasoning: z.string(),
        }),
      }),
    });      // Validate indices
    for (const idx of result.output.answerIndices) {
      if (idx < 0 || idx >= question.answers.length) {
        throw new Error(`Invalid answer index: ${idx}`);
      }
    }

    return result.output;
  }

  private async evaluateAnswer(
    question: Question,
    answer: AIResponse,
    constraints: ConstraintAnalysis
  ): Promise<EvaluationResult> {
    const evaluation = await generateObject({
      model: openai(this.config.ai.model),
      schema: z.object({
        qualityScore: z.number().min(0).max(100),
        passesAllConstraints: z.boolean(),
        constraintChecks: z.array(z.object({
          constraint: z.string(),
          passes: z.boolean(),
          explanation: z.string()
        })),
        issues: z.array(z.string()),
        improvementSuggestions: z.array(z.string())
      }),
      prompt: `Evaluate this answer against the question constraints:

Question: ${question.text}

Selected Answer(s): ${answer.answerIndices.map(i => `${i}. ${question.answers[i]}`).join(', ')}

Reasoning: ${answer.reasoning}

Constraints to verify:
${constraints.constraints.map((c, i) => `${i + 1}. ${c.constraint}`).join('\n')}

Critical words to check: ${constraints.criticalWords.join(', ')}

Validation checklist:
${constraints.validationChecklist.map((q, i) => `${i + 1}. ${q}`).join('\n')}

Evaluate:
1. Does the answer violate any constraints?
2. Does it account for all critical words/qualifiers?
3. Overall quality score (0-100)
4. Specific issues found
5. Suggestions for improvement`,
    });

    return evaluation.object;
  }

  private buildSearchPrompt(question: Question, constraints: ConstraintAnalysis): string {
    return `You are an expert at answering technical certification questions using web search.

${this.config.ai.customPrompt ? `CUSTOM INSTRUCTIONS:\n${this.config.ai.customPrompt}\n\n` : ''}CONSTRAINT ANALYSIS:
Critical Words: ${constraints.criticalWords.join(', ')}
Search Focus Areas: ${constraints.searchFocusAreas.join(', ')}

Constraints that eliminate options:
${constraints.constraints.map(c => `- ${c.constraint} (eliminates options: ${c.invalidatesOptions.join(', ')})`).join('\n')}

Validation Checklist:
${constraints.validationChecklist.map((q, i) => `${i + 1}. ${q}`).join('\n')}

SEARCH STRATEGY:
- Perform 2-3 targeted searches using the search focus areas
- Verify findings against critical words and constraints
- Look for authoritative sources (official docs, certification guides)

Question: ${question.text}

Answer options:
${question.answers.map((a, i) => `${i}. ${a}`).join('\n')}

ANSWER SELECTION:
By default, select only ONE answer.
Only select multiple if explicitly stated: "Select all", "Choose 2", "Select 3", etc.

Provide answer indices and reasoning based on authoritative sources that satisfy ALL constraints.`;
  }

}
