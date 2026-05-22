/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Strip `crossorigin` attributes from <script> and <link> tags in the built
 * HTML.  Vite adds `crossorigin` by default, which causes the browser to
 * enforce CORS checks on every asset.  If any proxy or CDN in the path
 * strips or misconfigures CORS headers, the browser silently refuses to
 * execute the JS — the page stays on the static fallback spinner forever.
 * Removing the attribute lets assets load with standard same-origin policy.
 */
function removeCrossorigin(): Plugin {
  return {
    name: 'remove-crossorigin',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'asset' && typeof chunk.source === 'string' && name.endsWith('.html')) {
          chunk.source = chunk.source
            .replace(/ crossorigin/g, '')
            .replace(/ crossorigin="[^"]*"/g, '');
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), removeCrossorigin()],
  build: {
    target: 'es2020',
    sourcemap: false,
    modulePreload: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
    deps: {
      inline: ['react', 'react-dom', '@testing-library/react', '@testing-library/jest-dom'],
    },
  },
});
