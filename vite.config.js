import {defineConfig, loadEnv} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    hydrogen(),
    oxygen(),
    !process.env.VITEST &&
      remix({
        presets: [hydrogen.preset()],
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
    tsconfigPaths(),
    process.env.VITEST && react(),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  test: {
    // See the list of config options in the Config Reference:
    // https://vitest.dev/config/
    environment: 'jsdom',
    globals: true,
    includeSource: ['app/**/*.{test.js,test.jsx}'],
    exclude: ['node_modules', 'e2e'],
    // Additionally, this is to load ".env.test" during vitest
    env: loadEnv('test', process.cwd(), ''),
  },
});
