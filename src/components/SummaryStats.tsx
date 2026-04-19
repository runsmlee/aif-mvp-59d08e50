export interface Stats {
  submitted: number;
  violationsLogged: number;
  blocked: number;
  cleanExecutions: number;
}

interface SummaryStatsProps {
  stats: Stats;
}

const statItems = [
  {
    key: 'submitted' as const,
    label: 'Submitted',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-muted" aria-hidden="true">
        <path d="M8 1L14.928 5V11L8 15L1.072 11V5L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    accent: 'border-t-blue-500',
    valueColor: 'text-text-primary',
  },
  {
    key: 'violationsLogged' as const,
    label: 'Violations',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-amber-500" aria-hidden="true">
        <path d="M8 1.5L14.5 4.5V8.5C14.5 11.81 11.66 14.85 8 15.5C4.34 14.85 1.5 11.81 1.5 8.5V4.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
      </svg>
    ),
    accent: 'border-t-amber-500',
    valueColor: 'text-amber-700',
  },
  {
    key: 'blocked' as const,
    label: 'Blocked',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-brand-primary" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    accent: 'border-t-brand-primary',
    valueColor: 'text-brand-primary',
  },
  {
    key: 'cleanExecutions' as const,
    label: 'Clean',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-500" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5.5 8L7 9.5L10.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    accent: 'border-t-green-500',
    valueColor: 'text-green-700',
  },
];

export function SummaryStats({ stats }: SummaryStatsProps) {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      role="region"
      aria-label="Session statistics"
      aria-live="polite"
    >
      {statItems.map((item) => (
        <div
          key={item.key}
          className={`bg-surface rounded-xl border border-border-primary border-t-2 ${item.accent} p-4 text-center card-hover`}
        >
          <div className="flex items-center justify-center mb-2">
            {item.icon}
          </div>
          <p className={`text-2xl font-bold tabular-nums ${item.valueColor}`}>
            {stats[item.key]}
          </p>
          <p className="text-xs text-text-muted mt-1 font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
