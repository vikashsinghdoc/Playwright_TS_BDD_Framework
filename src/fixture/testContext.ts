import { chromium, Browser, Page } from '@playwright/test';

class TestContext {

  browser!: Browser;
  page!: Page;

  async init() {
    console.log('Launching browser...');
    this.browser = await chromium.launch({ headless: false });
    console.log('Browser launched successfully');
    this.page = await this.browser.newPage();
    console.log('New page created');
  }

  async close() {
    console.log('Closing browser...');
    await this.browser.close();
    console.log('Browser closed');
  }
}

export const testContext = new TestContext();