import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProphylacticPanel } from '../src/components/ProphylacticPanel';

describe('ProphylacticPanel', () => {
  it('renders without crash with "Prophylactic" label', () => {
    render(<ProphylacticPanel prompt="" state="idle" violations={[]} timeline={[]} blocked={false} />);
    expect(screen.getByRole('heading', { name: /prophylactic/i })).toBeInTheDocument();
  });

  it('displays "Awaiting prompt..." placeholder when no prompt has been submitted', () => {
    render(<ProphylacticPanel prompt="" state="idle" violations={[]} timeline={[]} blocked={false} />);
    expect(screen.getByText(/awaiting prompt/i)).toBeInTheDocument();
  });

  it('after receiving a benign prompt, shows policy check pass then execution proceeds', () => {
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Policy Check', status: 'completed' as const, timestamp: '00:00.050', relativeMs: 50 },
      { label: 'Executing', status: 'completed' as const, timestamp: '00:00.100', relativeMs: 100 },
      { label: 'Complete', status: 'completed' as const, timestamp: '00:01.200', relativeMs: 1200 },
    ];
    render(<ProphylacticPanel prompt="Hello" state="complete" violations={[]} timeline={timeline} blocked={false} />);
    expect(screen.getByText('Policy Check')).toBeInTheDocument();
    expect(screen.getByText('Executing')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
  });

  it('after receiving a violating prompt, shows policy check fail and blocks execution immediately', () => {
    const violations = [
      {
        ruleName: 'PII Detection',
        severity: 'high' as const,
        description: 'Contains email',
        matchedPattern: 'john@example.com',
      },
    ];
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Policy Check', status: 'blocked' as const, timestamp: '00:00.050', relativeMs: 50 },
      { label: 'Blocked', status: 'blocked' as const, timestamp: '00:00.055', relativeMs: 55 },
    ];
    render(<ProphylacticPanel prompt="Send to john@example.com" state="complete" violations={violations} timeline={timeline} blocked={true} />);
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('PII Detection')).toBeInTheDocument();
  });

  it('blocking message includes the matched policy rule name', () => {
    const violations = [
      {
        ruleName: 'SQL Injection Prevention',
        severity: 'critical' as const,
        description: 'SQL injection detected',
        matchedPattern: 'DROP TABLE',
      },
    ];
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Policy Check', status: 'blocked' as const, timestamp: '00:00.050', relativeMs: 50 },
      { label: 'Blocked', status: 'blocked' as const, timestamp: '00:00.055', relativeMs: 55 },
    ];
    render(<ProphylacticPanel prompt="DROP TABLE" state="complete" violations={violations} timeline={timeline} blocked={true} />);
    expect(screen.getByText('SQL Injection Prevention')).toBeInTheDocument();
  });

  it('timeline shows correct sequence: Input Received → Policy Check → Blocked', () => {
    const violations = [{ ruleName: 'Test', severity: 'high' as const, description: 'test', matchedPattern: 'test' }];
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Policy Check', status: 'blocked' as const, timestamp: '00:00.050', relativeMs: 50 },
      { label: 'Blocked', status: 'blocked' as const, timestamp: '00:00.055', relativeMs: 55 },
    ];
    render(<ProphylacticPanel prompt="test" state="complete" violations={violations} timeline={timeline} blocked={true} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0].textContent).toContain('Input Received');
    expect(listItems[1].textContent).toContain('Policy Check');
    expect(listItems[2].textContent).toContain('Blocked');
  });

  it('execution never begins when a violation is detected (no "Executing" step in blocked flow)', () => {
    const violations = [{ ruleName: 'Test', severity: 'high' as const, description: 'test', matchedPattern: 'test' }];
    const timeline = [
      { label: 'Input Received', status: 'completed' as const, timestamp: '00:00.000', relativeMs: 0 },
      { label: 'Policy Check', status: 'blocked' as const, timestamp: '00:00.050', relativeMs: 50 },
      { label: 'Blocked', status: 'blocked' as const, timestamp: '00:00.055', relativeMs: 55 },
    ];
    const { container } = render(<ProphylacticPanel prompt="test" state="complete" violations={violations} timeline={timeline} blocked={true} />);
    // No "Executing" step should be present
    const listItems = screen.getAllByRole('listitem');
    const labels = listItems.map(li => li.textContent);
    expect(labels.some(l => l?.includes('Executing'))).toBe(false);
  });
});
