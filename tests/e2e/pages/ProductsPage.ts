import { Page } from '@playwright/test';

/**
 * Page Object for SauceDemo Products Page
 */
export class ProductsPage {
  private readonly pageTitle = '.title';
  private readonly addToCartButton = (productName: string) =>
    `//div[text()="${productName}"]/ancestor::div[@class="inventory_item"]//button[contains(@class, "btn_inventory")]`;
  private readonly shoppingCartBadge = '.shopping_cart_badge';
  private readonly shoppingCartLink = '.shopping_cart_link';
  private readonly productSort = '.product_sort_container';

  constructor(private page: Page) {}

  async isLoaded(): Promise<boolean> {
    return await this.page.isVisible(this.pageTitle);
  }

  async getTitle(): Promise<string> {
    return await this.page.textContent(this.pageTitle) || '';
  }

  async addProductToCart(productName: string): Promise<void> {
    const button = this.page.locator(this.addToCartButton(productName));
    await button.waitFor({ state: 'visible', timeout: 10000 });
    await button.click();
  }

  async getCartItemCount(): Promise<number> {
    const badge = await this.page.textContent(this.shoppingCartBadge);
    return badge ? parseInt(badge) : 0;
  }

  async goToCart(): Promise<void> {
    await this.page.click(this.shoppingCartLink);
  }

  async sortProducts(option: string): Promise<void> {
    const dropdown = this.page.locator(this.productSort);
    await dropdown.waitFor({ state: 'visible', timeout: 10000 });
    await dropdown.selectOption(option);
  }

  async getFirstProductName(): Promise<string> {
    return await this.page.textContent('.inventory_item_name') || '';
  }

  async getAllProductNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allTextContents();
  }

  async getAllProductPrices(): Promise<number[]> {
    const priceElements = await this.page.locator('.inventory_item_price').allTextContents();
    return priceElements.map(price => parseFloat(price.replace('$', '')));
  }
}
