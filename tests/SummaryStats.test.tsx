import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryStats } from '../src/components/SummaryStats';

describe('SummaryStats', () => {
  it('renders initial counters at zero', () => {
    render(<SummaryStats stats={{ submitted: 0, violationsLogged: 0, blocked: 0, cleanExecutions: 0 }} />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(4);
  });

  it('displays "Submitted" counter', () => {
    render(<SummaryStats stats={{ submitted: 5, violationsLogged: 2, blocked: 1, cleanExecutions: 2 }} />);
    expect(screen.getByText(/^Submitted$/)).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('increments "Violations" counter for diagnostic violations', () => {
    render(<SummaryStats stats={{ submitted: 1, violationsLogged: 3, blocked: 0, cleanExecutions: 0 }} />);
    expect(screen.getByText(/^Violations$/)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('increments "Blocked" counter for prophylactic blocks', () => {
    render(<SummaryStats stats={{ submitted: 2, violationsLogged: 3, blocked: 1, cleanExecutions: 0 }} />);
    expect(screen.getByText(/^Blocked$/)).toBeInTheDocument();
    // Use the label to scope the value
    const blockedSection = screen.getByText(/^Blocked$/).parentElement;
    expect(blockedSection?.querySelector('p')?.textContent).toBe('1');
  });

  it('increments "Clean" counter for benign prompts that pass both panels', () => {
    render(<SummaryStats stats={{ submitted: 5, violationsLogged: 0, blocked: 0, cleanExecutions: 3 }} />);
    expect(screen.getByText(/^Clean$/)).toBeInTheDocument();
    const cleanSection = screen.getByText(/^Clean$/).parentElement;
    expect(cleanSection?.querySelector('p')?.textContent).toBe('3');
  });
});
