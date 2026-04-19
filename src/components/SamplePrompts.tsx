import { SAMPLE_PROMPTS } from '../engine/samplePrompts';

interface SamplePromptsProps {
  onSelect: (prompt: string) => void;
}

const categoryConfig = {
  benign: {
    label: 'Benign',
    containerStyle: 'border-green-200 bg-green-50/50',
    labelStyle: 'text-green-700 bg-green-100',
    dotColor: 'bg-green-500',
    buttonHover: 'hover:border-green-300 hover:bg-green-50',
  },
  borderline: {
    label: 'Borderline',
    containerStyle: 'border-amber-200 bg-amber-50/50',
    labelStyle: 'text-amber-700 bg-amber-100',
    dotColor: 'bg-amber-500',
    buttonHover: 'hover:border-amber-300 hover:bg-amber-50',
  },
  violating: {
    label: 'Violating',
    containerStyle: 'border-red-200 bg-red-50/50',
    labelStyle: 'text-red-700 bg-red-100',
    dotColor: 'bg-red-500',
    buttonHover: 'hover:border-red-300 hover:bg-red-50',
  },
} as const;

export function SamplePrompts({ onSelect }: SamplePromptsProps) {
  const categories = ['benign', 'borderline', 'violating'] as const;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {categories.map((category) => {
        const prompts = SAMPLE_PROMPTS.filter((p) => p.category === category);
        if (prompts.length === 0) return null;

        const config = categoryConfig[category];

        return (
          <div
            key={category}
            className={`rounded-lg border p-3 ${config.containerStyle}`}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`w-2 h-2 rounded-full ${config.dotColor}`} aria-hidden="true" />
              <h4 className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.labelStyle}`}>
                {config.label}
              </h4>
            </div>
            <div className="space-y-1.5">
              {prompts.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => onSelect(prompt.text)}
                  className={`w-full text-left text-xs px-3 py-2 border border-border-primary rounded-lg bg-surface ${config.buttonHover} active:scale-[0.98] transition-all duration-150 min-h-[44px] flex items-center leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary`}
                  title={prompt.text}
                  aria-label={`Sample prompt: ${prompt.label} (${prompt.category})`}
                >
                  <span className="truncate text-text-secondary">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
