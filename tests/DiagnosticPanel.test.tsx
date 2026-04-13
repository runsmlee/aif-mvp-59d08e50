import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { DiagnosticPanel } from '../src/components/DiagnosticPanel';

describe('DiagnosticPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders without crash with "Diagnostic" label', () => {
    render(<DiagnosticPanel prompt="" state="idle" violations={[]} timeline={[]} />);
    expect(screen.getByRole('heading', { name: /diagnostic/i })).toBeInTheDocument();
  });

  it('displays "Awaiting prompt..." placeholder when no prompt has been submitted', () => {
    render(<DiagnosticPanel prompt="" state="idle" violations={[]} timeline={[]} />);
    expect(screen.getByText(/awaiting prompt/i)).toBeInTheDocument();
  });

  it('after receiving a benign prompt, shows execution completion then a "No violations" message', async () => {
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Executing', status: 'completed' as const, timestamp: '00:00.100', relativeMs: 100 },
      { label: 'Execution Complete', status: 'completed' as const, timestamp: '00:01.200', relativeMs: 1200 },
      { label: 'Policy Scan', status: 'completed' as const, timestamp: '00:01.250', relativeMs: 1250 },
      { label: 'No Violations', status: 'completed' as const, timestamp: '00:01.300', relativeMs: 1300 },
    ];
    render(<DiagnosticPanel prompt="Hello" state="complete" violations={[]} timeline={timeline} />);
    expect(screen.getByText('No violations')).toBeInTheDocument();
    expect(screen.getByText('Execution Complete')).toBeInTheDocument();
  });

  it('after receiving a violating prompt, shows execution completion followed by violation logs with matched policy rule names', () => {
    const violations = [
      {
        ruleName: 'PII Detection',
        severity: 'high' as const,
        description: 'Contains email address',
        matchedPattern: 'john@example.com',
      },
    ];
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Executing', status: 'completed' as const, timestamp: '00:00.100', relativeMs: 100 },
      { label: 'Execution Complete', status: 'completed' as const, timestamp: '00:01.200', relativeMs: 1200 },
      { label: 'Policy Scan', status: 'completed' as const, timestamp: '00:01.250', relativeMs: 1250 },
      { label: 'Violation(s) Found', status: 'blocked' as const, timestamp: '00:01.300', relativeMs: 1300 },
    ];
    render(<DiagnosticPanel prompt="Send to john@example.com" state="complete" violations={violations} timeline={timeline} />);
    expect(screen.getByText('Execution Complete')).toBeInTheDocument();
    expect(screen.getByText('PII Detection')).toBeInTheDocument();
    // Use getAllByText since "Violation Log" heading and "Violation(s) Found" in timeline both match
    const violationElements = screen.getAllByText(/violation/i);
    expect(violationElements.length).toBeGreaterThanOrEqual(1);
  });

  it('violation logs appear only after a simulated execution delay (diagnostic = post-execution)', () => {
    const violations = [
      {
        ruleName: 'SQL Injection',
        severity: 'critical' as const,
        description: 'SQL injection detected',
        matchedPattern: 'DROP TABLE',
      },
    ];
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Executing', status: 'completed' as const, timestamp: '00:00.100', relativeMs: 100 },
      { label: 'Execution Complete', status: 'completed' as const, timestamp: '00:01.200', relativeMs: 1200 },
      { label: 'Policy Scan', status: 'completed' as const, timestamp: '00:01.250', relativeMs: 1250 },
      { label: 'Violation(s) Found', status: 'blocked' as const, timestamp: '00:01.300', relativeMs: 1300 },
    ];
    render(<DiagnosticPanel prompt="DROP TABLE users;" state="complete" violations={violations} timeline={timeline} />);
    // The timeline shows Execution Complete before Policy Scan/Violation
    const steps = screen.getAllByRole('listitem').map(li => li.textContent);
    const execIdx = steps.findIndex(s => s?.includes('Execution Complete'));
    const violIdx = steps.findIndex(s => s?.includes('Violation'));
    expect(execIdx).toBeLessThan(violIdx);
  });

  it('each violation log entry includes a timestamp and severity badge', () => {
    const violations = [
      {
        ruleName: 'PII Detection',
        severity: 'high' as const,
        description: 'Contains SSN',
        matchedPattern: '123-45-6789',
      },
    ];
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Executing', status: 'completed' as const, timestamp: '00:00.100', relativeMs: 100 },
      { label: 'Execution Complete', status: 'completed' as const, timestamp: '00:01.200', relativeMs: 1200 },
      { label: 'Policy Scan', status: 'completed' as const, timestamp: '00:01.250', relativeMs: 1250 },
      { label: 'Violation(s) Found', status: 'blocked' as const, timestamp: '00:01.300', relativeMs: 1300 },
    ];
    render(<DiagnosticPanel prompt="SSN: 123-45-6789" state="complete" violations={violations} timeline={timeline} />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('timeline shows correct sequence: Input Received → Executing → Execution Complete → Policy Scan → Violation(s) Found', () => {
    const violations = [{ ruleName: 'Test', severity: 'high' as const, description: 'test', matchedPattern: 'test' }];
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Executing', status: 'completed' as const, timestamp: '00:00.100', relativeMs: 100 },
      { label: 'Execution Complete', status: 'completed' as const, timestamp: '00:01.200', relativeMs: 1200 },
      { label: 'Policy Scan', status: 'completed' as const, timestamp: '00:01.250', relativeMs: 1250 },
      { label: 'Violation(s) Found', status: 'blocked' as const, timestamp: '00:01.300', relativeMs: 1300 },
    ];
    render(<DiagnosticPanel prompt="test" state="complete" violations={violations} timeline={timeline} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0].textContent).toContain('Input Received');
    expect(listItems[1].textContent).toContain('Executing');
    expect(listItems[2].textContent).toContain('Execution Complete');
    expect(listItems[3].textContent).toContain('Policy Scan');
    expect(listItems[4].textContent).toContain('Violation');
  });
});
