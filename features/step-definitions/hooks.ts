import { Before, After, BeforeStep, AfterStep, Status } from "@cucumber/cucumber";

import { testContext } from "../../src/fixture/testContext";
import { createScenarioLogger } from "../../src/logger/logger";

let scenarioLogger: any;

Before(async function (scenario) {
  const scenarioName = scenario.pickle.name;
  const scenarioId = scenario.pickle.id.substring(0, 8);

  scenarioLogger = createScenarioLogger(scenarioName, scenarioId);
  this.logger = scenarioLogger;

  const startMessage = `START SCENARIO: ${scenarioName}`;
  scenarioLogger.info(startMessage);

  // Appears under "Set up"
  await this.attach(startMessage, "text/plain");

  await testContext.init();
});

BeforeStep(async function ({ pickleStep }) {
  const message = `STEP: ${pickleStep.text}`;

  this.logger.info(message);

  // Appears inside that specific step
  await this.attach(message, "text/plain");
});

AfterStep(async function ({ pickleStep, result }) {
  if (result?.status === Status.FAILED) {
    const errorMessage = result.message || "Step failed";

    this.logger.error(`FAILED STEP: ${pickleStep.text}`);
    this.logger.error(errorMessage);

    // Attach error inside failed step
    await this.attach(errorMessage, "text/plain");

    // Attach screenshot
    const screenshot = await testContext.page.screenshot({
      fullPage: true
    });

    await this.attach(screenshot, "image/png");
  }
});

After(async function (scenario) {
  const scenarioName = scenario.pickle.name;

  const endMessage =
    scenario.result?.status === Status.PASSED
      ? `SCENARIO PASSED`
      : `SCENARIO FAILED`;

  this.logger.info(`${endMessage}: ${scenarioName}`);

  // Appears under "Tear down"
  await this.attach(`${endMessage}: ${scenarioName}`, "text/plain");

  await testContext.close();
});
