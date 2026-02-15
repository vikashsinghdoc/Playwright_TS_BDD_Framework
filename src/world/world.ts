import { setWorldConstructor } from "@cucumber/cucumber";
import { AllureCucumberWorld } from "allure-cucumberjs";
import { chromium, Browser, Page } from "@playwright/test";
import { createScenarioLogger } from "../logger/logger";
import { LoginPage } from "../pages/LoginPage";

export class CustomWorld extends AllureCucumberWorld {
  browser!: Browser;
  page!: Page;
  logger: any;
  loginPage!: LoginPage;

  async init(scenarioName: string, scenarioId: string) {
    const baseLogger = createScenarioLogger(scenarioName, scenarioId);

    // 🔥 Wrap logger to also attach to Allure
    this.logger = {
      info: async (message: string) => {
        baseLogger.info(message);
        await this.attach(message, "text/plain");
      },
      error: async (message: string) => {
        baseLogger.error(message);
        await this.attach(`ERROR: ${message}`, "text/plain");
      }
    };

    this.browser = await chromium.launch({ headless: false });
    this.page = await this.browser.newPage();

    this.loginPage = new LoginPage(this.page, this.logger);
  }

  async close() {
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
