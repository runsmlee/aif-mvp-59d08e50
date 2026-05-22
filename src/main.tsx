import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

function mountApp(): void {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('GateFirst: Root element not found');
    return;
  }

  try {
    createRoot(rootElement).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
  } catch (error) {
    console.error('GateFirst: Failed to mount React app', error);
    const fallback = rootElement.querySelector('#root-fallback');
    if (fallback) {
      const errorEl = document.createElement('p');
      errorEl.textContent = 'Something went wrong. Please refresh the page.';
      errorEl.style.cssText = 'color:#B91C1C;margin-top:1rem;font-size:0.875rem;';
      fallback.appendChild(errorEl);
    }
  }
}

// Use DOMContentLoaded as a safety net to guarantee the DOM is fully
// parsed before attempting to mount React. Module scripts are deferred
// by spec, but explicit DOMContentLoaded eliminates any edge-case where
// the root element might not yet be in the document tree.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  // DOM already parsed (e.g. script loaded after DOMContentLoaded)
  mountApp();
}
