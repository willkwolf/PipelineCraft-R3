import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';

test.describe('API Contract Tests - DummyJSON Schema Validation', () => {
  const baseURL = process.env.API_URL || 'https://dummyjson.com';

  test('Auth Login Response Contract - Validate complete schema', async ({ request }) => {
    const response = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: process.env.API_USERNAME || 'emilys',
        password: process.env.API_PASSWORD || 'emilyspass'
      }
    });

    const data = await response.json();

    // Validate required fields
    const requiredFields = ['id', 'username', 'email', 'firstName', 'lastName', 'gender', 'image', 'accessToken', 'refreshToken'];
    requiredFields.forEach(field => {
      expect(data).toHaveProperty(field);
    });

    // Validate field types
    expect(typeof data.id).toBe('number');
    expect(typeof data.username).toBe('string');
    expect(typeof data.email).toBe('string');
    expect(typeof data.firstName).toBe('string');
    expect(typeof data.lastName).toBe('string');
    expect(typeof data.gender).toBe('string');
    expect(typeof data.image).toBe('string');
    expect(typeof data.accessToken).toBe('string');
    expect(typeof data.refreshToken).toBe('string');

    // Validate email format
    expect(data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    // Validate image URL format
    expect(data.image).toMatch(/^https?:\/\/.+/);

    // Validate token lengths (JWT tokens are long)
    expect(data.accessToken.length).toBeGreaterThan(100);
    expect(data.refreshToken.length).toBeGreaterThan(100);
  });

  test('Product Response Contract - Validate product object schema', async ({ request }) => {
    const response = await request.get(`${baseURL}/products/1`);
    const product = await response.json();

    // Validate all required product fields
    const requiredFields = [
      'id',
      'title',
      'description',
      'price',
      'discountPercentage',
      'rating',
      'stock',
      'brand',
      'category',
      'thumbnail',
      'images'
    ];

    requiredFields.forEach(field => {
      expect(product).toHaveProperty(field);
    });

    // Validate field types
    expect(typeof product.id).toBe('number');
    expect(typeof product.title).toBe('string');
    expect(typeof product.description).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(typeof product.discountPercentage).toBe('number');
    expect(typeof product.rating).toBe('number');
    expect(typeof product.stock).toBe('number');
    expect(typeof product.brand).toBe('string');
    expect(typeof product.category).toBe('string');
    expect(typeof product.thumbnail).toBe('string');
    expect(Array.isArray(product.images)).toBeTruthy();

    // Validate value ranges
    expect(product.price).toBeGreaterThan(0);
    expect(product.rating).toBeGreaterThanOrEqual(0);
    expect(product.rating).toBeLessThanOrEqual(5);
    expect(product.stock).toBeGreaterThanOrEqual(0);
    expect(product.discountPercentage).toBeGreaterThanOrEqual(0);
    expect(product.discountPercentage).toBeLessThanOrEqual(100);

    // Validate URLs
    expect(product.thumbnail).toMatch(/^https?:\/\/.+/);
    product.images.forEach((image: string) => {
      expect(image).toMatch(/^https?:\/\/.+/);
    });
  });

  test('Products List Response Contract - Validate pagination structure', async ({ request }) => {
    const response = await request.get(`${baseURL}/products?limit=10&skip=5`);
    const data = await response.json();

    // Validate top-level structure
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('total');
    expect(data).toHaveProperty('skip');
    expect(data).toHaveProperty('limit');

    // Validate types
    expect(Array.isArray(data.products)).toBeTruthy();
    expect(typeof data.total).toBe('number');
    expect(typeof data.skip).toBe('number');
    expect(typeof data.limit).toBe('number');

    // Validate pagination values
    expect(data.skip).toBe(5);
    expect(data.limit).toBe(10);
    expect(data.total).toBeGreaterThan(0);
    expect(data.products.length).toBeLessThanOrEqual(data.limit);
  });

  test('Cart Response Contract - Validate cart object schema', async ({ request }) => {
    const response = await request.get(`${baseURL}/carts/1`);
    const cart = await response.json();

    // Validate required cart fields
    const requiredFields = ['id', 'products', 'total', 'discountedTotal', 'userId', 'totalProducts', 'totalQuantity'];

    requiredFields.forEach(field => {
      expect(cart).toHaveProperty(field);
    });

    // Validate field types
    expect(typeof cart.id).toBe('number');
    expect(Array.isArray(cart.products)).toBeTruthy();
    expect(typeof cart.total).toBe('number');
    expect(typeof cart.discountedTotal).toBe('number');
    expect(typeof cart.userId).toBe('number');
    expect(typeof cart.totalProducts).toBe('number');
    expect(typeof cart.totalQuantity).toBe('number');

    // Validate cart products structure
    if (cart.products.length > 0) {
      const firstProduct = cart.products[0];

      expect(firstProduct).toHaveProperty('id');
      expect(firstProduct).toHaveProperty('title');
      expect(firstProduct).toHaveProperty('price');
      expect(firstProduct).toHaveProperty('quantity');
      expect(firstProduct).toHaveProperty('total');
      expect(firstProduct).toHaveProperty('discountPercentage');
      expect(firstProduct).toHaveProperty('discountedTotal');

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
    expect(firstCategory).toHaveProperty('slug');
    expect(firstCategory).toHaveProperty('name');
    expect(firstCategory).toHaveProperty('url');

    expect(typeof firstCategory.slug).toBe('string');
    expect(typeof firstCategory.name).toBe('string');
    expect(typeof firstCategory.url).toBe('string');

    // Validate URL format
    expect(firstCategory.url).toMatch(/^https?:\/\/.+\/products\/category\/.+/);
  });
});
