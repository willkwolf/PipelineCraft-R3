import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';
import { ApiConfig } from '../utils/apiConfig';

test.describe('API Products Tests - DummyJSON', () => {
  const baseURL = ApiConfig.BASE_URL;

  test('GET /products - Get all products with non-empty list', async ({ request }) => {
    const response = await request.get(`${baseURL}/products`);

    // Validate 200 status code
    await ApiHelper.validateStatus(response, 200);

    const responseData = await response.json();

    // Validate products array is not empty
    await ApiHelper.validateNonEmptyArray(response, 'products');

    // Validate pagination metadata
    expect(responseData).toHaveProperty('products');
    expect(responseData).toHaveProperty('total');
    expect(responseData).toHaveProperty('skip');
    expect(responseData).toHaveProperty('limit');

    // Validate product schema
    const firstProduct = responseData.products[0];
    ApiHelper.validateSchema(firstProduct, {
      id: 'number',
      title: 'string',
      price: 'number',
      category: 'string',
      brand: 'string'
    });
  });

  test('GET /products with limit and skip parameters', async ({ request }) => {
    const limit = 5;
    const skip = 10;

    const response = await request.get(`${baseURL}/products?limit=${limit}&skip=${skip}`);

    await ApiHelper.validateStatus(response, 200);

    const responseData = await response.json();

    // Validate limit is respected
    expect(responseData.products.length).toBeLessThanOrEqual(limit);
    expect(responseData.limit).toBe(limit);
    expect(responseData.skip).toBe(skip);
  });

  test('GET /products/:id - Get single product by ID', async ({ request }) => {
    const productId = 1;
    const response = await request.get(`${baseURL}/products/${productId}`);

    // Validate 200 status code
    await ApiHelper.validateStatus(response, 200);

    const product = await response.json();

    // Validate product structure
    expect(product.id).toBe(productId);
    await ApiHelper.validateFields(response, [
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
    ]);

    // Validate data types
    ApiHelper.validateSchema(product, {
      id: 'number',
      title: 'string',
      price: 'number',
      stock: 'number',
      rating: 'number'
    });
  });

  test('GET /products/:id - Invalid product ID returns 404', async ({ request }) => {
    const invalidId = 99999;
    const response = await request.get(`${baseURL}/products/${invalidId}`);

    // Validate 404 status code
    expect(response.status()).toBe(404);

    const responseData = await response.json();
    expect(responseData).toHaveProperty('message');
  });

  test('GET /products/search - Search products by query', async ({ request }) => {
    const searchQuery = 'phone';
    const response = await request.get(`${baseURL}/products/search?q=${searchQuery}`);

    await ApiHelper.validateStatus(response, 200);

    const responseData = await response.json();

    // Validate search results
    expect(responseData).toHaveProperty('products');
    expect(Array.isArray(responseData.products)).toBeTruthy();

    // Validate all results match search query (if any)
    if (responseData.products.length > 0) {
      const firstProduct = responseData.products[0];
      const titleOrDescription =
        firstProduct.title.toLowerCase() + ' ' + firstProduct.description.toLowerCase();
      expect(titleOrDescription).toContain(searchQuery.toLowerCase());
    }
  });

  test('GET /products/categories - Get all product categories', async ({ request }) => {
    const response = await request.get(`${baseURL}/products/categories`);

    await ApiHelper.validateStatus(response, 200);

    const categories = await response.json();

    // Validate categories array is not empty
    expect(Array.isArray(categories)).toBeTruthy();
    expect(categories.length).toBeGreaterThan(0);

    // Validate category structure
    const firstCategory = categories[0];
    expect(firstCategory).toHaveProperty('slug');
    expect(firstCategory).toHaveProperty('name');
  });

  test('GET /products/category/:slug - Get products by category', async ({ request }) => {
    const categorySlug = 'smartphones';
    const response = await request.get(`${baseURL}/products/category/${categorySlug}`);

    await ApiHelper.validateStatus(response, 200);

    const responseData = await response.json();

    // Validate products array
    await ApiHelper.validateNonEmptyArray(response, 'products');

    // Validate all products belong to the category
    responseData.products.forEach((product: any) => {
      expect(product.category.toLowerCase()).toContain('phone');
    });
  });

  test('POST /products/add - Add new product', async ({ request }) => {
    const newProduct = {
      title: 'Test Product - Automated',
      price: 99.99,
      category: 'electronics',
      brand: 'TestBrand',
      description: 'This is a test product created by automation'
    };

    const response = await request.post(`${baseURL}/products/add`, {
      data: newProduct
    });

    // Validate successful creation
    await ApiHelper.validateOk(response);

    const createdProduct = await response.json();

    // Validate product was created with an ID
    expect(createdProduct).toHaveProperty('id');
    expect(createdProduct.id).toBeGreaterThan(0);

    // Validate product data matches
    expect(createdProduct.title).toBe(newProduct.title);
    expect(createdProduct.price).toBe(newProduct.price);
    expect(createdProduct.category).toBe(newProduct.category);
  });

  test('PUT /products/:id - Update product', async ({ request }) => {
    const productId = 1;
    const updates = {
      title: 'Updated Product Title'
    };

    const response = await request.put(`${baseURL}/products/${productId}`, {
      data: updates
    });

    await ApiHelper.validateStatus(response, 200);

    const updatedProduct = await response.json();

    // Validate update was applied
    expect(updatedProduct.title).toBe(updates.title);
    expect(updatedProduct.id).toBe(productId);
  });

  test('DELETE /products/:id - Delete product', async ({ request }) => {
    const productId = 1;
    const response = await request.delete(`${baseURL}/products/${productId}`);

    await ApiHelper.validateStatus(response, 200);

    const deletedProduct = await response.json();

    // Validate deletion
    expect(deletedProduct).toHaveProperty('isDeleted');
    expect(deletedProduct.isDeleted).toBe(true);
    expect(deletedProduct).toHaveProperty('deletedOn');
  });
});
