import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { App } from '../src/App';

describe('App', () => {
  it('renders the dual-panel layout with Diagnostic on the left and Prophylactic on the right', () => {
    render(<App />);
    const diagnostics = screen.getAllByText(/diagnostic/i);
    const prophylactics = screen.getAllByText(/prophylactic/i);
    expect(diagnostics.length).toBeGreaterThanOrEqual(1);
    expect(prophylactics.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the shared prompt input for custom exploration', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/enter a prompt/i)).toBeInTheDocument();
  });

  it('pre-populates panels with a default example on load', () => {
    render(<App />);
    // The default prompt text should be visible in the panels (shown in both)
    const defaultPromptTexts = screen.getAllByText(/\/etc\/shadow/);
    expect(defaultPromptTexts.length).toBeGreaterThanOrEqual(1);
    // No "Awaiting prompt" state — panels start populated
    expect(screen.queryAllByText(/awaiting prompt/i)).toHaveLength(0);
  });

  it('submitting a prompt updates both panels with the new prompt', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/enter a prompt/i);

    fireEvent.change(input, { target: { value: 'Hello world' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for the diagnostic setTimeout (300ms) to complete
    await waitFor(() => {
      const helloTexts = screen.getAllByText(/hello world/i);
      expect(helloTexts.length).toBeGreaterThanOrEqual(1);
    }, { timeout: 5000 });
  });

  it('summary statistics counters are visible and update after submission', async () => {
    render(<App />);
    expect(screen.getByText(/^Submitted$/)).toBeInTheDocument();

    // Stats start at 1 from the default example — verify initial value
    const statsSection = screen.getByText(/^Submitted$/).parentElement;
    expect(statsSection?.querySelector('p')?.textContent).toBe('1');

    const input = screen.getByPlaceholderText(/enter a prompt/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // After submitting, the submitted count should be 2 (default + new)
    await waitFor(() => {
      const updatedSection = screen.getByText(/^Submitted$/).parentElement;
      expect(updatedSection?.querySelector('p')?.textContent).toBe('2');
    }, { timeout: 5000 });
  });
});
