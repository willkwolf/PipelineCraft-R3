import { Actor, Task } from '../actors/Actor';
import { ProductsPage } from '../../tests/e2e/pages/ProductsPage';
import { CartPage } from '../../tests/e2e/pages/CartPage';
import { CheckoutPage } from '../../tests/e2e/pages/CheckoutPage';

/**
 * Checkout Task - Completes the checkout process
 */
export class Checkout implements Task {
  private constructor(
    private firstName: string,
    private lastName: string,
    private postalCode: string
  ) {}

  static withInformation(firstName: string, lastName: string, postalCode: string): Checkout {
    return new Checkout(firstName, lastName, postalCode);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.getPage();

    // Navigate to cart
    const productsPage = new ProductsPage(page);
    await productsPage.goToCart();

    // Proceed to checkout
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    // Fill information and complete
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInformation(this.firstName, this.lastName, this.postalCode);
    await checkoutPage.continue();
    await checkoutPage.finish();
  }
}
