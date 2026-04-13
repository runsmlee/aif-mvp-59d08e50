export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface PolicyViolation {
  ruleName: string;
  severity: Severity;
  description: string;
  matchedPattern: string;
}

export interface PolicyRule {
  name: string;
  severity: Severity;
  description: string;
  pattern: RegExp;
}

export type TimelineStepStatus = 'pending' | 'active' | 'completed' | 'blocked';

export interface TimelineStep {
  label: string;
  status: TimelineStepStatus;
  timestamp: string;
  relativeMs: number;
}

export type PanelMode = 'diagnostic' | 'prophylactic';

export interface PanelState {
  status: 'idle' | 'running' | 'complete';
  prompt: string;
  violations: PolicyViolation[];
  timeline: TimelineStep[];
  blocked: boolean;
}
