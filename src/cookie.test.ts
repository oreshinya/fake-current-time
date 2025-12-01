import { assert, describe, test } from "vitest";
import { COOKIE_NAME, encodeOffset, parseOffsetFromCookie } from "./cookie";

describe("encodeOffset", () => {
  test("should encode offset as JSON string", () => {
    const offset = { days: 1, hours: 2 };
    const result = encodeOffset(offset);

    assert.strictEqual(result, '{"days":1,"hours":2}');
  });

  test("should handle empty offset", () => {
    const result = encodeOffset({});

    assert.strictEqual(result, "{}");
  });
});

describe("parseOffsetFromCookie", () => {
  test("should return undefined for undefined cookie string", () => {
    const result = parseOffsetFromCookie(undefined);

    assert.isUndefined(result);
  });

  test("should return undefined for empty cookie string", () => {
    const result = parseOffsetFromCookie("");

    assert.isUndefined(result);
  });

  test("should parse offset from cookie string", () => {
    const cookieString = `${COOKIE_NAME}={"days":1,"hours":2}`;
    const result = parseOffsetFromCookie(cookieString);

    assert.deepEqual(result, { days: 1, hours: 2 });
  });

  test("should parse offset from multiple cookies", () => {
    const cookieString = `other_cookie=value; ${COOKIE_NAME}={"days":5}; another=test`;
    const result = parseOffsetFromCookie(cookieString);

    assert.deepEqual(result, { days: 5 });
  });

  test("should handle cookies with whitespace", () => {
    const cookieString = `  other=value  ;  ${COOKIE_NAME}={"hours":3}  `;
    const result = parseOffsetFromCookie(cookieString);

    assert.deepEqual(result, { hours: 3 });
  });

  test("should return undefined if target cookie not found", () => {
    const cookieString = "other_cookie=value; another=test";
    const result = parseOffsetFromCookie(cookieString);

    assert.isUndefined(result);
  });

  test("should return undefined if cookie value is empty", () => {
    const cookieString = `${COOKIE_NAME}=`;
    const result = parseOffsetFromCookie(cookieString);

    assert.isUndefined(result);
  });
});
