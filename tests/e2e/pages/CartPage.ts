import { Page } from '@playwright/test';

/**
 * Page Object for SauceDemo Cart Page
 */
export class CartPage {
  private readonly cartItem = '.cart_item';
  private readonly checkoutButton = '#checkout';
  private readonly continueShoppingButton = '#continue-shopping';
  private readonly removeButton = (productName: string) =>
    `//div[text()="${productName}"]/ancestor::div[@class="cart_item"]//button`;

  constructor(private page: Page) {}

  async getCartItemCount(): Promise<number> {
    return await this.page.locator(this.cartItem).count();
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.click(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.page.click(this.continueShoppingButton);
  }

  async removeProduct(productName: string): Promise<void> {
    await this.page.click(this.removeButton(productName));
  }

  async getProductNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }
}
