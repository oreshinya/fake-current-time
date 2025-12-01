# fake-current-time

<a href="https://github.com/oreshinya/fake-current-time/actions/workflows/check.yml"><img src="https://img.shields.io/github/actions/workflow/status/oreshinya/fake-current-time/check.yml?branch=main&logo=github&style=flat-square" /></a>
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square" /></a>
<a href="https://npmjs.org/package/fake-current-time"><img src="https://img.shields.io/npm/v/fake-current-time.svg?style=flat-square" /></a>

Manipulate current time in your application for development and staging environments.

Uses `Proxy` and `AsyncLocalStorage` to isolate time contexts per request, allowing multiple users to test with different time offsets simultaneously.

## Installation

```bash
npm install fake-current-time
```

## Usage

This example shows integration with React Router framework mode. The key concept is:

- **Server**: Parse offset from cookie and wrap rendering with `runner.run(offset, ...)`
- **Client**: Call `setup()` to initialize time manipulation
- **UI**: Use `setOffset()` and `clearOffset()` to control time via cookie

### Server Entry (`entry.server.tsx`)

```typescript
import type { AppLoadContext, EntryContext } from "react-router";
import { setup, parseOffsetFromCookie } from "fake-current-time/node";

// Do NOT setup in production
const runner = process.env.STAGE !== "production" ? setup() : null;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  loadContext: AppLoadContext,
) {
  const offset = runner
    ? parseOffsetFromCookie(request.headers.get("Cookie") || "")
    : undefined;

  const render = () => {
    return new Promise((resolve, reject) => {
      // ...
      const { pipe, abort } = renderToPipeableStream(/* ... */, {
        // ...
      });
    });
  };

  return offset && runner ? runner.run(offset, render) : render();
}
```

### Client Entry (`entry.client.tsx`)

```typescript
import { startTransition } from "react";
import { setup } from "fake-current-time/browser";

// Do NOT setup in production
if (process.env.STAGE !== "production") {
  setup();
}

startTransition(() => {
  // ...
});
```

### UI Component

```typescript
import { setOffset, clearOffset } from "fake-current-time/browser";

// Restrict access to this page in production (e.g., via routing or middleware)
export function TimeControl() {
  return (
    <div>
      <p>Current: {new Date().toString()}</p>
      {/* setOffset saves to cookie and reloads the page */}
      <button onClick={() => setOffset({ days: 1 })}>+1 Day</button>
      <button onClick={() => setOffset({ days: -1 })}>-1 Day</button>
      <button onClick={() => setOffset({ months: 3, days: 7 })}>+3 Months +7 Days</button>
      {/* clearOffset removes cookie and reloads the page */}
      <button onClick={clearOffset}>Reset</button>
    </div>
  );
}
```

`setOffset` accepts: `years`, `months`, `days`, `hours`, `minutes`, `seconds`, `milliseconds`
