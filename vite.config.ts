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

/**
 * Strip any residual React Fast Refresh development symbols from the
 * production bundle.  In normal operation @vitejs/plugin-react does not
 * emit these during `vite build`, but under certain dependency resolution
 * edge cases (e.g. Vercel's npm cache, monorepo hoisting) the
 * `react-refresh` Babel transform can leak into the production pipeline.
 * The resulting `$RefreshSig$ is not defined` ReferenceError crashes the
 * entire React tree — panels silently fail to mount.
 *
 * This plugin runs as a post-step on every JS chunk and regex-removes:
 *   - $RefreshReg$ / $RefreshSig$ calls
 *   - import.meta.hot references
 *   - react-refresh preamble imports
 */
function stripDevSymbols(): Plugin {
  const patterns: Array<[RegExp, string]> = [
    [/\$RefreshReg\$\([^)]*\)/g, ''],
    [/\$RefreshSig\$\(\)/g, ''],
    [/import\.meta\.hot\b/g, 'undefined'],
    [/from\s*["']react-refresh["']/g, '/* react-refresh stripped */'],
  ];

  return {
    name: 'strip-dev-symbols',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && name.endsWith('.js')) {
          let code = chunk.code;
          for (const [pattern, replacement] of patterns) {
            code = code.replace(pattern, replacement);
          }
          chunk.code = code;
        }
      }
    },
  };
}

export default defineConfig(({ command }) => ({
  plugins: [
    react({
      // Fast Refresh is dev-only.  In production builds this prevents
      // the Babel transform from injecting $RefreshSig$/$RefreshReg$ calls.
      include: /\.(tsx|ts|jsx|js)$/,
      babel: {
        // When NODE_ENV is production, react-refresh plugins are never
        // added by @vitejs/plugin-react.  This is a belt-and-suspenders
        // guard for environments where NODE_ENV may be incorrect.
        plugins: [],
      },
    }),
    tailwindcss(),
    removeCrossorigin(),
    // Only strip dev symbols in build mode — never in serve mode.
    ...(command === 'build' ? [stripDevSymbols()] : []),
  ],
  define: {
    // Explicitly pin NODE_ENV for production builds.  Some deployment
    // platforms don't set this correctly, causing Vite to think it's
    // in development mode and inject Fast Refresh runtime code.
    'process.env.NODE_ENV': JSON.stringify(
      command === 'build' ? 'production' : 'development',
    ),
  },
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
}));
