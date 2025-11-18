#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { QuizHelper } from './ai-quiz-automation.js';
import { Config } from './types.js';
import * as dotenv from 'dotenv';
import { logger } from './logger.js';

// Load environment variables
dotenv.config();

async function main() {
  // Load configuration
  const configPath = process.argv[2] || './config.json';

  if (!fs.existsSync(configPath)) {
    logger.error(`Configuration file not found: ${configPath}`);
    logger.error('Please create a config.json file. See config.example.json for reference.');
    process.exit(1);
  }

  let config: Config;

  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configContent);

    // Verify OPENAI_API_KEY is set
    if (!process.env.OPENAI_API_KEY) {
      logger.error('Please set the OPENAI_API_KEY environment variable');
      logger.info('Example: export OPENAI_API_KEY=your-api-key-here');
      process.exit(1);
    }
  } catch (error) {
    logger.error('Failed to load configuration', error);
    process.exit(1);
  }

  // Create and start quiz helper
  const quizHelper = new QuizHelper(config);

  try {
    await quizHelper.start();
  } catch (error) {
    logger.error('Quiz helper failed', error);
    process.exit(1);
  }
}

main();
