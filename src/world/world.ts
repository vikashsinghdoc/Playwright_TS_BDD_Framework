import { setWorldConstructor } from "@cucumber/cucumber";
import { AllureCucumberWorld } from "allure-cucumberjs";
import {
  chromium,
  firefox,
  webkit,
  Browser,
  Page,
  BrowserContext
} from "@playwright/test";
import { createScenarioLogger } from "../logger/logger";
import { LoginPage } from "../pages/LoginPage";

export class CustomWorld extends AllureCucumberWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  logger: any;
  loginPage!: LoginPage;

  async init(scenarioName: string, scenarioId: string) {
    const baseLogger = createScenarioLogger(scenarioName, scenarioId);

    // Logger wrapper → logs to file + console + Allure attachment
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

    // ================================
    // ENV CONFIG
    // ================================

    const browserType =
      process.env.BROWSER?.trim().toLowerCase() || "chromium";

    const browserMap: any = {
      chromium,
      firefox,
      webkit
    };

    if (!browserMap[browserType]) {
      throw new Error(
        `Unsupported browser: ${browserType}. Use chromium | firefox | webkit`
      );
    }

    const isHeadless =
      process.env.HEADLESS?.trim().toLowerCase() === "true";

    const slowMo = process.env.SLOWMO
      ? parseInt(process.env.SLOWMO)
      : 0;

    // ================================
    // Launch Browser
    // ================================

    this.browser = await browserMap[browserType].launch({
      headless: isHeadless,
      slowMo
    });

    // 🔥 Context per scenario (better isolation)
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    // ================================
    // Register Pages
    // ================================

    this.loginPage = new LoginPage(this.page, this.logger);
  }

  async close() {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
