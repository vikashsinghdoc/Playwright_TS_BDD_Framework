import { setWorldConstructor, World } from "@cucumber/cucumber";
import {
  chromium,
  firefox,
  webkit,
  Browser,
  BrowserContext,
  Page,
  BrowserType
} from "@playwright/test";
import { createScenarioLogger } from "../logger/logger";
import { LoginPage } from "../pages/LoginPage";

type Logger = {
  info: (message: string) => Promise<void>;
  error: (message: string) => Promise<void>;
};

type SupportedBrowser = "chromium" | "firefox" | "webkit";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  logger!: Logger;
  loginPage!: LoginPage;

  private _lastAction: string = "";

  get lastAction(): string {
    return this._lastAction;
  }

  async init(scenarioName: string, scenarioId: string): Promise<void> {
    const baseLogger = createScenarioLogger(scenarioName, scenarioId);

    const isDebug =
      process.env.DEBUG?.trim().toLowerCase() === "true";

    // ================================
    // Logger Wrapper
    // ================================
    this.logger = {
      info: async (message: string) => {
        baseLogger.info(message);

        // Always track last action
        this._lastAction = message;

        // Only attach logs in DEBUG mode
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

    const browserName = (
      process.env.BROWSER?.trim().toLowerCase() || "chromium"
    ) as SupportedBrowser;

    const browserMap: Record<SupportedBrowser, BrowserType> = {
      chromium,
      firefox,
      webkit
    };

    if (!browserMap[browserName]) {
      throw new Error(
        `Unsupported browser: ${browserName}. Use chromium | firefox | webkit`
      );
    }

    const isHeadless =
      process.env.HEADLESS?.trim().toLowerCase() === "true";

    const slowMo = process.env.SLOWMO
      ? Number(process.env.SLOWMO)
      : 0;

    // ================================
    // Launch Browser
    // ================================

    this.browser = await browserMap[browserName].launch({
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

  async close(): Promise<void> {
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(CustomWorld);
