import { Actor, Task } from '../actors/Actor';
import { ApiUserActor } from '../actors/ApiUserActor';

/**
 * ManageCart Task - Manages shopping cart via API
 */
export class ManageCart implements Task {
  private operation: 'create' | 'update' | 'delete' | 'get' = 'create';
  private userId?: number;
  private cartId?: number;
  private products: Array<{ id: number; quantity: number }> = [];
  private merge: boolean = false;

  static create(): ManageCart {
    const task = new ManageCart();
    task.operation = 'create';
    return task;
  }

  static update(cartId: number): ManageCart {
    const task = new ManageCart();
    task.operation = 'update';
    task.cartId = cartId;
    return task;
  }

  static get(cartId: number): ManageCart {
    const task = new ManageCart();
    task.operation = 'get';
    task.cartId = cartId;
    return task;
  }

  static delete(cartId: number): ManageCart {
    const task = new ManageCart();
    task.operation = 'delete';
    task.cartId = cartId;
    return task;
  }

  forUser(userId: number): this {
    this.userId = userId;
    return this;
  }

  withProducts(...products: Array<{ id: number; quantity: number }>): this {
    this.products = products;
    return this;
  }

  mergingWithExisting(): this {
    this.merge = true;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const apiContext = actor.getApiContext();

    let response;

    switch (this.operation) {
      case 'create':
        const userId = this.userId || (actor instanceof ApiUserActor ? actor.recallUserId() : undefined);
        if (!userId) {
          throw new Error('User ID is required to create a cart');
        }

        response = await apiContext.post('/carts/add', {
          data: {
            userId,
            products: this.products
          }
        });

        if (response.ok()) {
          const data = await response.json();
          if (actor instanceof ApiUserActor) {
            actor.rememberCartId(data.id);
          }
          actor.remember('cartData', data);
        }
        break;

      case 'update':
        if (!this.cartId) {
          throw new Error('Cart ID is required to update a cart');
        }

        response = await apiContext.put(`/carts/${this.cartId}`, {
          data: {
            merge: this.merge,
            products: this.products
          }
        });

        if (response.ok()) {
          const data = await response.json();
          actor.remember('cartData', data);
        }
        break;

      case 'get':
        if (!this.cartId) {
          throw new Error('Cart ID is required to get a cart');
        }

        response = await apiContext.get(`/carts/${this.cartId}`);

        if (response.ok()) {
          const data = await response.json();
          actor.remember('cartData', data);
        }
        break;

      case 'delete':
        if (!this.cartId) {
          throw new Error('Cart ID is required to delete a cart');
        }

        response = await apiContext.delete(`/carts/${this.cartId}`);
        break;
    }

    if (!response?.ok()) {
      throw new Error(
        `Cart ${this.operation} failed: ${response?.status()} ${await response?.text()}`
      );
    }

    actor.remember('lastApiResponse', response);
  }
}
