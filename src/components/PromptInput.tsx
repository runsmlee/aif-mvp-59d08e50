import { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
}

export function PromptInput({ onSubmit }: PromptInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (): void => {
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onSubmit(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-text-muted">
            <path d="M7.5 2.5C7.5 2.22386 7.72386 2 8 2C8.27614 2 8.5 2.22386 8.5 2.5V7.5H13.5C13.7761 7.5 14 7.72386 14 8C14 8.27614 13.7761 8.5 13.5 8.5H8.5V13.5C8.5 13.7761 8.27614 14 8 14C7.72386 14 7.5 13.7761 7.5 13.5V8.5H2.5C2.22386 8.5 2 8.27614 2 8C2 7.72386 2.22386 7.5 2.5 7.5H7.5V2.5Z" fill="currentColor"/>
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt to evaluate…"
          className="w-full pl-11 pr-4 py-3 border border-border-primary rounded-lg text-base text-text-primary placeholder:text-text-muted bg-surface-secondary hover:border-border-secondary focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all duration-200"
          aria-label="Prompt input"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={value.trim().length === 0}
        className="px-5 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-dark active:bg-brand-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-brand-primary disabled:active:scale-100 min-h-[44px] min-w-[88px] shadow-sm hover:shadow-md disabled:shadow-none"
        aria-label="Submit prompt"
      >
        Submit
      </button>
    </div>
  );
}
