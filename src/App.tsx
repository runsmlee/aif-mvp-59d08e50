import { useState, useCallback } from 'react';
import type { PolicyViolation, TimelineStep, PanelState } from './types';
import { evaluatePrompt } from './engine/policyEngine';
import { PromptInput } from './components/PromptInput';
import { DiagnosticPanel } from './components/DiagnosticPanel';
import { ProphylacticPanel } from './components/ProphylacticPanel';
import { SamplePrompts } from './components/SamplePrompts';
import { SummaryStats } from './components/SummaryStats';
import type { Stats } from './components/SummaryStats';

function buildDiagnosticTimeline(violations: PolicyViolation[]): TimelineStep[] {
  const steps: TimelineStep[] = [
    { label: 'Input Received', status: 'completed', timestamp: '00:00.000', relativeMs: 0 },
    { label: 'Executing', status: 'completed', timestamp: '00:00.100', relativeMs: 100 },
    { label: 'Execution Complete', status: 'completed', timestamp: '00:01.200', relativeMs: 1200 },
    { label: 'Policy Scan', status: 'completed', timestamp: '00:01.250', relativeMs: 1250 },
  ];
  if (violations.length > 0) {
    steps.push({ label: 'Violation(s) Found', status: 'blocked', timestamp: '00:01.300', relativeMs: 1300 });
  } else {
    steps.push({ label: 'No Violations', status: 'completed', timestamp: '00:01.300', relativeMs: 1300 });
  }
  return steps;
}

function buildProphylacticTimeline(violations: PolicyViolation[]): TimelineStep[] {
  const steps: TimelineStep[] = [
    { label: 'Input Received', status: 'completed', timestamp: '00:00.000', relativeMs: 0 },
    { label: 'Policy Check', status: violations.length > 0 ? 'blocked' : 'completed', timestamp: '00:00.050', relativeMs: 50 },
  ];
  if (violations.length > 0) {
    steps.push({ label: 'Blocked', status: 'blocked', timestamp: '00:00.055', relativeMs: 55 });
  } else {
    steps.push({ label: 'Executing', status: 'completed', timestamp: '00:00.100', relativeMs: 100 });
    steps.push({ label: 'Complete', status: 'completed', timestamp: '00:01.200', relativeMs: 1200 });
  }
  return steps;
}

export function App() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [diagnosticState, setDiagnosticState] = useState<PanelState>({
    status: 'idle',
    prompt: '',
    violations: [],
    timeline: [],
    blocked: false,
  });
  const [prophylacticState, setProphylacticState] = useState<PanelState>({
    status: 'idle',
    prompt: '',
    violations: [],
    timeline: [],
    blocked: false,
  });
  const [stats, setStats] = useState<Stats>({
    submitted: 0,
    violationsLogged: 0,
    blocked: 0,
    cleanExecutions: 0,
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = useCallback((prompt: string) => {
    setCurrentPrompt(prompt);
    setHasSubmitted(true);
    setDiagnosticState({ status: 'running', prompt, violations: [], timeline: [], blocked: false });
    setProphylacticState({ status: 'running', prompt, violations: [], timeline: [], blocked: false });

    const violations = evaluatePrompt(prompt);

    // Prophylactic resolves first (pre-execution)
    setProphylacticState({
      status: 'complete',
      prompt,
      violations,
      timeline: buildProphylacticTimeline(violations),
      blocked: violations.length > 0,
    });

    // Diagnostic resolves after simulated execution delay (post-execution)
    setTimeout(() => {
      setDiagnosticState({
        status: 'complete',
        prompt,
        violations,
        timeline: buildDiagnosticTimeline(violations),
        blocked: false,
      });

      // Update stats
      setStats((prev) => ({
        submitted: prev.submitted + 1,
        violationsLogged: prev.violationsLogged + violations.length,
        blocked: prev.blocked + (violations.length > 0 ? 1 : 0),
        cleanExecutions: prev.cleanExecutions + (violations.length === 0 ? 1 : 0),
      }));
    }, 300);
  }, []);

  const handleSampleSelect = useCallback((prompt: string) => {
    handleSubmit(prompt);
  }, [handleSubmit]);

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="bg-surface border-b border-border-primary sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center shadow-sm" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14.928 5V11L8 15L1.072 11V5L8 1Z" fill="white" fillOpacity="0.9"/>
                  <path d="M8 5L5.072 6.5V9.5L8 11L10.928 9.5V6.5L8 5Z" fill="white"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary tracking-tight leading-none">
                  GateFirst
                </h1>
                <p className="text-xs text-text-muted mt-0.5 hidden sm:block">
                  Prophylactic governance visualizer
                </p>
              </div>
            </div>
            {hasSubmitted && (
              <div className="animate-fade-in text-xs text-text-muted hidden sm:flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" aria-hidden="true" />
                Live session
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Summary Stats */}
        <div className={hasSubmitted ? 'animate-slide-up' : ''}>
          <SummaryStats stats={stats} />
        </div>

        {/* Prompt Input Section */}
        <section
          className="bg-surface rounded-xl border border-border-primary p-5 sm:p-6 shadow-sm"
          aria-label="Prompt evaluation"
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              Evaluate a Prompt
            </h2>
          </div>
          <PromptInput onSubmit={handleSubmit} />

          {/* Sample Prompts - integrated below input */}
          <div className="mt-5 pt-5 border-t border-border-primary">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Sample Prompts
              </h3>
              <span className="text-xs text-text-muted">Click to try</span>
            </div>
            <SamplePrompts onSelect={handleSampleSelect} />
          </div>
        </section>

        {/* Dual Panel Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" role="region" aria-label="Comparison panels">
          <div className={hasSubmitted ? 'animate-slide-in-left' : ''}>
            <DiagnosticPanel
              prompt={diagnosticState.prompt}
              state={diagnosticState.status}
              violations={diagnosticState.violations}
              timeline={diagnosticState.timeline}
            />
          </div>
          <div className={hasSubmitted ? 'animate-slide-in-right' : ''}>
            <ProphylacticPanel
              prompt={prophylacticState.prompt}
              state={prophylacticState.status}
              violations={prophylacticState.violations}
              timeline={prophylacticState.timeline}
              blocked={prophylacticState.blocked}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-primary mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-text-muted text-center">
            GateFirst — Shifting governance left. See the difference between diagnostic logging and prophylactic blocking.
          </p>
        </div>
      </footer>
    </div>
  );
}
