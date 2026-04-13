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

  it('renders the shared prompt input above the panels', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/enter a prompt/i)).toBeInTheDocument();
  });

  it('submitting a prompt updates both panels simultaneously', async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/enter a prompt/i);

    fireEvent.change(input, { target: { value: 'Hello world' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for the diagnostic setTimeout (300ms) to complete
    await waitFor(() => {
      const awaiting = screen.queryAllByText(/awaiting prompt/i);
      expect(awaiting).toHaveLength(0);
    }, { timeout: 5000 });
  });

  it('summary statistics counters are visible and update after submission', async () => {
    render(<App />);
    expect(screen.getByText(/^Submitted$/)).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/enter a prompt/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      const statsSection = screen.getByText(/^Submitted$/).parentElement;
      expect(statsSection?.querySelector('p')?.textContent).toBe('1');
    }, { timeout: 5000 });
  });
});
