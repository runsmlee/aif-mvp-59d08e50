import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExecutionTimeline } from '../src/components/ExecutionTimeline';
import type { TimelineStep } from '../src/types';

const baseSteps: TimelineStep[] = [
  { label: 'Input Received', status: 'completed', timestamp: '00:00.000', relativeMs: 0 },
  { label: 'Policy Check', status: 'completed', timestamp: '00:00.050', relativeMs: 50 },
  { label: 'Blocked', status: 'blocked', timestamp: '00:00.055', relativeMs: 55 },
];

const diagnosticSteps: TimelineStep[] = [
  { label: 'Input Received', status: 'completed', timestamp: '00:00.000', relativeMs: 0 },
  { label: 'Executing', status: 'completed', timestamp: '00:00.100', relativeMs: 100 },
  { label: 'Execution Complete', status: 'completed', timestamp: '00:01.200', relativeMs: 1200 },
  { label: 'Policy Scan', status: 'completed', timestamp: '00:01.250', relativeMs: 1250 },
  { label: 'Violation(s) Found', status: 'blocked', timestamp: '00:01.300', relativeMs: 1300 },
];

const prophylacticSteps: TimelineStep[] = [
  { label: 'Input Received', status: 'completed', timestamp: '00:00.000', relativeMs: 0 },
  { label: 'Policy Check', status: 'completed', timestamp: '00:00.050', relativeMs: 50 },
  { label: 'Blocked', status: 'blocked', timestamp: '00:00.055', relativeMs: 55 },
];

describe('ExecutionTimeline', () => {
  it('renders a list of timeline steps in order', () => {
    render(<ExecutionTimeline steps={baseSteps} />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
  });

  it('each step displays a label and relative timestamp', () => {
    render(<ExecutionTimeline steps={baseSteps} />);
    expect(screen.getByText('Input Received')).toBeInTheDocument();
    expect(screen.getByText('Policy Check')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
    expect(screen.getByText('+0ms')).toBeInTheDocument();
    expect(screen.getByText('+50ms')).toBeInTheDocument();
  });

  it('steps for diagnostic flow include post-execution policy scan', () => {
    render(<ExecutionTimeline steps={diagnosticSteps} />);
    expect(screen.getByText('Policy Scan')).toBeInTheDocument();
    expect(screen.getByText('Violation(s) Found')).toBeInTheDocument();
  });

  it('steps for prophylactic flow include pre-execution policy check', () => {
    render(<ExecutionTimeline steps={prophylacticSteps} />);
    expect(screen.getByText('Policy Check')).toBeInTheDocument();
    expect(screen.getByText('Blocked')).toBeInTheDocument();
  });

  it('blocked steps are visually differentiated (red styling)', () => {
    render(<ExecutionTimeline steps={baseSteps} />);
    const blockedItem = screen.getByText('Blocked').closest('li');
    expect(blockedItem).toBeTruthy();
    expect(blockedItem?.getAttribute('data-status')).toBe('blocked');
  });

  it('completed steps are visually differentiated (green styling)', () => {
    render(<ExecutionTimeline steps={baseSteps} />);
    const completedItem = screen.getByText('Input Received').closest('li');
    expect(completedItem).toBeTruthy();
    expect(completedItem?.getAttribute('data-status')).toBe('completed');
  });
});
