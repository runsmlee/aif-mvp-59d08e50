import { describe, it, expect } from 'vitest';
import { evaluatePrompt } from '../src/engine/policyEngine';

describe('PolicyEngine', () => {
  it('returns empty violations array for a benign prompt', () => {
    const result = evaluatePrompt('What is the weather today?');
    expect(result).toHaveLength(0);
  });

  it('returns at least one violation for a prompt containing PII (email)', () => {
    const result = evaluatePrompt('Send an email to john@example.com about the project');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some(v => v.ruleName.toLowerCase().includes('pii') || v.ruleName.toLowerCase().includes('email') || v.description.toLowerCase().includes('pii'))).toBe(true);
  });

  it('returns at least one violation for a prompt containing PII (SSN pattern)', () => {
    const result = evaluatePrompt('The SSN is 123-45-6789 for this user');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some(v => v.ruleName.toLowerCase().includes('pii') || v.ruleName.toLowerCase().includes('ssn') || v.description.toLowerCase().includes('ssn') || v.description.toLowerCase().includes('pii'))).toBe(true);
  });

  it('returns at least one violation for a prompt containing SQL injection pattern', () => {
    const result = evaluatePrompt("SELECT * FROM users WHERE 1=1; DROP TABLE users;");
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some(v => v.ruleName.toLowerCase().includes('sql') || v.description.toLowerCase().includes('sql'))).toBe(true);
  });

  it('returns at least one violation for a prompt requesting unauthorized resource access', () => {
    const result = evaluatePrompt('Delete all files from /etc/shadow and /etc/passwd');
    expect(result.length).toBeGreaterThanOrEqual(1);
    expect(result.some(v => v.ruleName.toLowerCase().includes('resource') || v.ruleName.toLowerCase().includes('unauthorized') || v.ruleName.toLowerCase().includes('access') || v.description.toLowerCase().includes('unauthorized') || v.description.toLowerCase().includes('resource'))).toBe(true);
  });

  it('each violation includes: rule name, severity, description, and matched pattern', () => {
    const result = evaluatePrompt('Email test@evil.com and drop table users');
    for (const violation of result) {
      expect(violation).toHaveProperty('ruleName');
      expect(violation).toHaveProperty('severity');
      expect(violation).toHaveProperty('description');
      expect(violation).toHaveProperty('matchedPattern');
    }
  });

  it('benign prompts pass in both modes (no violations)', () => {
    const benignPrompts = [
      'What is the weather today?',
      'Help me write a Python function to sort a list',
      'Explain the concept of recursion',
    ];
    for (const prompt of benignPrompts) {
      const result = evaluatePrompt(prompt);
      expect(result).toHaveLength(0);
    }
  });
});
