import { Actor, Task } from '../actors/Actor';
import { LoginPage } from '../../tests/e2e/pages/LoginPage';

/**
 * Login Task - Logs into the application
 */
export class Login implements Task {
  private constructor(private username: string, private password: string) {}

  static withCredentials(username: string, password: string): Login {
    return new Login(username, password);
  }

  static asStandardUser(): Login {
    return new Login(
      process.env.USERNAME || 'standard_user',
      process.env.PASSWORD || 'secret_sauce'
    );
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.getPage();
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login(this.username, this.password);
  }
}
