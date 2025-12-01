import { afterAll, assert, beforeAll, describe, test, vi } from "vitest";
import { setupDateProxy, type TimeOffset } from "./core";

let offset: TimeOffset | undefined;

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
  setupDateProxy(() => offset);
});

afterAll(() => {
  vi.useRealTimers();
});

describe("setupDateProxy", () => {
  test("should not affect Date constructor with arguments", () => {
    offset = { days: 1 };

    const specific = new Date("2024-01-01T00:00:00Z");

    assert.strictEqual(
      specific.getTime(),
      new Date("2024-01-01T00:00:00Z").getTime(),
    );
  });

  test("should fake Date constructor with offset", () => {
    offset = { days: 1 };

    // biome-ignore lint/complexity/useDateNow: testing Date constructor specifically
    const fakeTime = new Date().getTime();
    const expected = new Date("2024-01-02T00:00:00Z").getTime();

    assert.strictEqual(fakeTime, expected);
  });

  test("should fake Date.now() with offset", () => {
    offset = { hours: 2 };

    const fakeTime = Date.now();
    const expected = new Date("2024-01-01T02:00:00Z").getTime();

    assert.strictEqual(fakeTime, expected);
  });

  test("should fake Date() string with offset", () => {
    offset = { days: 1 };

    const dateStr = Date();
    const expected = new Date("2024-01-02T00:00:00Z").toString();

    assert.strictEqual(dateStr, expected);
  });

  test("should not affect time when offset is undefined", () => {
    offset = undefined;

    const time = Date.now();
    const expected = new Date("2024-01-01T00:00:00Z").getTime();

    assert.strictEqual(time, expected);
  });

  test("should work with Date inheritance", () => {
    class CustomDate extends Date {}

    offset = { days: 1 };

    const custom = new CustomDate();
    assert.instanceOf(custom, CustomDate);
    assert.instanceOf(custom, Date);
  });

  test("should add years to current time", () => {
    offset = { years: 1 };

    const result = Date.now();
    const expected = new Date("2025-01-01T00:00:00Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should add months to current time", () => {
    offset = { months: 3 };

    const result = Date.now();
    const expected = new Date("2024-04-01T00:00:00Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should add days to current time", () => {
    offset = { days: 7 };

    const result = Date.now();
    const expected = new Date("2024-01-08T00:00:00Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should add hours to current time", () => {
    offset = { hours: 5 };

    const result = Date.now();
    const expected = new Date("2024-01-01T05:00:00Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should add minutes to current time", () => {
    offset = { minutes: 30 };

    const result = Date.now();
    const expected = new Date("2024-01-01T00:30:00Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should add seconds to current time", () => {
    offset = { seconds: 45 };

    const result = Date.now();
    const expected = new Date("2024-01-01T00:00:45Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should add milliseconds to current time", () => {
    offset = { milliseconds: 500 };

    const result = Date.now();
    const expected = new Date("2024-01-01T00:00:00.500Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should subtract time with negative values", () => {
    offset = { days: -1, hours: -2 };

    const result = Date.now();
    const expected = new Date("2023-12-30T22:00:00Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should handle multiple offsets together", () => {
    offset = {
      days: 1,
      hours: 2,
      minutes: 30,
    };

    const result = Date.now();
    const expected = new Date("2024-01-02T02:30:00Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should handle empty offset", () => {
    offset = {};

    const result = Date.now();
    const expected = new Date("2024-01-01T00:00:00Z").getTime();

    assert.strictEqual(result, expected);
  });

  test("should ignore zero values", () => {
    offset = {
      years: 0,
      months: 0,
      days: 1,
    };

    const result = Date.now();
    const expected = new Date("2024-01-02T00:00:00Z").getTime();

    assert.strictEqual(result, expected);
  });
});
