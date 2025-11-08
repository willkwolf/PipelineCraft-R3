import { Actor, Question } from '../actors/Actor';
import { APIResponse } from '@playwright/test';

/**
 * ApiResponse Question - Retrieves information about API responses
 */
export class ApiResponse {
  static status(): Question<number> {
    return {
      async answeredBy(actor: Actor): Promise<number> {
        const response = actor.recall<APIResponse>('lastApiResponse');
        return response.status();
      }
    };
  }

  static body<T>(): Question<T> {
    return {
      async answeredBy(actor: Actor): Promise<T> {
        const response = actor.recall<APIResponse>('lastApiResponse');
        return await response.json();
      }
    };
  }

  static headers(): Question<{ [key: string]: string }> {
    return {
      async answeredBy(actor: Actor): Promise<{ [key: string]: string }> {
        const response = actor.recall<APIResponse>('lastApiResponse');
        return response.headers();
      }
    };
  }

  static isOk(): Question<boolean> {
    return {
      async answeredBy(actor: Actor): Promise<boolean> {
        const response = actor.recall<APIResponse>('lastApiResponse');
        return response.ok();
      }
    };
  }

  static text(): Question<string> {
    return {
      async answeredBy(actor: Actor): Promise<string> {
        const response = actor.recall<APIResponse>('lastApiResponse');
        return await response.text();
      }
    };
  }
}
