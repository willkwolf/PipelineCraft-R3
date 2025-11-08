import { test, expect } from '@playwright/test';
import { ApiHelper } from '../utils/apiHelper';
import { ApiConfig } from '../utils/apiConfig';

test.describe('API Authentication Tests - DummyJSON', () => {
  const baseURL = ApiConfig.BASE_URL;
  const validUsername = ApiConfig.CREDENTIALS.username;
  const validPassword = ApiConfig.CREDENTIALS.password;

  test('POST /auth/login - Successful login with valid credentials', async ({ request }) => {
    const response = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: validUsername,
        password: validPassword,
        expiresInMins: 30
      }
    });

    // Validate 200 status code
    await ApiHelper.validateStatus(response, 200);

    const responseData = await response.json();

    // Validate response contains required fields
    await ApiHelper.validateFields(response, [
      'id',
      'username',
      'email',
      'firstName',
      'lastName',
      'gender',
      'image',
      'accessToken',
      'refreshToken'
    ]);

    // Validate token structure (JWT format)
    ApiHelper.validateJWTFormat(responseData.accessToken);
    ApiHelper.validateJWTFormat(responseData.refreshToken);

    // Validate user object structure
    expect(responseData.id).toBeGreaterThan(0);
    expect(responseData.username).toBe(validUsername);
    expect(responseData.email).toContain('@');
  });

  test('POST /auth/login - Failed login with invalid credentials', async ({ request }) => {
    const response = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: 'invaliduser',
        password: 'wrongpassword'
      }
    });

    // Validate error status code (400)
    expect(response.status()).toBe(400);

    const responseData = await response.json();

    // Validate error message exists
    expect(responseData).toHaveProperty('message');
  });

  test('POST /auth/login - Failed login with missing password', async ({ request }) => {
    const response = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: validUsername
      }
    });

    // Validate error status code
    expect(response.status()).toBe(400);
  });

  test('GET /auth/me - Get authenticated user with valid token', async ({ request }) => {
    // First login to get token
    const loginResponse = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: validUsername,
        password: validPassword
      }
    });

    const loginData = await loginResponse.json();
    const token = loginData.accessToken;

    // Use token to get user info
    const response = await request.get(`${baseURL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Validate successful response
    await ApiHelper.validateStatus(response, 200);

    const userData = await response.json();

    // Validate user data
    expect(userData.id).toBe(loginData.id);
    expect(userData.username).toBe(validUsername);
    await ApiHelper.validateFields(response, ['id', 'username', 'email', 'firstName', 'lastName']);
  });

  test('GET /auth/me - Fail with invalid token', async ({ request }) => {
    const response = await request.get(`${baseURL}/auth/me`, {
      headers: {
        Authorization: 'Bearer invalid_token_here'
      }
    });

    // Validate unauthorized status
    expect([401, 403]).toContain(response.status());
  });

  test('POST /auth/refresh - Refresh access token', async ({ request }) => {
    // First login to get refresh token
    const loginResponse = await request.post(`${baseURL}/auth/login`, {
      data: {
        username: validUsername,
        password: validPassword
      }
    });

    const loginData = await loginResponse.json();
    const refreshToken = loginData.refreshToken;

    // Refresh the token
    const response = await request.post(`${baseURL}/auth/refresh`, {
      data: {
        refreshToken: refreshToken,
        expiresInMins: 30
      }
    });

    // Validate successful response
    await ApiHelper.validateStatus(response, 200);

    const responseData = await response.json();

    // Validate new tokens are returned
    expect(responseData).toHaveProperty('accessToken');
    expect(responseData).toHaveProperty('refreshToken');

    // Validate JWT format
    ApiHelper.validateJWTFormat(responseData.accessToken);
    ApiHelper.validateJWTFormat(responseData.refreshToken);
  });
});
