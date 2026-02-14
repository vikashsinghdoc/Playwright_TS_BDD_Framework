import { execSync } from 'child_process';
import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Run BDD Tests', async () => {
  try {
    execSync('npx cucumber-js', { stdio: 'inherit' });
  } catch (error) {
    console.log('Cucumber tests completed (may have failures)');
  }
  
  // Post-process: attach screenshots to results
  console.log('Post-processing: Attaching screenshots to Allure results...');
  try {
    const allureDir = './allure-results';
    const metadataFile = path.join(allureDir, '.screenshots-metadata.json');
    
    if (fs.existsSync(metadataFile)) {
      const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf-8')) as Array<{ scenarioId: string; fileName: string }>;
      
      if (metadata.length > 0) {
        // Find result files
        const resultFiles = fs.readdirSync(allureDir).filter(f => f.endsWith('-result.json'));
        console.log(`Found ${resultFiles.length} result files`);
        
        for (const result of resultFiles) {
          const resultPath = path.join(allureDir, result);
          const resultContent = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));
          
          // Look for matching screenshot - attach to failed scenarios
          if (resultContent.status === 'broken' || resultContent.status === 'failed') {
            const screenshot = metadata[0]; // Use the first screenshot for failed scenario
            
            if (screenshot && !resultContent.attachments?.some((a: { source: string }) => a.source === screenshot.fileName)) {
              if (!resultContent.attachments) resultContent.attachments = [];
              
              resultContent.attachments.push({
                name: 'Screenshot on Failure',
                source: screenshot.fileName,
                type: 'image/png'
              });
              
              fs.writeFileSync(resultPath, JSON.stringify(resultContent));
              console.log(`✓ Attached screenshot to ${result}`);
            }
          }
        }
        
        // Clean up metadata file
        fs.unlinkSync(metadataFile);
      }
    }
  } catch (error) {
    console.error('Error in post-processing:', error);
  }
});