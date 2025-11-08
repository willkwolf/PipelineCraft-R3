import { Actor, Task } from '../actors/Actor';
import { ProductsPage } from '../../tests/e2e/pages/ProductsPage';

/**
 * AddToCart Task - Adds products to shopping cart
 */
export class AddToCart implements Task {
  private constructor(private productNames: string[]) {}

  static product(productName: string): AddToCart {
    return new AddToCart([productName]);
  }

  static products(...productNames: string[]): AddToCart {
    return new AddToCart(productNames);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.getPage();
    const productsPage = new ProductsPage(page);

    for (const productName of this.productNames) {
      await productsPage.addProductToCart(productName);
    }
  }
}
