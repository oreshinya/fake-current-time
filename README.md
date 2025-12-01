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
