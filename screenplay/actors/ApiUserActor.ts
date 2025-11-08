import { APIRequestContext } from '@playwright/test';
import { Actor } from './Actor';

/**
 * ApiUserActor - Represents a user interacting with the API
 * Used for API tests on DummyJSON
 */
export class ApiUserActor extends Actor {
  constructor(name: string, apiContext: APIRequestContext) {
    super(name, undefined, apiContext);
  }

  /**
   * Factory method to create a new API user
   */
  static named(name: string, apiContext: APIRequestContext): ApiUserActor {
    return new ApiUserActor(name, apiContext);
  }

  /**
   * Remember authentication token
   */
  rememberAuthToken(token: string): void {
    this.remember('authToken', token);
  }

  /**
   * Recall authentication token
   */
  recallAuthToken(): string {
    return this.recall<string>('authToken');
  }

  /**
   * Remember refresh token
   */
  rememberRefreshToken(token: string): void {
    this.remember('refreshToken', token);
  }

  /**
   * Recall refresh token
   */
  recallRefreshToken(): string {
    return this.recall<string>('refreshToken');
  }

  /**
   * Remember user ID
   */
  rememberUserId(userId: number): void {
    this.remember('userId', userId);
  }

  /**
   * Recall user ID
   */
  recallUserId(): number {
    return this.recall<number>('userId');
  }

  /**
   * Remember cart ID
   */
  rememberCartId(cartId: number): void {
    this.remember('cartId', cartId);
  }

  /**
   * Recall cart ID
   */
  recallCartId(): number {
    return this.recall<number>('cartId');
  }

  /**
   * Remember product list
   */
  rememberProducts(products: any[]): void {
    this.remember('products', products);
  }

  /**
   * Recall product list
   */
  recallProducts(): any[] {
    return this.recall<any[]>('products');
  }

  /**
   * Get authorization header with Bearer token
   */
  getAuthorizationHeader(): { Authorization: string } {
    if (!this.hasRemembered('authToken')) {
      throw new Error(`${this.name} has not authenticated yet - no token available`);
    }
    return {
      Authorization: `Bearer ${this.recallAuthToken()}`
    };
  }
}
