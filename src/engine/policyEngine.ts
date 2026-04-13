import type { PolicyRule, PolicyViolation } from '../types';

export const POLICY_RULES: PolicyRule[] = [
  {
    name: 'PII Detection',
    severity: 'high',
    description: 'Detects personally identifiable information such as email addresses and SSNs',
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b|\b\d{3}-\d{2}-\d{4}\b/gi,
  },
  {
    name: 'SQL Injection Prevention',
    severity: 'critical',
    description: 'Detects SQL injection attempts including DROP, DELETE, and UNION-based attacks',
    pattern: /\b(DROP\s+TABLE|DELETE\s+FROM|UNION\s+SELECT|INSERT\s+INTO.*VALUES|;\s*--|OR\s+1\s*=\s*1)\b/gi,
  },
  {
    name: 'Unauthorized Resource Access',
    severity: 'critical',
    description: 'Detects attempts to access sensitive system files or directories',
    pattern: /(\/etc\/(shadow|passwd|sudoers)|\/proc\/self|\/sys\/(kernel|firmware))\b/gi,
  },
  {
    name: 'Command Injection Detection',
    severity: 'high',
    description: 'Detects shell command injection attempts',
    pattern: /(;|\||`|&&)\s*(rm|chmod|chown|wget|curl|nc|bash|sh|python|perl)\b/gi,
  },
  {
    name: 'Credential Exposure Prevention',
    severity: 'high',
    description: 'Detects requests that may expose API keys, passwords, or tokens',
    pattern: /\b(api[_-]?key|secret[_-]?key|password|bearer[_-]?token|access[_-]?token)\s*[:=]\s*\S+/gi,
  },
  {
    name: 'Data Exfiltration Prevention',
    severity: 'medium',
    description: 'Detects patterns suggesting large-scale data extraction or transfer',
    pattern: /\b(SELECT\s+.*\s+FROM|COPY\s+.*\s+TO|EXPORT\s+.*\s+DATABASE|DUMP\s+DATABASE)\b/gi,
  },
  {
    name: 'Privilege Escalation Detection',
    severity: 'critical',
    description: 'Detects attempts to escalate privileges or gain root access',
    pattern: /\b(sudo\s+|su\s+-|root|chmod\s+777|SETUID|SETGID)\b/gi,
  },
];

export function evaluatePrompt(prompt: string): PolicyViolation[] {
  const violations: PolicyViolation[] = [];

  for (const rule of POLICY_RULES) {
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    const match = prompt.match(regex);
    if (match) {
      violations.push({
        ruleName: rule.name,
        severity: rule.severity,
        description: rule.description,
        matchedPattern: match[0],
      });
    }
  }

  return violations;
}
