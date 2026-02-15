import {
  Before,
  After,
  BeforeStep,
  AfterStep,
  Status
} from "@cucumber/cucumber";

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
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, "image/png");
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
