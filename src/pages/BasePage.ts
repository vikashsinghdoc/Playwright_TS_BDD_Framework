import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';

export class BasePage {

  constructor(protected page: Page) {}

  async click(locator:string){
    await this.page.locator(locator).waitFor({ state: 'visible' });
    await this.page.locator(locator).click();
  }

  async fill(locator:string, value:string){
    await this.page.locator(locator).waitFor({ state: 'visible' });
    await this.page.locator(locator).fill(value);
  }

  async takeScreenshot(name: string = 'Screenshot') {
    const screenshot = await this.page.screenshot();
    allure.attachment(name, screenshot, 'image/png');
  }
}