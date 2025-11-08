import { Page } from '@playwright/test';

/**
 * Page Object for SauceDemo Checkout Pages
 */
export class CheckoutPage {
  private readonly firstNameInput = '#first-name';
  private readonly lastNameInput = '#last-name';
  private readonly postalCodeInput = '#postal-code';
  private readonly continueButton = '#continue';
  private readonly finishButton = '#finish';
  private readonly completeHeader = '.complete-header';
  private readonly totalPrice = '.summary_total_label';

  constructor(private page: Page) {}

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.page.fill(this.firstNameInput, firstName);
    await this.page.fill(this.lastNameInput, lastName);
    await this.page.fill(this.postalCodeInput, postalCode);
  }

  async continue(): Promise<void> {
    await this.page.click(this.continueButton);
  }

  async finish(): Promise<void> {
    await this.page.click(this.finishButton);
  }

  async getCompletionMessage(): Promise<string> {
    return await this.page.textContent(this.completeHeader) || '';
  }

  async getTotalPrice(): Promise<string> {
    return await this.page.textContent(this.totalPrice) || '';
  }

  async isOrderComplete(): Promise<boolean> {
    return await this.page.isVisible(this.completeHeader);
  }
}
