import { APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * API Helper - Utility functions for API testing
 */
export class ApiHelper {
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
   * Validate URL format
   */
  static validateURL(url: string): void {
    expect(url).toMatch(/^https?:\/\/.+/);
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): void {
    expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  }

  /**
   * Validate number is within range
   */
  static validateRange(value: number, min: number, max: number): void {
    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
  }
}
