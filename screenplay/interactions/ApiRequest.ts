import { Actor, Task } from '../actors/Actor';
import { APIResponse } from '@playwright/test';

/**
 * ApiRequest Interaction - Makes API requests
 */
export class ApiRequest implements Task {
  private headers: Record<string, string> = {};
  private body?: any;

  private constructor(
    private method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    private endpoint: string
  ) {}

  /**
   * Make a GET request
   */
  static get(endpoint: string): ApiRequest {
    return new ApiRequest('GET', endpoint);
  }

  /**
   * Make a POST request
   */
  static post(endpoint: string): ApiRequest {
    return new ApiRequest('POST', endpoint);
  }

  /**
   * Make a PUT request
   */
  static put(endpoint: string): ApiRequest {
    return new ApiRequest('PUT', endpoint);
  }

  /**
   * Make a PATCH request
   */
  static patch(endpoint: string): ApiRequest {
    return new ApiRequest('PATCH', endpoint);
  }

  /**
   * Make a DELETE request
   */
  static delete(endpoint: string): ApiRequest {
    return new ApiRequest('DELETE', endpoint);
  }

  /**
   * Add headers to the request
   */
  withHeaders(headers: Record<string, string>): this {
    this.headers = { ...this.headers, ...headers };
    return this;
  }

  /**
   * Add body to the request
   */
  withBody(body: any): this {
    this.body = body;
    return this;
  }

  /**
   * Save response to actor's memory
   */
  private saveKey?: string;

  as(key: string): this {
    this.saveKey = key;
    return this;
  }

  async performAs(actor: Actor): Promise<void> {
    const apiContext = actor.getApiContext();

    let response: APIResponse;

    const requestOptions: any = {
      headers: this.headers,
    };

    if (this.body) {
      requestOptions.data = this.body;
    }

    switch (this.method) {
      case 'GET':
        response = await apiContext.get(this.endpoint, requestOptions);
        break;
      case 'POST':
        response = await apiContext.post(this.endpoint, requestOptions);
        break;
      case 'PUT':
        response = await apiContext.put(this.endpoint, requestOptions);
        break;
      case 'PATCH':
        response = await apiContext.patch(this.endpoint, requestOptions);
        break;
      case 'DELETE':
        response = await apiContext.delete(this.endpoint, requestOptions);
        break;
    }

    // Save the response if a key was provided
    if (this.saveKey) {
      actor.remember(this.saveKey, response);
    }

    // Also save the last response
    actor.remember('lastApiResponse', response);
  }
}
