import { Actor, Task } from '../actors/Actor';

/**
 * GetProducts Task - Retrieves products from API
 */
export class GetProducts implements Task {
  private limit: number = 10;
  private skip: number = 0;
  private searchQuery?: string;

  static all(): GetProducts {
    return new GetProducts();
  }

  static matching(query: string): GetProducts {
    const task = new GetProducts();
    task.searchQuery = query;
    return task;
  }

  withLimit(limit: number): this {
    this.limit = limit;
    return this;
  }

  withSkip(skip: number): this {
    this.skip = skip;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const apiContext = actor.getApiContext();

    let endpoint = '/products';

    if (this.searchQuery) {
      endpoint = `/products/search?q=${encodeURIComponent(this.searchQuery)}`;
    } else {
      endpoint = `/products?limit=${this.limit}&skip=${this.skip}`;
    }

    const response = await apiContext.get(endpoint);

    if (!response.ok()) {
      throw new Error(`Get products failed: ${response.status()} ${await response.text()}`);
    }

    const responseData = await response.json();

    actor.remember('productsResponse', responseData);
    actor.remember('products', responseData.products);
    actor.remember('lastApiResponse', response);
  }
}
