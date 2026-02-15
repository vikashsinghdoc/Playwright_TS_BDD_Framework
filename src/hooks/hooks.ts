import {
  Before,
  After,
  BeforeStep,
  AfterStep,
  Status, setDefaultTimeout
} from "@cucumber/cucumber";


setDefaultTimeout(
  process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 60000
);
Before(async function (scenario) {
  const scenarioName = scenario.pickle.name;
  const scenarioId = scenario.pickle.id.substring(0, 8);

  await this.init(scenarioName, scenarioId);

  // Logger already attaches to Allure (via world wrapper)
  await this.logger.info(`START SCENARIO: ${scenarioName}`);
});

BeforeStep(async function ({ pickleStep }) {
  // Logger already attaches to Allure
  await this.logger.info(`STEP: ${pickleStep.text}`);
});

AfterStep(async function ({ result }) {
  if (result?.status === Status.FAILED) {

    const isDebug =
      process.env.DEBUG?.trim().toLowerCase() === "true";

    // 🔴 Attach last failed action
    const failedAction = this.lastAction;

    if (failedAction) {
      await this.attach(`❌ ${failedAction}`, "text/plain");
    }

    // 🔥 Screenshot (element already highlighted earlier)
    const screenshot = await this.page.screenshot({
      fullPage: true
    });

    await this.attach(screenshot, "image/png");

    // 🔵 If DEBUG=true, attach full log file
    if (isDebug) {
      const fs = require("fs");
      const path = require("path");

      const logPath = path.join(process.cwd(), "logs/framework.log");

      if (fs.existsSync(logPath)) {
        const logs = fs.readFileSync(logPath, "utf-8");
        await this.attach(logs, "text/plain");
      }
    }
  }
});


After(async function (scenario) {
  const status =
    scenario.result?.status === Status.PASSED
      ? "SCENARIO PASSED"
      : "SCENARIO FAILED";

  await this.logger.info(status);

  await this.close();
});
