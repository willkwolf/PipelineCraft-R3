import { Actor, Task } from '../actors/Actor';
import { ApiUserActor } from '../actors/ApiUserActor';

/**
 * AuthenticateUser Task - Authenticates a user via API
 */
export class AuthenticateUser implements Task {
  private constructor(private username: string, private password: string) {}

  static withCredentials(username: string, password: string): AuthenticateUser {
    return new AuthenticateUser(username, password);
  }

  static asDefaultUser(): AuthenticateUser {
    return new AuthenticateUser(
      process.env.API_USERNAME || 'emilys',
      process.env.API_PASSWORD || 'emilyspass'
    );
  }

  async performAs(actor: Actor): Promise<void> {
    const apiContext = actor.getApiContext();

    const response = await apiContext.post('/auth/login', {
      data: {
        username: this.username,
        password: this.password,
        expiresInMins: 30
      }
    });

    if (!response.ok()) {
      throw new Error(`Authentication failed: ${response.status()} ${await response.text()}`);
    }

    const responseData = await response.json();

    // Save authentication data if actor is ApiUserActor
    if (actor instanceof ApiUserActor) {
      actor.rememberAuthToken(responseData.accessToken);
      actor.rememberRefreshToken(responseData.refreshToken);
      actor.rememberUserId(responseData.id);
    }

    // Also save to general memory
    actor.remember('authResponse', responseData);
    actor.remember('lastApiResponse', response);
  }
}
