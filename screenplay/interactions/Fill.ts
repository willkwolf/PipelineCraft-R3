import { Actor, Task } from '../actors/Actor';

/**
 * Fill Interaction - Fills a form field with a value
 */
export class Fill implements Task {
  private constructor(private selector: string, private value: string) {}

  /**
   * Fill a field with a value
   */
  static field(selector: string): FillBuilder {
    return new FillBuilder(selector);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.getPage();
    await page.fill(this.selector, this.value);
  }
}

/**
 * Builder for Fill interaction
 */
class FillBuilder {
  constructor(private selector: string) {}

  with(value: string): Fill {
    return new Fill(this.selector, value);
  }
}
