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

- **Server**: Parse offset from cookie and wrap request handling with `runner.run(offset, ...)`
- **Client**: Call `setup()` to initialize time manipulation
- **UI**: Use `setOffset()` and `clearOffset()` to control time via cookie

### Server Entry (Express with React Router)

```typescript
import express from "express";
import { createRequestHandler } from "@react-router/express";
import { setup, parseOffsetFromCookie } from "fake-current-time/node";

const app = express();

// Do NOT setup in production
const runner = process.env.STAGE !== "production" ? setup() : null;

app.all(
  "*",
  (req, _, next) => {
    const offset = runner
      ? parseOffsetFromCookie(req.headers.cookie || "")
      : undefined;

    return offset && runner ? runner.run(offset, next) : next();
  },
  createRequestHandler({
    // ...
  }),
);
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
import { FakeTimeController } from "fake-current-time/react";

// Restrict access to this page in production (e.g., via routing or middleware)
export function TimeControlPage() {
  return <FakeTimeController />;
}
```

![FakeTimeController UI](./ui.png)

### Accessing the Original Date

If you need to access the real `Date` while time manipulation is active, use `OriginalDate`:

```typescript
import { OriginalDate } from "fake-current-time";

const realNow = OriginalDate.now();
const realDate = new OriginalDate();
```
