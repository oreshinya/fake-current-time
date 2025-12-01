import { COOKIE_NAME, encodeOffset, parseOffsetFromCookie } from "./cookie";
import { setupDateProxy, type TimeOffset } from "./core";

let initialized = false;

export function setup(): void {
  if (initialized) {
    return;
  }

  setupDateProxy(getOffset);

  initialized = true;
}

export function setOffset(offset: TimeOffset): void {
  document.cookie = `${COOKIE_NAME}=${encodeOffset(offset)}; path=/`;
  location.reload();
}

export function clearOffset(): void {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  location.reload();
}

function getOffset(): TimeOffset | undefined {
  return parseOffsetFromCookie(document.cookie);
}
