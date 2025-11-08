import { Page } from '@playwright/test';
import { Actor } from './Actor';

/**
 * ShopperActor - Represents a shopper interacting with the e-commerce application
 * Used for E2E tests on SauceDemo
 */
export class ShopperActor extends Actor {
  constructor(name: string, page: Page) {
    super(name, page, undefined);
  }

  /**
   * Factory method to create a new shopper
   */
  static named(name: string, page: Page): ShopperActor {
    return new ShopperActor(name, page);
  }

  /**
   * Remember selected products for the shopping cart
   */
  rememberSelectedProducts(products: string[]): void {
    this.remember('selectedProducts', products);
  }

  /**
   * Recall selected products
   */
  recallSelectedProducts(): string[] {
    return this.recall<string[]>('selectedProducts');
  }

  /**
   * Remember checkout information
   */
  rememberCheckoutInfo(firstName: string, lastName: string, postalCode: string): void {
    this.remember('checkoutInfo', { firstName, lastName, postalCode });
  }

  /**
   * Recall checkout information
   */
  recallCheckoutInfo(): { firstName: string; lastName: string; postalCode: string } {
    return this.recall<{ firstName: string; lastName: string; postalCode: string }>('checkoutInfo');
  }

  /**
   * Remember total price
   */
  rememberTotalPrice(price: number): void {
    this.remember('totalPrice', price);
  }

  /**
   * Recall total price
   */
  recallTotalPrice(): number {
    return this.recall<number>('totalPrice');
  }
}
