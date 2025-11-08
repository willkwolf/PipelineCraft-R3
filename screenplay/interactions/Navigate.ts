import { Actor, Task } from '../actors/Actor';

/**
 * Navigate Interaction - Navigates to a URL
 */
export class Navigate implements Task {
  private constructor(private url: string) {}

  /**
   * Navigate to a specific URL
   */
  static to(url: string): Navigate {
    return new Navigate(url);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.getPage();
    await page.goto(this.url);
  }
}
