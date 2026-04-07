import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: [
      './src/index.ts',
      './src/node.ts',
      './src/browser.ts',
      './src/react.tsx',
    ],
    clean: true,
    format: ['esm'],
    minify: false,
    dts: {
      compilerOptions: {
        ignoreDeprecations: '6.0',
      },
    },
    outDir: './dist',
  },
]);
