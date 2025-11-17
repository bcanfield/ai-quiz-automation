import * as fs from 'fs';
import * as path from 'path';

/**
 * Simple test to validate configuration file structure
 */
function validateConfig() {
  const configPath = path.join(__dirname, '..', 'config.example.json');
  
  console.log('Testing configuration validation...');
  
  // Check if example config exists
  if (!fs.existsSync(configPath)) {
    console.error('❌ config.example.json not found');
    process.exit(1);
  }
  console.log('✓ config.example.json exists');
  
  // Parse config
  let config;
  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(content);
    console.log('✓ Configuration is valid JSON');
  } catch (error) {
    console.error('❌ Failed to parse configuration:', error);
    process.exit(1);
  }
  
  // Validate required fields
  const requiredFields = [
    'selectors',
    'selectors.questionContainer',
    'selectors.answerButton',
    'selectors.confirmButton',
    'ai',
    'ai.provider',
    'ai.apiKey',
    'ai.model',
    'browser',
    'browser.debugPort'
  ];
  
  for (const field of requiredFields) {
    const parts = field.split('.');
    let value = config;
    
    for (const part of parts) {
      value = value?.[part];
    }
    
    if (value === undefined || value === null) {
      console.error(`❌ Missing required field: ${field}`);
      process.exit(1);
    }
    console.log(`✓ Field '${field}' is present`);
  }
  
  console.log('\n✅ All configuration tests passed!');
}

validateConfig();
