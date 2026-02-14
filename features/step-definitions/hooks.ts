import { Before, After, Status, AfterStep } from '@cucumber/cucumber';
import { testContext } from '../../src/fixture/testContext'
import * as fs from 'fs';
import * as path from 'path';

let failedStepScreenshot: Buffer | null = null;
let currentScenarioId: string | null = null;
let screenshotsMetadata: Array<{ scenarioId: string; fileName: string }> = [];

Before(async function(scenario) {
  currentScenarioId = scenario.pickle.id;
  failedStepScreenshot = null;
  await testContext.init();
});

AfterStep(async (step) => {
  if (step.result?.status === Status.FAILED) {
    console.log('Capturing screenshot on step failure...');
    try {
      const screenshot = await testContext.page.screenshot();
      failedStepScreenshot = screenshot;
    } catch (error) {
      console.error('Failed to capture step screenshot:', error);
    }
  }
});

After(async (scenario) => {
  try {
    if (scenario.result?.status === Status.FAILED && failedStepScreenshot && currentScenarioId) {
      console.log('Saving screenshot for failed scenario...');
      const allureDir = './allure-results';
      
      // Ensure directory exists
      if (!fs.existsSync(allureDir)) {
        fs.mkdirSync(allureDir, { recursive: true });
      }
      
      // Generate screenshot filename - use scenario ID for predictability
      const screenshotName = `screenshot-${currentScenarioId.substring(0, 8)}-${Date.now()}.png`;
      const screenshotPath = path.join(allureDir, screenshotName);
      
      // Write screenshot to disk
      fs.writeFileSync(screenshotPath, failedStepScreenshot);
      console.log(`Screenshot saved: ${screenshotName}`);
      
      // Save metadata for post-processing
      screenshotsMetadata.push({
        scenarioId: currentScenarioId,
        fileName: screenshotName
      });
      
      // Write metadata to a temp file for cucumber runner to process
      const metadataFile = path.join(allureDir, '.screenshots-metadata.json');
      fs.writeFileSync(metadataFile, JSON.stringify(screenshotsMetadata));
    }
  } catch (error) {
    console.error('Failed to process screenshot:', error);
  } finally {
    await testContext.close();
    failedStepScreenshot = null;
    currentScenarioId = null;
  }
});