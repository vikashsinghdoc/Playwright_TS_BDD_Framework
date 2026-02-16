import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {

  async navigate(url: string) {
    this.logger.info(`Navigating to ${url}`);
    await this.page.goto(url);
  }

  async login(user: string, pass: string) {
    await this.click(".ico-login");
    await this.fill("#Email", user);
    await this.fill("#Password", pass);
    await this.click(".login-button");
  }

  async validateLogin() {
    const logoutBtn= this.page.locator(".ico-logout")
    this.highlightElement(logoutBtn)
    await expect(logoutBtn).toHaveText("Log out");
  }
}
