import { setWorldConstructor, World } from "@cucumber/cucumber";
import {
  chromium,
  firefox,
  webkit,
  Browser,
  BrowserContext,
  Page
} from "@playwright/test";
import { createScenarioLogger } from "../logger/logger";
import { LoginPage } from "../pages/LoginPage";

/**
 * Custom Cucumber World
 * Modern implementation (No deprecated AllureCucumberWorld)
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  logger!: {
    info: (message: string) => Promise<void>;
    error: (message: string) => Promise<void>;
  };

  loginPage!: LoginPage;

  private _lastAction: string = "";

  get lastAction() {
    return this._lastAction;
  }

  async init(scenarioName: string, scenarioId: string) {
    const baseLogger = createScenarioLogger(scenarioName, scenarioId);

    const isDebug =
      process.env.DEBUG?.trim().toLowerCase() === "true";

    // 🔥 Logger Wrapper
    this.logger = {
      info: async (message: string) => {
        baseLogger.info(message);
        this._lastAction = message;

        if (isDebug) {
          await this.attach(message, "text/plain");
        }
      },

      error: async (message: string) => {
        baseLogger.error(message);

        if (isDebug) {
          await this.attach(`ERROR: ${message}`, "text/plain");
        }
      }
    };

    // ================================
    // ENV CONFIG
    // ================================

    const browserType =
      process.env.BROWSER?.trim().toLowerCase() || "chromium";

    const browserMap = {
      chromium,
      firefox,
      webkit
    };

    if (!browserMap[browserType as keyof typeof browserMap]) {
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

    this.browser = await browserMap[
      browserType as keyof typeof browserMap
    ].launch({
      headless: isHeadless,
      slowMo
    });

    // Context per scenario (Parallel-safe)
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
