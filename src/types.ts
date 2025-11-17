export interface Config {
  selectors: {
    questionContainer: string;
    answerButton: string;
    confirmButton: string;
  };
  ai: {
    provider: string;
    model: string;
  };
  browser: {
    debugPort: number;
  };
}

export interface Question {
  text: string;
  answers: string[];
}

export interface AIResponse {
  answerIndices: number[];
  reasoning: string;
}
