import type { TimeOffset } from "./core";

export const COOKIE_NAME = "fake_current_time_offset";

export function parseOffsetFromCookie(
  cookieString: string | undefined,
): TimeOffset | undefined {
  if (!cookieString) {
    return undefined;
  }

  const cookies = cookieString.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === COOKIE_NAME && value) {
      return decodeOffset(value);
    }
  }
  return undefined;
}

export function encodeOffset(offset: TimeOffset): string {
  return JSON.stringify(offset);
}

function decodeOffset(value: string): TimeOffset {
  return JSON.parse(value) as TimeOffset;
}
