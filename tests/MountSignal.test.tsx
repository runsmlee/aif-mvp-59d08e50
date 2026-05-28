import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { App } from '../src/App';

declare global {
  interface Window {
    __gfMounted: boolean;
  }
}

describe('Mount signal (hydration guard)', () => {
  it('sets window.__gfMounted to true after App renders', () => {
    // Reset the mount signal before test
    window.__gfMounted = false;

    render(<App />);

    // After React renders, the mount signal should be set
    // This verifies that the signal is only set AFTER successful render,
    // not synchronously during createRoot().render() which only schedules
    expect(window.__gfMounted).toBe(true);
  });

  it('renders actual interactive content (not just loading state)', () => {
    render(<App />);

    // The app must render actual interactive elements, not remain on
    // the static "loading…" fallback from index.html
    const input = screen.getByPlaceholderText(/enter a prompt/i);
    expect(input).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).toBeInTheDocument();

    // Both panels should render
    const diagnostics = screen.getAllByText(/diagnostic/i);
    const prophylactics = screen.getAllByText(/prophylactic/i);
    expect(diagnostics.length).toBeGreaterThanOrEqual(1);
    expect(prophylactics.length).toBeGreaterThanOrEqual(1);
  });

  it('renders sample prompts as interactive elements', () => {
    render(<App />);

    // Sample prompts should be clickable buttons
    const sampleButtons = screen.getAllByRole('button').filter(
      (btn) => btn.getAttribute('aria-label')?.includes('Sample prompt')
    );
    expect(sampleButtons.length).toBeGreaterThanOrEqual(8);
  });

  it('renders h1 with product name in the header', () => {
    render(<App />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toContain('GateFirst');
  });

  it('renders summary statistics with initial zero counts', () => {
    render(<App />);

    expect(screen.getByText(/^Submitted$/)).toBeInTheDocument();
    // The initial count should be 0
    const statsSection = screen.getByText(/^Submitted$/).parentElement;
    expect(statsSection?.querySelector('p')?.textContent).toBe('0');
  });
});
