import { Actor, Task } from '../actors/Actor';

/**
 * Click Interaction - Clicks on an element
 */
export class Click implements Task {
  private constructor(private selector: string) {}

  /**
   * Click on an element specified by selector
   */
  static on(selector: string): Click {
    return new Click(selector);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.getPage();
    await page.click(this.selector);
  }
}
