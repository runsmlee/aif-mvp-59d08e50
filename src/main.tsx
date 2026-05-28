import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Extend Window to declare the diagnostic hooks added by index.html inline script
declare global {
  interface Window {
    __gfErrors: Array<{
      type: string;
      message: string;
      filename?: string;
      lineno?: number;
      colno?: number;
      stack?: string;
      time: number;
      [key: string]: unknown;
    }>;
  }
}

function mountApp(): void {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    // Critical: #root is missing from the HTML — render diagnostic directly to body
    document.body.innerHTML = [
      '<div style="padding:2rem;text-align:center;max-width:40rem;margin:0 auto;">',
      '<h2 style="font-size:1.25rem;font-weight:700;color:#B91C1C;">Root Element Missing</h2>',
      '<p style="color:#4B5563;font-size:0.875rem;">The HTML is missing the &lt;div id="root"&gt; element. This is a build error — the app cannot mount.</p>',
      '<p style="margin-top:0.5rem;font-size:0.6875rem;color:#9CA3AF;">readyState: ' + document.readyState + '</p>',
      '</div>',
    ].join('');
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );

    // NOTE: window.__gfMounted is NOT set here.  In React 19, root.render()
    // only *schedules* a render — it does not execute synchronously.  Setting
    // the flag here would cause the hydration timeout fallback in index.html
    // to never fire, even when React's scheduled render fails silently.
    // Instead, __gfMounted is set in App's useEffect, which only runs after
    // React has actually completed the first render.
  } catch (error) {
    console.error('GateFirst: Failed to mount React app', error);

    // Surface the error directly into the DOM so it is visible to users
    const errorMsg = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error && error.stack ? error.stack : '';
    const safeMsg = errorMsg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const safeStack = errorStack.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    rootElement.innerHTML = [
      '<div style="padding:2rem;text-align:center;max-width:40rem;margin:0 auto;">',
      '<div style="width:48px;height:48px;margin:0 auto 1rem;background:#FEE2E2;border-radius:12px;display:flex;align-items:center;justify-content:center;">',
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#B91C1C" stroke-width="2"/><path d="M12 8v4m0 4h.01" stroke="#B91C1C" stroke-width="2" stroke-linecap="round"/></svg>',
      '</div>',
      '<h2 style="font-size:1.25rem;font-weight:700;color:#B91C1C;margin-bottom:0.5rem;">Mount Error</h2>',
      '<p style="color:#4B5563;font-size:0.875rem;margin-bottom:1rem;">React failed to mount the application. The error details are shown below.</p>',
      '<div style="text-align:left;background:#FEF2F2;border:1px solid #FECACA;border-radius:0.5rem;padding:1rem;">',
      '<p style="font-weight:600;color:#991B1B;margin:0 0 0.5rem;font-size:0.8125rem;">Error:</p>',
      '<pre style="font-size:0.6875rem;color:#7F1D1D;white-space:pre-wrap;word-break:break-all;margin:0;">' + safeMsg + '</pre>',
      (safeStack ? '<pre style="font-size:0.625rem;color:#991B1B;white-space:pre-wrap;word-break:break-all;margin:0.5rem 0 0;background:rgba(255,255,255,0.5);padding:0.5rem;border-radius:0.25rem;overflow:auto;max-height:12rem;">' + safeStack + '</pre>' : ''),
      '</div>',
      '<button onclick="window.location.reload()" style="margin-top:1rem;padding:0.5rem 1.5rem;background:#B91C1C;color:white;border:none;border-radius:0.5rem;font-size:0.875rem;font-weight:600;cursor:pointer;min-height:44px;min-width:88px;">Refresh Page</button>',
      '</div>',
    ].join('');
  }
}

// Module scripts are deferred by spec so the DOM is already parsed when they
// execute.  Nevertheless, guard against edge cases where the root element is
// not yet in the document tree by checking readyState.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
