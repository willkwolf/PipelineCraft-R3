import { Actor, Question } from '../actors/Actor';

/**
 * PageElement Question - Retrieves information about page elements
 */
export class PageElement {
  static text(selector: string): Question<string> {
    return {
      async answeredBy(actor: Actor): Promise<string> {
        const page = actor.getPage();
        return (await page.textContent(selector)) || '';
      }
    };
  }

  static isVisible(selector: string): Question<boolean> {
    return {
      async answeredBy(actor: Actor): Promise<boolean> {
        const page = actor.getPage();
        return await page.isVisible(selector);
      }
    };
  }

  static count(selector: string): Question<number> {
    return {
      async answeredBy(actor: Actor): Promise<number> {
        const page = actor.getPage();
        return await page.locator(selector).count();
      }
    };
  }

  static attribute(selector: string, attributeName: string): Question<string | null> {
    return {
      async answeredBy(actor: Actor): Promise<string | null> {
        const page = actor.getPage();
        return await page.getAttribute(selector, attributeName);
      }
    };
  }
}
