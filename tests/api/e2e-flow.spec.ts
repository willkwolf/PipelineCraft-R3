import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';

test.describe('API E2E Flow - Complete User Shopping Journey', () => {
  const baseURL = process.env.API_URL || 'https://dummyjson.com';
  const validUsername = process.env.API_USERNAME || 'emilys';
  const validPassword = process.env.API_PASSWORD || 'emilyspass';

  let authToken: string;
  let refreshToken: string;
  let userId: number;
  let selectedProducts: number[];
  let cartId: number;

  test('Complete shopping flow: Login → Browse → Add to Cart → Update → View → Delete', async ({
    request
  }) => {
    // STEP 1: Authenticate user
    console.log('STEP 1: Authenticating user...');
    const loginResponse = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: validUsername,
        password: validPassword,
        expiresInMins: 30
      }
    });

    await ApiHelper.validateStatus(loginResponse, 200);

    const loginData = await loginResponse.json();
    authToken = loginData.accessToken;
    refreshToken = loginData.refreshToken;
    userId = loginData.id;

    console.log(`✓ User authenticated: ${loginData.username} (ID: ${userId})`);

    // Validate token structure
    ApiHelper.validateJWTFormat(authToken);

    // STEP 2: Get products list
    console.log('STEP 2: Fetching products...');
    const productsResponse = await request.get(`${baseURL}/products?limit=10`);

    await ApiHelper.validateStatus(productsResponse, 200);
    await ApiHelper.validateNonEmptyArray(productsResponse, 'products');

    const productsData = await productsResponse.json();
    selectedProducts = productsData.products.slice(0, 3).map((p: any) => p.id);

    console.log(`✓ Found ${productsData.products.length} products`);
    console.log(`✓ Selected products: ${selectedProducts.join(', ')}`);

    // STEP 3: Create cart with selected products
    console.log('STEP 3: Creating shopping cart...');
    const createCartResponse = await request.post(`${baseURL}/carts/add`, {
      data: {
        userId: userId,
        products: selectedProducts.map(id => ({ id, quantity: 2 }))
      }
    });

    await ApiHelper.validateOk(createCartResponse);

    const cartData = await createCartResponse.json();
    cartId = cartData.id;

    console.log(`✓ Cart created with ID: ${cartId}`);
    console.log(`✓ Total products: ${cartData.totalProducts}`);
    console.log(`✓ Cart total: $${cartData.total.toFixed(2)}`);
    console.log(`✓ Discounted total: $${cartData.discountedTotal.toFixed(2)}`);

    // Validate cart structure
    expect(cartData.userId).toBe(userId);
    expect(cartData.products.length).toBe(selectedProducts.length);
    expect(cartData.total).toBeGreaterThan(0);
    expect(cartData.discountedTotal).toBeLessThanOrEqual(cartData.total);

    // STEP 4: Retrieve the created cart
    console.log('STEP 4: Retrieving cart...');
    const getCartResponse = await request.get(`${baseURL}/carts/${cartId}`);

    await ApiHelper.validateStatus(getCartResponse, 200);

    const retrievedCart = await getCartResponse.json();

    console.log(`✓ Cart retrieved successfully`);
    expect(retrievedCart.id).toBe(cartId);
    expect(retrievedCart.products.length).toBe(selectedProducts.length);

    // STEP 5: Update cart (add more products with merge)
    console.log('STEP 5: Updating cart (adding more products)...');
    const updateCartResponse = await request.put(`${baseURL}/carts/${cartId}`, {
      data: {
        merge: true,
        products: [{ id: selectedProducts[0], quantity: 5 }] // Increase quantity of first product
      }
    });

    await ApiHelper.validateStatus(updateCartResponse, 200);

    const updatedCart = await updateCartResponse.json();

    console.log(`✓ Cart updated successfully`);
    console.log(`✓ New total: $${updatedCart.total.toFixed(2)}`);

    // STEP 6: Get all carts for the user
    console.log('STEP 6: Fetching all user carts...');
    const userCartsResponse = await request.get(`${baseURL}/carts/user/${userId}`);

    await ApiHelper.validateStatus(userCartsResponse, 200);

    const userCarts = await userCartsResponse.json();

    console.log(`✓ User has ${userCarts.carts.length} cart(s)`);

    expect(Array.isArray(userCarts.carts)).toBeTruthy();
    expect(userCarts.carts.length).toBeGreaterThan(0);

    // STEP 7: Validate user session with token
    console.log('STEP 7: Validating user session...');
    const meResponse = await request.get(`${baseURL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    await ApiHelper.validateStatus(meResponse, 200);

    const userData = await meResponse.json();

    console.log(`✓ Session valid for user: ${userData.username}`);
    expect(userData.id).toBe(userId);

    // STEP 8: Delete the cart (simulate checkout)
    console.log('STEP 8: Deleting cart (checkout simulation)...');
    const deleteCartResponse = await request.delete(`${baseURL}/carts/${cartId}`);

    await ApiHelper.validateStatus(deleteCartResponse, 200);

    const deletedCart = await deleteCartResponse.json();

    console.log(`✓ Cart deleted successfully`);

    expect(deletedCart.isDeleted).toBe(true);
    expect(deletedCart.deletedOn).toBeDefined();

    console.log('\n=== COMPLETE E2E FLOW SUCCESSFUL ===');
  });

  test('Product Discovery Flow: Categories → Filter → Search → Details', async ({ request }) => {
    console.log('PRODUCT DISCOVERY FLOW');

    // STEP 1: Get all categories
    console.log('STEP 1: Fetching product categories...');
    const categoriesResponse = await request.get(`${baseURL}/products/categories`);

    await ApiHelper.validateStatus(categoriesResponse, 200);

    const categories = await categoriesResponse.json();

    console.log(`✓ Found ${categories.length} categories`);

    expect(categories.length).toBeGreaterThan(0);

    // STEP 2: Get products from first category
    const firstCategory = categories[0];
    console.log(`STEP 2: Fetching products from category: ${firstCategory.name}...`);

    const categoryProductsResponse = await request.get(`${baseURL}/products/category/${firstCategory.slug}`);

    await ApiHelper.validateStatus(categoryProductsResponse, 200);

    const categoryProducts = await categoryProductsResponse.json();

    console.log(`✓ Found ${categoryProducts.products.length} products in ${firstCategory.name}`);

    expect(categoryProducts.products.length).toBeGreaterThan(0);

    // STEP 3: Search for products
    const searchQuery = 'laptop';
    console.log(`STEP 3: Searching for "${searchQuery}"...`);

    const searchResponse = await request.get(`${baseURL}/products/search?q=${searchQuery}`);

    await ApiHelper.validateStatus(searchResponse, 200);

    const searchResults = await searchResponse.json();

    console.log(`✓ Search returned ${searchResults.products.length} results`);

    // STEP 4: Get details of first search result
    if (searchResults.products.length > 0) {
      const firstProduct = searchResults.products[0];
      console.log(`STEP 4: Getting details for: ${firstProduct.title}...`);

      const productResponse = await request.get(`${baseURL}/products/${firstProduct.id}`);

      await ApiHelper.validateStatus(productResponse, 200);

      const productDetails = await productResponse.json();

      console.log(`✓ Product details retrieved`);
      console.log(`  - Title: ${productDetails.title}`);
      console.log(`  - Price: $${productDetails.price}`);
      console.log(`  - Rating: ${productDetails.rating}/5`);
      console.log(`  - Stock: ${productDetails.stock} units`);

      expect(productDetails.id).toBe(firstProduct.id);
    }

    console.log('\n=== PRODUCT DISCOVERY FLOW SUCCESSFUL ===');
  });
});
