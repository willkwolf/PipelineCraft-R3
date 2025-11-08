import { Page } from '@playwright/test';

/**
 * Page Object for SauceDemo Login Page
 */
export class LoginPage {
  private readonly usernameInput = '#user-name';
  private readonly passwordInput = '#password';
  private readonly loginButton = '#login-button';
  private readonly errorMessage = '[data-test="error"]';

  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    const baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com';
    await this.page.goto(baseUrl);
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    // Wait for navigation after login click
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      this.page.click(this.loginButton)
    ]);
  }

  async getErrorMessage(): Promise<string> {
    return await this.page.textContent(this.errorMessage) || '';
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.page.isVisible(this.errorMessage);
  }
}
