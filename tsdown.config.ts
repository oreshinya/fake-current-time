import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/node.ts',
    './src/browser.ts',
    './src/react.tsx',
  ],
  fixedExtension: false,
});
