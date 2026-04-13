import type { TimelineStep } from '../types';

interface ExecutionTimelineProps {
  steps: TimelineStep[];
}

const statusConfig: Record<string, { dot: string; ring: string; line: string; text: string; time: string }> = {
  completed: {
    dot: 'bg-green-500',
    ring: '',
    line: 'bg-green-300',
    text: 'text-text-primary',
    time: 'text-text-muted',
  },
  active: {
    dot: 'bg-blue-500',
    ring: 'ring-4 ring-blue-100',
    line: 'bg-blue-200',
    text: 'text-blue-700',
    time: 'text-blue-500',
  },
  blocked: {
    dot: 'bg-red-500',
    ring: 'ring-4 ring-red-100',
    line: 'bg-red-300',
    text: 'text-red-700',
    time: 'text-red-500',
  },
  pending: {
    dot: 'bg-gray-300',
    ring: '',
    line: 'bg-gray-200',
    text: 'text-text-muted',
    time: 'text-text-muted',
  },
};

export function ExecutionTimeline({ steps }: ExecutionTimelineProps) {
  if (steps.length === 0) return null;

  return (
    <div className="relative" role="list" aria-label="Execution timeline">
      {/* Connecting line */}
      <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border-primary" aria-hidden="true" />

      <ul className="relative space-y-3">
        {steps.map((step, index) => {
          const config = statusConfig[step.status] || statusConfig.pending;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={`${step.label}-${index}`}
              role="listitem"
              data-status={step.status}
              className={`relative flex items-center gap-3 animate-slide-up`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Dot */}
              <div className="relative z-10 flex-shrink-0">
                <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center ${config.ring}`}>
                  <div className={`w-2 h-2 rounded-full ${config.dot}`} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className={`text-sm font-medium ${config.text} truncate`}>
                  {step.label}
                </span>
                <span className={`text-[11px] font-mono tabular-nums ${config.time} flex-shrink-0 ml-3`}>
                  +{step.relativeMs}ms
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
