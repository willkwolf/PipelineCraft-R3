/**
 * API Configuration - Centralized API testing configuration
 */
export class ApiConfig {
  /**
   * Base URL for API endpoints
   */
  static readonly BASE_URL = process.env.API_URL || 'https://dummyjson.com';

  /**
   * Valid test credentials
   */
  static readonly CREDENTIALS = {
    username: process.env.API_USERNAME || 'emilys',
    password: process.env.API_PASSWORD || 'emilyspass'
  };

  /**
   * Test user IDs with known data in DummyJSON
   */
  static readonly TEST_USER_IDS = {
    withCarts: 33,      // User with existing carts
    withoutCarts: 1     // User without carts
  };

  /**
   * Test resource IDs that exist in DummyJSON
   */
  static readonly TEST_RESOURCE_IDS = {
    cart: 1,
    product: 1,
    invalidProduct: 99999
  };
}
