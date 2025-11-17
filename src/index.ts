#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { QuizHelper } from './quiz-helper';
import { Config } from './types';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  // Load configuration
  const configPath = process.argv[2] || './config.json';

  if (!fs.existsSync(configPath)) {
    console.error(`Configuration file not found: ${configPath}`);
    console.error('Please create a config.json file. See config.example.json for reference.');
    process.exit(1);
  }

  let config: Config;

  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configContent);

    // Verify OPENAI_API_KEY is set
    if (!process.env.OPENAI_API_KEY) {
      console.error('Please set the OPENAI_API_KEY environment variable');
      console.error('Example: export OPENAI_API_KEY=your-api-key-here');
      process.exit(1);
    }
  } catch (error) {
    console.error('Failed to load configuration:', error);
    process.exit(1);
  }

  // Create and start quiz helper
  const quizHelper = new QuizHelper(config);

  try {
    await quizHelper.start();
  } catch (error) {
    console.error('Quiz helper failed:', error);
    process.exit(1);
  }
}

main();
