import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';
import { ApiConfig } from '../utils/apiConfig';

test.describe('API Contract Tests - DummyJSON Schema Validation', () => {
  const baseURL = ApiConfig.BASE_URL;

  test('Auth Login Response Contract - Validate complete schema', async ({ request }) => {
    const response = await request.post(`${baseURL}/auth/login`, {
      data: ApiConfig.CREDENTIALS
    });

    const data = await response.json();

    // Validate schema: fields and types
    ApiHelper.validateSchema(data, {
      id: 'number',
      username: 'string',
      email: 'string',
      firstName: 'string',
      lastName: 'string',
      gender: 'string',
      image: 'string',
      accessToken: 'string',
      refreshToken: 'string'
    });

    // Validate formats
    ApiHelper.validateEmail(data.email);
    ApiHelper.validateURL(data.image);

    // Validate token lengths (JWT tokens are long)
    expect(data.accessToken.length).toBeGreaterThan(100);
    expect(data.refreshToken.length).toBeGreaterThan(100);
  });

  test('Product Response Contract - Validate product object schema', async ({ request }) => {
    const response = await request.get(`${baseURL}/products/1`);
    const product = await response.json();

    // Validate schema: fields and types
    ApiHelper.validateSchema(product, {
      id: 'number',
      title: 'string',
      description: 'string',
      price: 'number',
      discountPercentage: 'number',
      rating: 'number',
      stock: 'number',
      brand: 'string',
      category: 'string',
      thumbnail: 'string'
    });

    expect(Array.isArray(product.images)).toBeTruthy();

    // Validate value ranges
    expect(product.price).toBeGreaterThan(0);
    ApiHelper.validateRange(product.rating, 0, 5);
    expect(product.stock).toBeGreaterThanOrEqual(0);
    ApiHelper.validateRange(product.discountPercentage, 0, 100);

    // Validate URLs
    ApiHelper.validateURL(product.thumbnail);
    product.images.forEach((image: string) => ApiHelper.validateURL(image));
  });

  test('Products List Response Contract - Validate pagination structure', async ({ request }) => {
    const response = await request.get(`${baseURL}/products?limit=10&skip=5`);
    const data = await response.json();

    // Validate schema: fields and types
    ApiHelper.validateSchema(data, {
      total: 'number',
      skip: 'number',
      limit: 'number'
    });

    expect(Array.isArray(data.products)).toBeTruthy();

    // Validate pagination values
    expect(data.skip).toBe(5);
    expect(data.limit).toBe(10);
    expect(data.total).toBeGreaterThan(0);
    expect(data.products.length).toBeLessThanOrEqual(data.limit);
  });

  test('Cart Response Contract - Validate cart object schema', async ({ request }) => {
    const response = await request.get(`${baseURL}/carts/1`);
    const cart = await response.json();

    // Validate schema: fields and types
    ApiHelper.validateSchema(cart, {
      id: 'number',
      total: 'number',
      discountedTotal: 'number',
      userId: 'number',
      totalProducts: 'number',
      totalQuantity: 'number'
    });

    expect(Array.isArray(cart.products)).toBeTruthy();

    // Validate cart products structure
    if (cart.products.length > 0) {
      const firstProduct = cart.products[0];

      ApiHelper.validateSchema(firstProduct, {
        id: 'number',
        title: 'string',
        price: 'number',
        quantity: 'number',
        total: 'number',
        discountPercentage: 'number',
        discountedTotal: 'number'
      });

      // Validate calculations
      const expectedTotal = firstProduct.price * firstProduct.quantity;
      expect(Math.abs(firstProduct.total - expectedTotal)).toBeLessThan(0.01);
    }

    // Validate totals are positive
    expect(cart.total).toBeGreaterThan(0);
    expect(cart.discountedTotal).toBeGreaterThan(0);
    expect(cart.discountedTotal).toBeLessThanOrEqual(cart.total);
  });

  test('Error Response Contract - Validate error message structure', async ({ request }) => {
    const response = await request.get(`${baseURL}/products/99999`);

    expect(response.status()).toBe(404);

    const errorData = await response.json();

    // Validate error response has message
    expect(errorData).toHaveProperty('message');
    expect(typeof errorData.message).toBe('string');
    expect(errorData.message.length).toBeGreaterThan(0);
  });

  test('Category Response Contract - Validate category object schema', async ({ request }) => {
    const response = await request.get(`${baseURL}/products/categories`);
    const categories = await response.json();

    expect(Array.isArray(categories)).toBeTruthy();
    expect(categories.length).toBeGreaterThan(0);

    // Validate category structure
    const firstCategory = categories[0];
    ApiHelper.validateSchema(firstCategory, {
      slug: 'string',
      name: 'string',
      url: 'string'
    });

    // Validate URL format
    expect(firstCategory.url).toMatch(/^https?:\/\/.+\/products\/category\/.+/);
  });
});
