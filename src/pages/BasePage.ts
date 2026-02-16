import { Page, Locator, FrameLocator, BrowserContext } from "@playwright/test";

export interface BasePageConfig {
  defaultTimeout?: number;
  highlightElements?: boolean;
  autoScreenshotOnError?: boolean;
  highlightDuration?: number;
}

export class BasePage {
  protected readonly defaultTimeout: number;
  protected readonly highlightElements: boolean;
  protected readonly autoScreenshotOnError: boolean;
  protected readonly highlightDuration: number;

  constructor(
    protected page: Page,
    protected logger: any,
    config: BasePageConfig = {}
  ) {
    this.defaultTimeout = config.defaultTimeout ?? 30000;
    this.highlightElements = config.highlightElements ?? true;
    this.autoScreenshotOnError = config.autoScreenshotOnError ?? false;
    this.highlightDuration = config.highlightDuration ?? 1000;
  }

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  async navigate(url: string, options?: { waitUntil?: "load" | "domcontentloaded" | "networkidle" }): Promise<void> {
    try {
      this.logger.info(`Navigating to: ${url}`);
      await this.page.goto(url, {
        timeout: this.defaultTimeout,
        waitUntil: options?.waitUntil ?? "domcontentloaded",
      });
    } catch (error) {
      await this.handleError("navigate", { url }, error);
    }
  }

  async reload(options?: { waitUntil?: "load" | "domcontentloaded" | "networkidle" }): Promise<void> {
    try {
      this.logger.info("Reloading page");
      await this.page.reload({
        timeout: this.defaultTimeout,
        waitUntil: options?.waitUntil ?? "domcontentloaded",
      });
    } catch (error) {
      await this.handleError("reload", {}, error);
    }
  }

  async goBack(options?: { waitUntil?: "load" | "domcontentloaded" | "networkidle" }): Promise<void> {
    try {
      this.logger.info("Navigating back");
      await this.page.goBack({
        timeout: this.defaultTimeout,
        waitUntil: options?.waitUntil ?? "domcontentloaded",
      });
    } catch (error) {
      await this.handleError("goBack", {}, error);
    }
  }

  async goForward(options?: { waitUntil?: "load" | "domcontentloaded" | "networkidle" }): Promise<void> {
    try {
      this.logger.info("Navigating forward");
      await this.page.goForward({
        timeout: this.defaultTimeout,
        waitUntil: options?.waitUntil ?? "domcontentloaded",
      });
    } catch (error) {
      await this.handleError("goForward", {}, error);
    }
  }

  // ============================================================================
  // CLICK ACTIONS
  // ============================================================================

