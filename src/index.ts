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
    
    // Override API key from environment variable if available
    if (process.env.OPENAI_API_KEY) {
      config.ai.apiKey = process.env.OPENAI_API_KEY;
    }
    
    if (!config.ai.apiKey || config.ai.apiKey === 'YOUR_API_KEY_HERE') {
      console.error('Please set your OpenAI API key in config.json or OPENAI_API_KEY environment variable');
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
