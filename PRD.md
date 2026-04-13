# GateFirst — Product Requirements Document

## Problem
Engineering teams lack an intuitive way to understand why pre-execution (prophylactic) governance outperforms post-execution (diagnostic) logging for AI and compute policy enforcement. Abstract explanations fail — stakeholders need to *see* the difference in real-time: a prompt that already executed and caused harm (diagnostic) versus a prompt that was intercepted before damage occurred (prophylactic).

## Target Users
DevOps engineers, platform security leads, and AI/ML team leads evaluating governance tooling for their organization. These are technical decision-makers who need to convince non-technical stakeholders that shifting left on policy enforcement is worth the investment.

## Core Features

### Must Have

- **Dual-Panel Comparison Interface**: A split-screen layout where a single user prompt is evaluated by both governance models side-by-side — Acceptance Criteria: submitting one prompt simultaneously triggers both panels with visible timing and outcome differences.

- **Diagnostic Logging Panel**: Executes the prompt, then retroactively scans output against policy rules and surfaces violations with timestamps — Acceptance Criteria: violations appear only *after* a simulated execution completes, with a log-style timeline showing the delay between action and detection.

- **Prophylactic Blocking Panel**: Scans the prompt against policy rules *before* execution, intercepts policy-violating inputs, and prevents execution — Acceptance Criteria: blocking occurs before any simulated execution begins, with a clear denial message and matched policy rule shown instantly.

- **Policy Rule Engine**: A configurable set of sample governance rules (e.g., PII exposure, SQL injection, unauthorized resource access) — Acceptance Criteria: at least 5 distinct policy rules are active by default and each panel correctly references the matched rule.

- **Execution Timeline**: A visual timeline per panel showing key events (input received → policy check → execute/block → result) with relative timestamps — Acceptance Criteria: each panel renders a step-by-step timeline with measurable delay differences between diagnostic and prophylactic flows.

### Should Have

- **Sample Prompt Library**: Pre-built prompts (benign, borderline, violating) for quick exploration — Acceptance Criteria: at least 8 sample prompts spanning all severity levels are available and one-click injectable.

- **Severity Classification**: Policy violations tagged by severity (critical, high, medium, low) with color coding — Acceptance Criteria: each violation displays a severity badge and the diagnostic panel sorts logs by severity.

- **Summary Statistics**: Running tally of executions, blocks, and violations across the session — Acceptance Criteria: counters update live after each prompt submission.

### Out of Scope (v1)
- Custom policy rule editor (v2 will allow users to write their own rules)
- Real LLM integration (v1 uses deterministic simulation only)
- Export/shareable reports (v2)
- Multi-user / collaboration features

## Success Metrics
- Primary: User submits at least 3 prompts within 60 seconds of first interaction (indicates the demo is immediately graspable).
- Secondary: User interacts with the sample prompt library (clicks a pre-built prompt) — measures discoverability of guided exploration.

## Design Principles
- **Show, don't tell**: Every concept is demonstrated through live comparison rather than documentation.
- **Speed of understanding**: The dual-panel layout must communicate the core thesis within 5 seconds of page load, even before any interaction.
- **Professional restraint**: Clean, minimal UI with no decorative elements — the comparison itself is the visual interest.
