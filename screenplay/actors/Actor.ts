import { Page, APIRequestContext } from '@playwright/test';

/**
 * Interface for abilities that actors can have
 * Abilities represent the tools actors use to interact with the system
 */
export interface Ability {
  name: string;
}

/**
 * Interface for tasks that actors can perform
 */
export interface Task {
  performAs(actor: Actor): Promise<void>;
}

/**
 * Interface for questions that actors can answer
 */
export interface Question<T> {
  answeredBy(actor: Actor): Promise<T>;
}

/**
 * Base Actor class implementing the Screenplay Pattern
 * Actors represent users who interact with the application
 */
export class Actor {
  private abilities: Map<string, Ability> = new Map();
  private memory: Map<string, any> = new Map();

  constructor(
    public readonly name: string,
    private page?: Page,
    private apiContext?: APIRequestContext
  ) {}

  /**
   * Give the actor an ability
   */
  whoCan(...abilities: Ability[]): this {
    abilities.forEach(ability => {
      this.abilities.set(ability.name, ability);
    });
    return this;
  }

  /**
   * Get an ability by name
   */
  withAbilityTo<T extends Ability>(abilityType: new (...args: any[]) => T): T {
    const ability = Array.from(this.abilities.values())
      .find(a => a instanceof abilityType);

    if (!ability) {
      throw new Error(`Actor ${this.name} does not have the ability ${abilityType.name}`);
    }

    return ability as T;
  }

  /**
   * Actor attempts to perform a task
   */
  async attemptsTo(...tasks: Task[]): Promise<void> {
    for (const task of tasks) {
      await task.performAs(this);
    }
  }

  /**
   * Actor asks a question
   */
  async asks<T>(question: Question<T>): Promise<T> {
    return await question.answeredBy(this);
  }

  /**
   * Remember a value for later use
   */
  remember(key: string, value: any): void {
    this.memory.set(key, value);
  }

  /**
   * Recall a previously remembered value
   */
  recall<T>(key: string): T {
    const value = this.memory.get(key);
    if (value === undefined) {
      throw new Error(`Actor ${this.name} cannot recall ${key} - it was never remembered`);
    }
    return value as T;
  }

  /**
   * Check if a value has been remembered
   */
  hasRemembered(key: string): boolean {
    return this.memory.has(key);
  }

  /**
   * Get the Playwright Page (for UI interactions)
   */
  getPage(): Page {
    if (!this.page) {
      throw new Error(`Actor ${this.name} does not have a Page context`);
    }
    return this.page;
  }

  /**
   * Set the Playwright Page
   */
  setPage(page: Page): void {
    this.page = page;
  }

  /**
   * Get the API request context (for API interactions)
   */
  getApiContext(): APIRequestContext {
    if (!this.apiContext) {
      throw new Error(`Actor ${this.name} does not have an API context`);
    }
    return this.apiContext;
  }

  /**
   * Set the API request context
   */
  setApiContext(context: APIRequestContext): void {
    this.apiContext = context;
  }

  /**
   * Check if actor has UI capabilities
   */
  hasUICapabilities(): boolean {
    return this.page !== undefined;
  }

  /**
   * Check if actor has API capabilities
   */
  hasAPICapabilities(): boolean {
    return this.apiContext !== undefined;
  }
}
