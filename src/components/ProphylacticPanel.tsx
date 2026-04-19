import type { PolicyViolation, TimelineStep } from '../types';
import { ExecutionTimeline } from './ExecutionTimeline';

interface ProphylacticPanelProps {
  prompt: string;
  state: 'idle' | 'running' | 'complete';
  violations: PolicyViolation[];
  timeline: TimelineStep[];
  blocked: boolean;
}

const severityConfig: Record<string, { badge: string }> = {
  critical: { badge: 'bg-red-100 text-red-800 border-red-200' },
  high: { badge: 'bg-orange-100 text-orange-800 border-orange-200' },
  medium: { badge: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  low: { badge: 'bg-blue-100 text-blue-800 border-blue-200' },
};

function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse-soft">
      <div className="skeleton h-16 w-full rounded-lg" />
      <div className="space-y-2">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-8 w-full rounded" />
        <div className="skeleton h-8 w-3/4 rounded" />
      </div>
    </div>
  );
}

export function ProphylacticPanel({ prompt, state, violations, timeline, blocked }: ProphylacticPanelProps) {
  const isIdle = state === 'idle' && !prompt;

  return (
    <section
      aria-label="Prophylactic blocking panel"
      aria-live="polite"
      className="bg-surface rounded-xl border border-border-primary border-t-2 border-t-green-500 shadow-sm overflow-hidden"
    >
      {/* Panel Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-green-600">
                <path d="M8 1.5L14.5 4.5V8.5C14.5 11.81 11.66 14.85 8 15.5C4.34 14.85 1.5 11.81 1.5 8.5V4.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-base font-bold text-text-primary">Prophylactic</h2>
          </div>
          <span className="text-[11px] font-medium px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">
            Pre-execution
          </span>
        </div>
        <p className="text-xs text-text-muted mt-1.5 ml-[38px]">
          Scans first, blocks violations before execution
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
                <path d="M8 1.5L14.5 4.5V8.5C14.5 11.81 11.66 14.85 8 15.5C4.34 14.85 1.5 11.81 1.5 8.5V4.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-sm text-text-muted font-medium">Awaiting prompt</p>
            <p className="text-xs text-text-muted mt-1">Scans first, blocks violations before they execute</p>
            <p className="text-[11px] text-text-muted mt-2 opacity-70">Type a prompt above or click a sample below ↓</p>
          </div>
        )}

        {state === 'running' && (
          <div role="status" aria-label="Prophylactic panel is running">
            <SkeletonLoader />
            <span className="sr-only">Scanning prompt for policy violations…</span>
          </div>
        )}

        {!isIdle && state !== 'running' && prompt && (
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

            {/* Blocked State */}
            {state === 'complete' && blocked && violations.length > 0 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 animate-scale-in" role="alert">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M5 0L6.18 3.82L10 5L6.18 6.18L5 10L3.82 6.18L0 5L3.82 3.82L5 0Z" fill="white"/>
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-red-800">
                    Execution Blocked
                  </p>
                </div>
                <p className="text-xs text-red-700 mb-3 ml-8">
                  Policy violation detected before execution. The prompt was intercepted and never ran.
                </p>
                <div className="ml-8 space-y-1.5">
                  {violations.map((v, i) => {
                    const config = severityConfig[v.severity] || severityConfig.medium;
                    return (
                      <div key={`${v.ruleName}-${i}`} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" aria-hidden="true" />
                        <span className="font-semibold text-xs text-red-800">{v.ruleName}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${config.badge}`}>
                          {v.severity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Clean State */}
            {state === 'complete' && !blocked && violations.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-scale-in" role="status">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-600" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-sm font-semibold text-green-800">Execution Complete</p>
                </div>
                <p className="text-xs text-green-600 ml-6">
                  Policy check passed. Prompt executed successfully.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
