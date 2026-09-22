type EventHandler = (payload: Record<string, unknown>) => Promise<void> | void;

type EventMap = Record<string, EventHandler[]>;

export class EventBus {
  private handlers: EventMap = {};

  on(event: string, handler: EventHandler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  async emit(event: string, payload: Record<string, unknown> = {}) {
    const handlers = this.handlers[event] || [];
    await Promise.all(handlers.map(h => h(payload)));
  }

  off(event: string, handler: EventHandler) {
    const handlers = this.handlers[event] || [];
    this.handlers[event] = handlers.filter(h => h !== handler);
  }
}

export const eventBus = new EventBus();
