import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SamplePrompts } from '../src/components/SamplePrompts';

describe('SamplePrompts', () => {
  it('renders a list of at least 8 sample prompts', () => {
    render(<SamplePrompts onSelect={() => {}} />);
    const items = screen.getAllByRole('button');
    expect(items.length).toBeGreaterThanOrEqual(8);
  });

  it('each sample prompt is clickable', () => {
    render(<SamplePrompts onSelect={() => {}} />);
    const items = screen.getAllByRole('button');
    for (const item of items) {
      expect(item).toBeEnabled();
    }
  });

  it('clicking a sample prompt calls the onSelect handler with the prompt text', () => {
    const onSelect = vi.fn();
    render(<SamplePrompts onSelect={onSelect} />);
    const items = screen.getAllByRole('button');
    fireEvent.click(items[0]);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(typeof onSelect.mock.calls[0][0]).toBe('string');
  });

  it('sample prompts are categorized or labeled by type', () => {
    render(<SamplePrompts onSelect={() => {}} />);
    // Check that at least one category label exists
    const hasCategoryLabel =
      screen.queryByText(/benign/i) !== null ||
      screen.queryByText(/borderline/i) !== null ||
      screen.queryByText(/violating/i) !== null ||
      screen.queryByText(/critical/i) !== null ||
      screen.queryByText(/high/i) !== null ||
      screen.queryByText(/medium/i) !== null ||
      screen.queryByText(/low/i) !== null;
    expect(hasCategoryLabel).toBe(true);
  });
});
