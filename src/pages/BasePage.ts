import { Page } from "@playwright/test";

export class BasePage {
  constructor(
    protected page: Page,
    protected logger: any
  ) {}

  async click(locator: string) {
    try {
      this.logger.info(`Clicking element: ${locator}`);

      const element = this.page.locator(locator);
      await element.waitFor({ state: "visible" });
      await element.click();

    } catch (error: any) {
      this.logger.error(`Failed to click element: ${locator}`);
      this.logger.error(error?.stack || error);
      throw error;
    }
  }

  async fill(locator: string, value: string) {
    try {
      this.logger.info(`Filling element: ${locator}`);

      const element = this.page.locator(locator);
      await element.waitFor({ state: "visible" });
      await element.fill(value);

    } catch (error: any) {
      this.logger.error(`Failed to fill element: ${locator}`);
      this.logger.error(error?.stack || error);
      throw error;
    }
  }

  async navigate(url: string) {
    try {
      this.logger.info(`Navigating to URL: ${url}`);
      await this.page.goto(url);

    } catch (error: any) {
      this.logger.error(`Navigation failed: ${url}`);
      this.logger.error(error?.stack || error);
      throw error;
    }
  }

  /**
   * Capture screenshot (do NOT attach to Allure here)
   * Let hooks decide when to attach
   */
  async takeScreenshot(): Promise<Buffer> {
    this.logger.info("Capturing screenshot");
    return await this.page.screenshot({ fullPage: true });
  }
}
