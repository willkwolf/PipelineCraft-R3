import { APIRequestContext, APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * API Helper - Utility functions for API testing
 */
export class ApiHelper {
  constructor(private apiContext: APIRequestContext) {}

  /**
   * Validate response status code
   */
  static async validateStatus(response: APIResponse, expectedStatus: number): Promise<void> {
    expect(response.status()).toBe(expectedStatus);
  }

  /**
   * Validate response is OK (200-299)
   */
  static async validateOk(response: APIResponse): Promise<void> {
    expect(response.ok()).toBeTruthy();
  }

  /**
   * Validate JSON response body contains expected fields
   */
  static async validateFields(response: APIResponse, fields: string[]): Promise<void> {
    const body = await response.json();

    for (const field of fields) {
      expect(body).toHaveProperty(field);
    }
  }

  /**
   * Validate array response is not empty
   */
  static async validateNonEmptyArray(response: APIResponse, arrayPath?: string): Promise<void> {
    const body = await response.json();
    const array = arrayPath ? body[arrayPath] : body;

    expect(Array.isArray(array)).toBeTruthy();
    expect(array.length).toBeGreaterThan(0);
  }

  /**
   * Validate JWT token format
   */
  static validateJWTFormat(token: string): void {
    const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    expect(token).toMatch(jwtPattern);
  }

  /**
   * Validate object schema
   */
  static validateSchema(obj: any, schema: { [key: string]: string }): void {
    for (const [key, type] of Object.entries(schema)) {
      expect(obj).toHaveProperty(key);
      expect(typeof obj[key]).toBe(type);
    }
  }

  /**
   * Extract value from response
   */
  static async extractValue(response: APIResponse, path: string): Promise<any> {
    const body = await response.json();
    const keys = path.split('.');
    let value = body;

    for (const key of keys) {
      value = value[key];
    }

    return value;
  }

  /**
   * Make authenticated request
   */
  async makeAuthenticatedRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    token: string,
    data?: any
  ): Promise<APIResponse> {
    const options: any = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.data = data;
    }

    switch (method) {
      case 'GET':
        return await this.apiContext.get(endpoint, options);
      case 'POST':
        return await this.apiContext.post(endpoint, options);
      case 'PUT':
        return await this.apiContext.put(endpoint, options);
      case 'DELETE':
        return await this.apiContext.delete(endpoint, options);
    }
  }
}
