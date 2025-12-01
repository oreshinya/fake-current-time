import { AsyncLocalStorage } from "node:async_hooks";
import { setupDateProxy, type TimeOffset } from "./core";

export { parseOffsetFromCookie } from "./cookie";

export interface FakeTimeRunner {
  run<T>(offset: TimeOffset, callback: () => T): T;
}

let runner: FakeTimeRunner | null = null;

export function setup(): FakeTimeRunner {
  if (runner) {
    return runner;
  }

  const storage = new AsyncLocalStorage<TimeOffset>();

  setupDateProxy(() => storage.getStore());

  runner = {
    run(offset, callback) {
      return storage.run(offset, callback);
    },
  };

  return runner;
}
