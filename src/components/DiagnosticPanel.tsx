import type { PolicyViolation, TimelineStep } from '../types';
import { ExecutionTimeline } from './ExecutionTimeline';

interface DiagnosticPanelProps {
  prompt: string;
  state: 'idle' | 'running' | 'complete';
  violations: PolicyViolation[];
  timeline: TimelineStep[];
}

const severityConfig: Record<string, { badge: string; dot: string; card: string }> = {
  critical: {
    badge: 'bg-red-100 text-red-800 border-red-200',
    dot: 'bg-red-500',
    card: 'border-red-200 bg-red-50',
  },
  high: {
    badge: 'bg-orange-100 text-orange-800 border-orange-200',
    dot: 'bg-orange-500',
    card: 'border-orange-200 bg-orange-50',
  },
  medium: {
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dot: 'bg-yellow-500',
    card: 'border-yellow-200 bg-yellow-50',
  },
  low: {
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    dot: 'bg-blue-500',
    card: 'border-blue-200 bg-blue-50',
  },
};

function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse-soft">
      <div className="skeleton h-16 w-full rounded-lg" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-8 w-full rounded" />
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-8 w-5/6 rounded" />
      </div>
    </div>
  );
}

export function DiagnosticPanel({ prompt, state, violations, timeline }: DiagnosticPanelProps) {
  const isIdle = state === 'idle' && !prompt;
  const isRunning = state === 'running';

  return (
    <section
      aria-label="Diagnostic logging panel"
      aria-live="polite"
      className="bg-surface rounded-xl border border-border-primary border-t-2 border-t-amber-500 shadow-sm overflow-hidden"
    >
      {/* Panel Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-amber-600">
                <path d="M6 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 2L10 4L14 0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 8H11M5 11H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="text-base font-bold text-text-primary">Diagnostic</h2>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
            Post-execution
          </span>
        </div>
        <p className="text-xs text-text-muted mt-1.5 ml-[38px]">
          Executes first, then scans for violations
        </p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-primary" />

      {/* Panel Body */}
      <div className="p-5">
        {isIdle && (
          <div className="flex flex-col items-center justify-center py-10 text-center" role="status">
            <div className="w-12 h-12 rounded-xl bg-surface-tertiary flex items-center justify-center mb-3" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-text-muted">
                <path d="M6 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 2L10 4L14 0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 8H11M5 11H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-sm text-text-muted font-medium">Awaiting prompt</p>
            <p className="text-xs text-text-muted mt-1">Executes first, then retroactively scans for violations</p>
            <p className="text-[11px] text-text-muted mt-2 opacity-70">Type a prompt above or click a sample below ↓</p>
          </div>
        )}

        {isRunning && (
          <div role="status" aria-label="Diagnostic panel is running">
            <SkeletonLoader />
            <span className="sr-only">Executing prompt and scanning for policy violations…</span>
          </div>
        )}

        {!isIdle && !isRunning && prompt && (
          <div className="space-y-5 animate-fade-in">
            {/* Prompt Display */}
            <div className="bg-surface-secondary rounded-lg p-3.5 border border-border-primary">
              <p className="text-[11px] text-text-muted mb-1.5 font-semibold uppercase tracking-wide">
                Prompt
              </p>
              <p className="text-sm text-text-secondary font-mono break-all leading-relaxed">{prompt}</p>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2">
                Execution Timeline
              </h3>
              <ExecutionTimeline steps={timeline} />
            </div>

            {/* Results */}
            {state === 'complete' && violations.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-scale-in" role="status">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-600" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-sm font-semibold text-green-800">No violations</p>
                </div>
                <p className="text-xs text-green-600 ml-6">
                  Execution completed with no policy violations detected.
                </p>
              </div>
            )}

            {state === 'complete' && violations.length > 0 && (
              <div className="animate-fade-in">
                <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2.5">
                  Violation Log
                </h3>
                <div className="space-y-2">
                  {violations.map((v, i) => {
                    const config = severityConfig[v.severity] || severityConfig.medium;
                    return (
                      <div
                        key={`${v.ruleName}-${i}`}
                        className={`border rounded-lg p-3.5 ${config.card}`}
                        role="alert"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
                          <span className="font-semibold text-sm text-text-primary">{v.ruleName}</span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${config.badge}`}>
                            {v.severity}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary ml-3.5">{v.description}</p>
                        <p className="text-[11px] text-text-muted mt-1.5 ml-3.5 font-mono bg-white/50 rounded px-2 py-1">
                          Matched: {v.matchedPattern}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
