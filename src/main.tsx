import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    // If React fails to mount, ensure fallback content remains visible
    console.error('GateFirst: Failed to mount React app', error);
    const fallback = rootElement.querySelector('#root-fallback');
    if (fallback) {
      const errorEl = document.createElement('p');
      errorEl.textContent = 'Something went wrong. Please refresh the page.';
      errorEl.style.cssText = 'color:#B91C1C;margin-top:1rem;font-size:0.875rem;';
      fallback.appendChild(errorEl);
    }
  }
} else {
  console.error('GateFirst: Root element not found');
}
