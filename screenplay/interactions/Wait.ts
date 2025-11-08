import { Actor, Task } from '../actors/Actor';

/**
 * Wait Interaction - Waits for elements or conditions
 */
export class Wait implements Task {
  private constructor(
    private selector?: string,
    private state?: 'visible' | 'hidden' | 'attached' | 'detached',
    private timeout?: number
  ) {}

  /**
   * Wait for an element to be visible
   */
  static forElement(selector: string): WaitBuilder {
    return new WaitBuilder(selector);
  }

  /**
   * Wait for a specific duration
   */
  static forTimeout(milliseconds: number): Wait {
    return new Wait(undefined, undefined, milliseconds);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.getPage();

    if (this.selector && this.state) {
      await page.waitForSelector(this.selector, {
        state: this.state,
        timeout: this.timeout,
      });
    } else if (this.timeout) {
      await page.waitForTimeout(this.timeout);
    }
  }
}

/**
 * Builder for Wait interaction
 */
class WaitBuilder {
  constructor(private selector: string) {}

  toBeVisible(timeout?: number): Wait {
    return new Wait(this.selector, 'visible', timeout);
  }

  toBeHidden(timeout?: number): Wait {
    return new Wait(this.selector, 'hidden', timeout);
  }

  toBeAttached(timeout?: number): Wait {
    return new Wait(this.selector, 'attached', timeout);
  }

  toBeDetached(timeout?: number): Wait {
    return new Wait(this.selector, 'detached', timeout);
  }
}