  async click(locator: string, options?: { force?: boolean; timeout?: number; button?: "left" | "right" | "middle" }): Promise<void> {
    try {
      this.logger.info(`Clicking: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.click({
        timeout: options?.timeout ?? this.defaultTimeout,
        force: options?.force,
        button: options?.button,
      });
    } catch (error) {
      await this.handleError("click", { locator }, error);
    }
  }

  async doubleClick(locator: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Double-clicking: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.dblclick({
        timeout: options?.timeout ?? this.defaultTimeout,
        force: options?.force,
      });
    } catch (error) {
      await this.handleError("doubleClick", { locator }, error);
    }
  }

  async rightClick(locator: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Right-clicking: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.click({
        button: "right",
        timeout: options?.timeout ?? this.defaultTimeout,
        force: options?.force,
      });
    } catch (error) {
      await this.handleError("rightClick", { locator }, error);
    }
  }

  async clickByText(text: string, options?: { exact?: boolean; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Clicking by text: "${text}"`);
      const element = this.page.getByText(text, { exact: options?.exact ?? false });
      await this.highlightElement(element);
      await element.click({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("clickByText", { text }, error);
    }
  }

  async clickByRole(
    role: "button" | "link" | "checkbox" | "radio" | "textbox" | "heading" | "listitem",
    name: string | RegExp,
    options?: { timeout?: number; exact?: boolean }
  ): Promise<void> {
    try {
      this.logger.info(`Clicking ${role} with name: ${name}`);
      const element = this.page.getByRole(role, { name, exact: options?.exact });
      await this.highlightElement(element);
      await element.click({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("clickByRole", { role, name }, error);
    }
  }

  async clickByTestId(testId: string, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Clicking by test ID: ${testId}`);
      const element = this.page.getByTestId(testId);
      await this.highlightElement(element);
      await element.click({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("clickByTestId", { testId }, error);
    }
  }

  async clickByPlaceholder(placeholder: string, options?: { exact?: boolean; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Clicking by placeholder: "${placeholder}"`);
      const element = this.page.getByPlaceholder(placeholder, { exact: options?.exact });
      await this.highlightElement(element);
      await element.click({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("clickByPlaceholder", { placeholder }, error);
    }
  }

  async clickNth(locator: string, index: number, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Clicking element at index ${index}: ${locator}`);
      const element = this.page.locator(locator).nth(index);
      await this.highlightElement(element);
      await element.click({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("clickNth", { locator, index }, error);
    }
  }

  async clickFirst(locator: string, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Clicking first element: ${locator}`);
      const element = this.page.locator(locator).first();
      await this.highlightElement(element);
      await element.click({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("clickFirst", { locator }, error);
    }
  }

  async clickLast(locator: string, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Clicking last element: ${locator}`);
      const element = this.page.locator(locator).last();
      await this.highlightElement(element);
      await element.click({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("clickLast", { locator }, error);
    }
  }

  // ============================================================================
  // INPUT ACTIONS
  // ============================================================================

  async fill(locator: string, value: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    try {
      this.logger.info(`Filling: ${locator} with value: "${value}"`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.fill(value, {
        timeout: options?.timeout ?? this.defaultTimeout,
        force: options?.force,
      });
    } catch (error) {
      await this.handleError("fill", { locator, value }, error);
    }
  }

  async type(locator: string, text: string, options?: { delay?: number; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Typing into: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.pressSequentially(text, {
        delay: options?.delay ?? 50,
        timeout: options?.timeout ?? this.defaultTimeout,
      });
    } catch (error) {
      await this.handleError("type", { locator, text }, error);
    }
  }

  async clear(locator: string, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Clearing: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.clear({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("clear", { locator }, error);
    }
  }

  async clearAndFill(locator: string, value: string, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Clearing and filling: ${locator} with value: "${value}"`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.clear();
      await element.fill(value, { timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("clearAndFill", { locator, value }, error);
    }
  }

  async press(locator: string, key: string, options?: { delay?: number }): Promise<void> {
    try {
      this.logger.info(`Pressing key "${key}" on: ${locator}`);
      const element = this.page.locator(locator);
      await element.press(key, { delay: options?.delay });
    } catch (error) {
      await this.handleError("press", { locator, key }, error);
    }
  }

  async pressSequence(keys: string[], options?: { delay?: number }): Promise<void> {
    try {
      this.logger.info(`Pressing key sequence: ${keys.join(", ")}`);
      for (const key of keys) {
        await this.page.keyboard.press(key, { delay: options?.delay });
      }
    } catch (error) {
      await this.handleError("pressSequence", { keys }, error);
    }
  }

  async fillByPlaceholder(placeholder: string, value: string, options?: { exact?: boolean; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Filling by placeholder "${placeholder}" with value: "${value}"`);
      const element = this.page.getByPlaceholder(placeholder, { exact: options?.exact });
      await this.highlightElement(element);
      await element.fill(value, { timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("fillByPlaceholder", { placeholder, value }, error);
    }
  }

  async fillByLabel(label: string, value: string, options?: { exact?: boolean; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Filling by label "${label}" with value: "${value}"`);
      const element = this.page.getByLabel(label, { exact: options?.exact });
      await this.highlightElement(element);
      await element.fill(value, { timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("fillByLabel", { label, value }, error);
    }
  }

  // ============================================================================
  // SELECT & CHECKBOX
  // ============================================================================

  async selectOption(locator: string, value: string | string[], options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Selecting option in: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.selectOption(value, { timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("selectOption", { locator, value }, error);
    }
  }

  async selectByLabel(locator: string, label: string | string[], options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Selecting by label in: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);

      // Fix: Pass label directly, not as object shorthand
      if (Array.isArray(label)) {
        await element.selectOption(label.map(l => ({ label: l })), { timeout: options?.timeout ?? this.defaultTimeout });
      } else {
        await element.selectOption({ label: label }, { timeout: options?.timeout ?? this.defaultTimeout });
      }
    } catch (error) {
      await this.handleError("selectByLabel", { locator, label }, error);
    }
  }

  async selectByIndex(locator: string, index: number, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Selecting by index ${index} in: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.selectOption({ index }, { timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("selectByIndex", { locator, index }, error);
    }
  }

  async check(locator: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Checking checkbox/radio: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.check({
        force: options?.force,
        timeout: options?.timeout ?? this.defaultTimeout,
      });
    } catch (error) {
      await this.handleError("check", { locator }, error);
    }
  }

  async uncheck(locator: string, options?: { force?: boolean; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Unchecking checkbox: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.uncheck({
        force: options?.force,
        timeout: options?.timeout ?? this.defaultTimeout,
      });
    } catch (error) {
      await this.handleError("uncheck", { locator }, error);
    }
  }

  async setChecked(locator: string, checked: boolean, options?: { force?: boolean; timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Setting checked state to ${checked}: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.setChecked(checked, {
        force: options?.force,
        timeout: options?.timeout ?? this.defaultTimeout,
      });
    } catch (error) {
      await this.handleError("setChecked", { locator, checked }, error);
    }
  }

  // ============================================================================
  // MOUSE & KEYBOARD ACTIONS
  // ============================================================================

  async hover(locator: string, options?: { timeout?: number; force?: boolean }): Promise<void> {
    try {
      this.logger.info(`Hovering over: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.hover({
        timeout: options?.timeout ?? this.defaultTimeout,
        force: options?.force,
      });
    } catch (error) {
      await this.handleError("hover", { locator }, error);
    }
  }

  async dragAndDrop(sourceLocator: string, targetLocator: string, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Dragging ${sourceLocator} to ${targetLocator}`);
      const source = this.page.locator(sourceLocator);
      const target = this.page.locator(targetLocator);
      await this.highlightElement(source);
      await this.highlightElement(target);
      await source.dragTo(target, { timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("dragAndDrop", { sourceLocator, targetLocator }, error);
    }
  }

  async scrollIntoView(locator: string, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Scrolling into view: ${locator}`);
      await this.page.locator(locator).scrollIntoViewIfNeeded({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("scrollIntoView", { locator }, error);
    }
  }

  async scrollToTop(): Promise<void> {
    try {
      this.logger.info("Scrolling to top of page");
      await this.page.evaluate(() => window.scrollTo(0, 0));
    } catch (error) {
      await this.handleError("scrollToTop", {}, error);
    }
  }

  async scrollToBottom(): Promise<void> {
    try {
      this.logger.info("Scrolling to bottom of page");
      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    } catch (error) {
      await this.handleError("scrollToBottom", {}, error);
    }
  }

  async scrollBy(x: number, y: number): Promise<void> {
    try {
      this.logger.info(`Scrolling by x: ${x}, y: ${y}`);
      await this.page.evaluate(({ x, y }) => window.scrollBy(x, y), { x, y });
    } catch (error) {
      await this.handleError("scrollBy", { x, y }, error);
    }
  }

  async focus(locator: string, options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Focusing on: ${locator}`);
      const element = this.page.locator(locator);
      await element.focus({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("focus", { locator }, error);
    }
  }

  async blur(locator: string): Promise<void> {
    try {
      this.logger.info(`Blurring: ${locator}`);
      await this.page.locator(locator).blur();
    } catch (error) {
      await this.handleError("blur", { locator }, error);
    }
  }

  // ============================================================================
  // FILE UPLOAD
  // ============================================================================

  async uploadFile(locator: string, filePath: string | string[], options?: { timeout?: number }): Promise<void> {
    try {
      this.logger.info(`Uploading file(s) to: ${locator}`);
      const element = this.page.locator(locator);
      await this.highlightElement(element);
      await element.setInputFiles(filePath, { timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("uploadFile", { locator, filePath }, error);
    }
  }

  async removeUploadedFile(locator: string): Promise<void> {
    try {
      this.logger.info(`Removing uploaded file from: ${locator}`);
      const element = this.page.locator(locator);
      await element.setInputFiles([]);
    } catch (error) {
      await this.handleError("removeUploadedFile", { locator }, error);
    }
  }

  // ============================================================================
  // WAIT UTILITIES
  // ============================================================================

  async waitForElement(
    locator: string,
    state: "attached" | "detached" | "visible" | "hidden" = "visible",
    timeout?: number
  ): Promise<void> {
    try {
      this.logger.info(`Waiting for element ${locator} to be ${state}`);
      await this.page.locator(locator).waitFor({
        state,
        timeout: timeout ?? this.defaultTimeout,
      });
    } catch (error) {
      await this.handleError("waitForElement", { locator, state }, error);
    }
  }

  async waitForUrl(url: string | RegExp, timeout?: number): Promise<void> {
    try {
      this.logger.info(`Waiting for URL: ${url}`);
      await this.page.waitForURL(url, {
        timeout: timeout ?? this.defaultTimeout,
      });
    } catch (error) {
      await this.handleError("waitForUrl", { url }, error);
    }
  }

  async waitForLoadState(state: "load" | "domcontentloaded" | "networkidle" = "load", timeout?: number): Promise<void> {
    try {
      this.logger.info(`Waiting for load state: ${state}`);
      await this.page.waitForLoadState(state, { timeout: timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("waitForLoadState", { state }, error);
    }
  }

  async waitForTimeout(milliseconds: number): Promise<void> {
    this.logger.info(`Waiting for ${milliseconds}ms`);
    await this.page.waitForTimeout(milliseconds);
  }

  async waitForSelector(selector: string, timeout?: number): Promise<void> {
    try {
      this.logger.info(`Waiting for selector: ${selector}`);
      await this.page.waitForSelector(selector, {
        timeout: timeout ?? this.defaultTimeout,
      });
    } catch (error) {
      await this.handleError("waitForSelector", { selector }, error);
    }
  }

  async waitForFunction(
    pageFunction: () => boolean | Promise<boolean>,
    options?: { timeout?: number; polling?: number }
  ): Promise<void> {
    try {
      this.logger.info("Waiting for function to return true");
      await this.page.waitForFunction(pageFunction, {
        timeout: options?.timeout ?? this.defaultTimeout,
        polling: options?.polling,
      });
    } catch (error) {
      await this.handleError("waitForFunction", {}, error);
    }
  }

  async waitUntilVisible(locator: string, timeout?: number): Promise<void> {
    await this.waitForElement(locator, "visible", timeout);
  }

  async waitUntilHidden(locator: string, timeout?: number): Promise<void> {
    await this.waitForElement(locator, "hidden", timeout);
  }

  // ============================================================================
  // GET TEXT UTILITIES
  // ============================================================================

  async getText(locator: string, options?: { timeout?: number }): Promise<string> {
    try {
      this.logger.info(`Getting text from: ${locator}`);
      const element = this.page.locator(locator);
      return (await element.textContent({ timeout: options?.timeout ?? this.defaultTimeout })) ?? "";
    } catch (error) {
      await this.handleError("getText", { locator }, error);
      return "";
    }
  }

  async getInnerText(locator: string, options?: { timeout?: number }): Promise<string> {
    try {
      this.logger.info(`Getting inner text from: ${locator}`);
      const element = this.page.locator(locator);
      return await element.innerText({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("getInnerText", { locator }, error);
      return "";
    }
  }

  async getValue(locator: string, options?: { timeout?: number }): Promise<string> {
    try {
      this.logger.info(`Getting value from: ${locator}`);
      const element = this.page.locator(locator);
      return await element.inputValue({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("getValue", { locator }, error);
      return "";
    }
  }

  async getAllTexts(locator: string): Promise<string[]> {
    try {
      this.logger.info(`Getting all texts from: ${locator}`);
      const elements = this.page.locator(locator);
      return await elements.allTextContents();
    } catch (error) {
      await this.handleError("getAllTexts", { locator }, error);
      return [];
    }
  }

  async getAllInnerTexts(locator: string): Promise<string[]> {
    try {
      this.logger.info(`Getting all inner texts from: ${locator}`);
      const elements = this.page.locator(locator);
      return await elements.allInnerTexts();
    } catch (error) {
      await this.handleError("getAllInnerTexts", { locator }, error);
      return [];
    }
  }

  // ============================================================================
  // GET ATTRIBUTE UTILITIES
  // ============================================================================

  async getAttribute(locator: string, attribute: string, options?: { timeout?: number }): Promise<string | null> {
    try {
      this.logger.info(`Getting attribute "${attribute}" from: ${locator}`);
      const element = this.page.locator(locator);
      return await element.getAttribute(attribute, { timeout: options?.timeout ?? this.defaultTimeout });
    } catch (error) {
      await this.handleError("getAttribute", { locator, attribute }, error);
      return null;
    }
  }

  async getDataAttribute(locator: string, dataAttribute: string): Promise<string | null> {
    return await this.getAttribute(locator, `data-${dataAttribute}`);
  }

  async getHref(locator: string): Promise<string | null> {
    return await this.getAttribute(locator, "href");
  }

  async getSrc(locator: string): Promise<string | null> {
    return await this.getAttribute(locator, "src");
  }

  async getClass(locator: string): Promise<string | null> {
    return await this.getAttribute(locator, "class");
  }

  async getId(locator: string): Promise<string | null> {
    return await this.getAttribute(locator, "id");
  }

  // ============================================================================
  // COUNT & EXISTENCE
  // ============================================================================

  async getCount(locator: string): Promise<number> {
    try {
      this.logger.info(`Counting elements: ${locator}`);
      return await this.page.locator(locator).count();
    } catch (error) {
      await this.handleError("getCount", { locator }, error);
      return 0;
    }
  }

  async exists(locator: string): Promise<boolean> {
    try {
      const count = await this.getCount(locator);
      return count > 0;
    } catch {
      return false;
    }
  }

  // ============================================================================
  // STATE CHECKS
  // ============================================================================

  async isVisible(locator: string, options?: { timeout?: number }): Promise<boolean> {
    try {
      return await this.page.locator(locator).isVisible({ timeout: options?.timeout });
    } catch {
      return false;
    }
  }

  async isHidden(locator: string, options?: { timeout?: number }): Promise<boolean> {
    try {
      return await this.page.locator(locator).isHidden({ timeout: options?.timeout });
    } catch {
      return true;
    }
  }

  async isEnabled(locator: string, options?: { timeout?: number }): Promise<boolean> {
    try {
      return await this.page.locator(locator).isEnabled({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch {
      return false;
    }
  }

  async isDisabled(locator: string, options?: { timeout?: number }): Promise<boolean> {
    try {
      return await this.page.locator(locator).isDisabled({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch {
      return true;
    }
  }

  async isChecked(locator: string, options?: { timeout?: number }): Promise<boolean> {
    try {
      return await this.page.locator(locator).isChecked({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch {
      return false;
    }
  }

  async isEditable(locator: string, options?: { timeout?: number }): Promise<boolean> {
    try {
      return await this.page.locator(locator).isEditable({ timeout: options?.timeout ?? this.defaultTimeout });
    } catch {
      return false;
    }
  }

  async hasText(locator: string, text: string | RegExp, options?: { timeout?: number }): Promise<boolean> {
    try {
      const element = this.page.locator(locator);
      await element.waitFor({ state: "visible", timeout: options?.timeout ?? this.defaultTimeout });
      const actualText = await element.textContent();
      if (typeof text === "string") {
        return actualText?.includes(text) ?? false;
      }
      return text.test(actualText ?? "");
    } catch {
      return false;
    }
  }

  async hasClass(locator: string, className: string): Promise<boolean> {
    try {
      const classAttr = await this.getAttribute(locator, "class");
      return classAttr?.split(" ").includes(className) ?? false;
    } catch {
      return false;
    }
  }

  async hasAttribute(locator: string, attribute: string): Promise<boolean> {
    try {
      const attr = await this.getAttribute(locator, attribute);
      return attr !== null;
    } catch {
      return false;
    }
  }

  // ============================================================================
  // FRAME HANDLING
  // ============================================================================

  getFrame(frameSelector: string): FrameLocator {
    this.logger.info(`Getting frame: ${frameSelector}`);
    return this.page.frameLocator(frameSelector);
  }

  async getFrameByName(name: string) {
    this.logger.info(`Getting frame by name: ${name}`);
    return this.page.frame({ name });
  }

  async getFrameByUrl(url: string | RegExp) {
    this.logger.info(`Getting frame by URL: ${url}`);
    return this.page.frame({ url });
  }

  // ============================================================================
  // DIALOG & ALERT HANDLING
  // ============================================================================

  async acceptDialog(promptText?: string): Promise<void> {
    this.page.once("dialog", async (dialog) => {
      this.logger.info(`Accepting dialog: ${dialog.message()}`);
      await dialog.accept(promptText);
    });
  }

  async dismissDialog(): Promise<void> {
    this.page.once("dialog", async (dialog) => {
      this.logger.info(`Dismissing dialog: ${dialog.message()}`);
      await dialog.dismiss();
    });
  }

  async getDialogMessage(): Promise<string> {
    return new Promise((resolve) => {
      this.page.once("dialog", async (dialog) => {
        const message = dialog.message();
        this.logger.info(`Dialog message: ${message}`);
        await dialog.accept();
        resolve(message);
      });
    });
  }

  // ============================================================================
  // SCREENSHOT & VIDEO
  // ============================================================================

  async takeScreenshot(options?: { fullPage?: boolean; path?: string; quality?: number }): Promise<Buffer> {
    this.logger.info("Capturing screenshot");
    return await this.page.screenshot({
      fullPage: options?.fullPage ?? true,
      path: options?.path,
      quality: options?.quality,
    });
  }

  async takeElementScreenshot(locator: string, path?: string): Promise<Buffer> {
    this.logger.info(`Capturing screenshot of element: ${locator}`);
    return await this.page.locator(locator).screenshot({ path });
  }

  async takeScreenshotWithTimestamp(prefix: string = "screenshot"): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `${prefix}-${timestamp}.png`;
    await this.takeScreenshot({ path: filename });
    return filename;
  }

  // ============================================================================
  // PAGE INFO
  // ============================================================================

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return await this.getUrl();
  }

  async getPageSource(): Promise<string> {
    return await this.page.content();
  }

  // ============================================================================
  // JAVASCRIPT EXECUTION (FIXED)
  // ============================================================================

  async evaluate<T>(pageFunction: () => T | Promise<T>): Promise<T> {
    try {
      this.logger.info("Executing JavaScript in page context");
      return await this.page.evaluate(pageFunction);
    } catch (error) {
      await this.handleError("evaluate", {}, error);
      throw error;
    }
  }

  async evaluateWithArgs<R, Arg>(
    pageFunction: (arg: Arg) => R | Promise<R>,
    arg: Arg
  ): Promise<R> {
    try {
      this.logger.info("Executing JavaScript with arguments in page context");
      return await this.page.evaluate(pageFunction as any, arg);
    } catch (error) {
      await this.handleError("evaluateWithArgs", {}, error);
      throw error;
    }
  }

  async evaluateOnElement<T>(locator: string, pageFunction: (element: Element) => T | Promise<T>): Promise<T> {
    try {
      this.logger.info(`Executing JavaScript on element: ${locator}`);
      return await this.page.locator(locator).evaluate(pageFunction as any);
    } catch (error) {
      await this.handleError("evaluateOnElement", { locator }, error);
      throw error;
    }
  }

  async executeScript<T>(script: string): Promise<T> {
    try {
      this.logger.info("Executing script");
      return await this.page.evaluate(script as any);
    } catch (error) {
      await this.handleError("executeScript", { script }, error);
      throw error;
    }
  }

  // ============================================================================
  // COOKIE & STORAGE
  // ============================================================================

  async getCookies() {
    this.logger.info("Getting cookies");
    return await this.page.context().cookies();
  }

  async getCookie(name: string) {
    const cookies = await this.getCookies();
    return cookies.find((cookie) => cookie.name === name);
  }

  async addCookie(cookie: { name: string; value: string; domain?: string; path?: string; expires?: number; httpOnly?: boolean; secure?: boolean; sameSite?: "Strict" | "Lax" | "None" }): Promise<void> {
    this.logger.info(`Adding cookie: ${cookie.name}`);
    await this.page.context().addCookies([cookie]);
  }

  async deleteCookie(name: string): Promise<void> {
    this.logger.info(`Deleting cookie: ${name}`);
    await this.page.context().clearCookies({ name });
  }

  async clearCookies(): Promise<void> {
    this.logger.info("Clearing all cookies");
    await this.page.context().clearCookies();
  }

  async getLocalStorage(key: string): Promise<string | null> {
    this.logger.info(`Getting localStorage: ${key}`);
    return await this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  async setLocalStorage(key: string, value: string): Promise<void> {
    this.logger.info(`Setting localStorage: ${key}`);
    await this.page.evaluate(
      ({ k, v }) => localStorage.setItem(k, v),
      { k: key, v: value }
    );
  }

  async removeLocalStorage(key: string): Promise<void> {
    this.logger.info(`Removing localStorage: ${key}`);
    await this.page.evaluate((k) => localStorage.removeItem(k), key);
  }

  async clearLocalStorage(): Promise<void> {
    this.logger.info("Clearing localStorage");
    await this.page.evaluate(() => localStorage.clear());
  }

  async getSessionStorage(key: string): Promise<string | null> {
    this.logger.info(`Getting sessionStorage: ${key}`);
    return await this.page.evaluate((k) => sessionStorage.getItem(k), key);
  }

  async setSessionStorage(key: string, value: string): Promise<void> {
    this.logger.info(`Setting sessionStorage: ${key}`);
    await this.page.evaluate(
      ({ k, v }) => sessionStorage.setItem(k, v),
      { k: key, v: value }
    );
  }

  async clearSessionStorage(): Promise<void> {
    this.logger.info("Clearing sessionStorage");
    await this.page.evaluate(() => sessionStorage.clear());
  }

  // ============================================================================
  // NETWORK
  // ============================================================================

  async waitForResponse(
    urlPattern: string | RegExp,
    options?: { timeout?: number }
  ): Promise<any> {
    try {
      this.logger.info(`Waiting for response: ${urlPattern}`);
      const response = await this.page.waitForResponse(urlPattern, {
        timeout: options?.timeout ?? this.defaultTimeout,
      });
      return await response.json();
    } catch (error) {
      await this.handleError("waitForResponse", { urlPattern }, error);
      throw error;
    }
  }

  async waitForRequest(
    urlPattern: string | RegExp,
    options?: { timeout?: number }
  ): Promise<void> {
    try {
      this.logger.info(`Waiting for request: ${urlPattern}`);
      await this.page.waitForRequest(urlPattern, {
        timeout: options?.timeout ?? this.defaultTimeout,
      });
    } catch (error) {
      await this.handleError("waitForRequest", { urlPattern }, error);
    }
  }

  async interceptResponse(urlPattern: string | RegExp, mockResponse: any): Promise<void> {
    await this.page.route(urlPattern, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockResponse),
      });
    });
  }

  async blockRequest(urlPattern: string | RegExp): Promise<void> {
    this.logger.info(`Blocking requests matching: ${urlPattern}`);
    await this.page.route(urlPattern, (route) => route.abort());
  }

  async unblockRequest(urlPattern: string | RegExp): Promise<void> {
    this.logger.info(`Unblocking requests matching: ${urlPattern}`);
    await this.page.unroute(urlPattern);
  }

  // ============================================================================
  // VIEWPORT & BROWSER
  // ============================================================================

  async setViewportSize(width: number, height: number): Promise<void> {
    this.logger.info(`Setting viewport size: ${width}x${height}`);
    await this.page.setViewportSize({ width, height });
  }

  async getViewportSize(): Promise<{ width: number; height: number } | null> {
    return this.page.viewportSize();
  }

  async maximizeWindow(): Promise<void> {
    await this.setViewportSize(1920, 1080);
  }

  async bringToFront(): Promise<void> {
    await this.page.bringToFront();
  }

  async close(): Promise<void> {
    this.logger.info("Closing page");
    await this.page.close();
  }

  // ============================================================================
  // TABLE UTILITIES
  // ============================================================================

  async getTableData(tableLocator: string): Promise<string[][]> {
    try {
      this.logger.info(`Getting table data from: ${tableLocator}`);
      return await this.page.locator(tableLocator).evaluate((table) => {
        const rows = Array.from(table.querySelectorAll("tr"));
        return rows.map((row) => {
          const cells = Array.from(row.querySelectorAll("td, th"));
          return cells.map((cell) => cell.textContent?.trim() ?? "");
        });
      });
    } catch (error) {
      await this.handleError("getTableData", { tableLocator }, error);
      return [];
    }
  }

  async getTableRowCount(tableLocator: string): Promise<number> {
    try {
      return await this.getCount(`${tableLocator} tr`);
    } catch (error) {
      await this.handleError("getTableRowCount", { tableLocator }, error);
      return 0;
    }
  }

  async getTableColumnCount(tableLocator: string): Promise<number> {
    try {
      return await this.getCount(`${tableLocator} tr:first-child td, ${tableLocator} tr:first-child th`);
    } catch (error) {
      await this.handleError("getTableColumnCount", { tableLocator }, error);
      return 0;
    }
  }

  async getTableCell(tableLocator: string, row: number, column: number): Promise<string> {
    try {
      const cellLocator = `${tableLocator} tr:nth-child(${row + 1}) td:nth-child(${column + 1}), ${tableLocator} tr:nth-child(${row + 1}) th:nth-child(${column + 1})`;
      return await this.getText(cellLocator);
    } catch (error) {
      await this.handleError("getTableCell", { tableLocator, row, column }, error);
      return "";
    }
  }

  // ============================================================================
  // LOCATOR UTILITIES
  // ============================================================================

  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  getByText(text: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByText(text, options);
  }

  getByRole(role: "button" | "link" | "checkbox" | "radio" | "textbox" | "heading" | "listitem", name?: string | RegExp): Locator {
    return this.page.getByRole(role, { name });
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  getByPlaceholder(placeholder: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByPlaceholder(placeholder, options);
  }

  getByLabel(label: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByLabel(label, options);
  }

  getByAltText(altText: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByAltText(altText, options);
  }

  getByTitle(title: string | RegExp, options?: { exact?: boolean }): Locator {
    return this.page.getByTitle(title, options);
  }

  // ============================================================================
  // CONTEXT & NEW PAGE
  // ============================================================================

  getContext(): BrowserContext {
    return this.page.context();
  }

  async openNewTab(url?: string): Promise<Page> {
    this.logger.info(`Opening new tab${url ? ` with URL: ${url}` : ""}`);
    const context = this.page.context();
    const newPage = await context.newPage();
    if (url) {
      await newPage.goto(url);
    }
    return newPage;
  }

  async switchToTab(index: number): Promise<Page> {
    this.logger.info(`Switching to tab at index: ${index}`);
    const pages = this.page.context().pages();
    if (index < 0 || index >= pages.length) {
      throw new Error(`Tab index ${index} is out of range. Available tabs: ${pages.length}`);
    }
    await pages[index].bringToFront();
    return pages[index];
  }

  async closeCurrentTab(): Promise<void> {
    this.logger.info("Closing current tab");
    await this.page.close();
  }

  async getAllTabs(): Promise<Page[]> {
    return this.page.context().pages();
  }

  async getTabCount(): Promise<number> {
    return this.page.context().pages().length;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  protected async highlightElement(element: Locator): Promise<void> {
    if (!this.highlightElements) return;

    try {
      await element.evaluate(
        (el, duration) => {
          (el as HTMLElement).style.outline = "4px solid red";
          (el as HTMLElement).style.backgroundColor = "rgba(255, 0, 0, 0.15)";
          setTimeout(() => {
            (el as HTMLElement).style.outline = "";
            (el as HTMLElement).style.backgroundColor = "";
          }, duration);
        },
        this.highlightDuration
      );
    } catch {
      // Ignore highlight failures silently
    }
  }

  protected async handleError(action: string, context: Record<string, any>, error: any): Promise<void> {
    this.logger.error(`Failed to ${action}`);
    this.logger.error(`Context: ${JSON.stringify(context, null, 2)}`);
    this.logger.error(error?.stack || error);

    if (this.autoScreenshotOnError) {
      try {
        const screenshot = await this.takeScreenshot();
        this.logger.info("Error screenshot captured");
        // Attach to Allure or save to file as needed
      } catch (screenshotError) {
        this.logger.error("Failed to capture error screenshot");
      }
    }

    throw error;
  }

  // ============================================================================
  // DEBUGGING UTILITIES
  // ============================================================================

  async pause(): Promise<void> {
    this.logger.info("Pausing execution for debugging");
    await this.page.pause();
  }

  async logPageInfo(): Promise<void> {
    const url = await this.getUrl();
    const title = await this.getTitle();
    this.logger.info(`Current URL: ${url}`);
    this.logger.info(`Page Title: ${title}`);
  }

  async logElementInfo(locator: string): Promise<void> {
    const count = await this.getCount(locator);
    const isVisible = await this.isVisible(locator);
    const text = await this.getText(locator);
    this.logger.info(`Element: ${locator}`);
    this.logger.info(`Count: ${count}`);
    this.logger.info(`Visible: ${isVisible}`);
    this.logger.info(`Text: ${text}`);
  }
}