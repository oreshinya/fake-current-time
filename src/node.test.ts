import {
  afterAll,
  assert,
  test as baseTest,
  beforeAll,
  describe,
  vi,
} from "vitest";
import type { FakeTimeRunner } from "./node";
import { setup } from "./node";

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
});

afterAll(() => {
  vi.useRealTimers();
});

describe("setup", () => {
  baseTest("should return a FakeTimeRunner", () => {
    const runner = setup();

    assert.property(runner, "run");
    assert.isFunction(runner.run);
  });

  baseTest("should return the same instance on multiple calls", () => {
    const runner1 = setup();
    const runner2 = setup();

    assert.strictEqual(runner1, runner2);
  });
});

describe("FakeTimeRunner", () => {
  const test = baseTest.extend<{
    runner: FakeTimeRunner;
  }>({
    runner: async ({}, use) => {
      await use(setup());
    },
  });

  test("should isolate offset between different runs", ({ runner }) => {
    let time1: number = 0;
    let time2: number = 0;

    runner.run({ days: 1 }, () => {
      time1 = Date.now();
    });

    runner.run({ days: 2 }, () => {
      time2 = Date.now();
    });

    assert.strictEqual(time1, new Date("2024-01-02T00:00:00Z").getTime());
    assert.strictEqual(time2, new Date("2024-01-03T00:00:00Z").getTime());
  });

  test("should not affect time outside of run context", ({ runner }) => {
    const before = Date.now();

    runner.run({ days: 1 }, () => {
      new Date();
    });

    const after = Date.now();

    assert.strictEqual(before, new Date("2024-01-01T00:00:00Z").getTime());
    assert.strictEqual(after, new Date("2024-01-01T00:00:00Z").getTime());
  });

  test("should return callback result", ({ runner }) => {
    const result = runner.run({ days: 1 }, () => {
      return "test result";
    });

    assert.strictEqual(result, "test result");
  });
});
