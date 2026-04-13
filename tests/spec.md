# Test Specifications

## Unit Tests (Vitest + React Testing Library)

### PromptInput.test.tsx
- [ ] renders a text input and submit button without crash
- [ ] typing into the input updates the input value
- [ ] clicking submit calls onSubmit handler with the current input text
- [ ] pressing Enter key submits the prompt
- [ ] submit button is disabled when input is empty
- [ ] input is cleared after successful submission

### DiagnosticPanel.test.tsx
- [ ] renders without crash with "Diagnostic" label
- [ ] displays "Awaiting prompt..." placeholder when no prompt has been submitted
- [ ] after receiving a benign prompt, shows execution completion then a "No violations" message
- [ ] after receiving a violating prompt, shows execution completion followed by violation logs with matched policy rule names
- [ ] violation logs appear only after a simulated execution delay (diagnostic = post-execution)
- [ ] each violation log entry includes a timestamp and severity badge
- [ ] timeline shows correct sequence: Input Received → Executing → Execution Complete → Policy Scan → Violation(s) Found

### ProphylacticPanel.test.tsx
- [ ] renders without crash with "Prophylactic" label
- [ ] displays "Awaiting prompt..." placeholder when no prompt has been submitted
- [ ] after receiving a benign prompt, shows policy check pass then execution proceeds
- [ ] after receiving a violating prompt, shows policy check fail and blocks execution immediately
- [ ] blocking message includes the matched policy rule name
- [ ] timeline shows correct sequence: Input Received → Policy Check → Blocked (or) → Executing → Complete
- [ ] execution never begins when a violation is detected (no "Executing" step in blocked flow)

### PolicyEngine.test.ts
- [ ] returns empty violations array for a benign prompt
- [ ] returns at least one violation for a prompt containing PII (email, SSN pattern)
- [ ] returns at least one violation for a prompt containing SQL injection pattern
- [ ] returns at least one violation for a prompt requesting unauthorized resource access
- [ ] each violation includes: rule name, severity, description, and matched pattern
- [ ] benign prompts pass in both modes (diagnostic logs "no violations", prophylactic allows execution)

### ExecutionTimeline.test.tsx
- [ ] renders a list of timeline steps in order
- [ ] each step displays a label and relative timestamp
- [ ] steps for diagnostic flow include post-execution policy scan
- [ ] steps for prophylactic flow include pre-execution policy check
- [ ] blocked steps are visually differentiated (red styling)
- [ ] completed steps are visually differentiated (green styling)

### SamplePrompts.test.tsx
- [ ] renders a list of at least 8 sample prompts
- [ ] each sample prompt is clickable
- [ ] clicking a sample prompt calls the onSelect handler with the prompt text
- [ ] sample prompts are categorized or labeled by type (benign, borderline, violating)

### App.test.tsx
- [ ] renders the dual-panel layout with Diagnostic on the left and Prophylactic on the right
- [ ] renders the shared prompt input above the panels
- [ ] submitting a prompt updates both panels simultaneously
- [ ] summary statistics counters are visible and update after submission

### SummaryStats.test.tsx
- [ ] renders initial counters at zero
- [ ] increments "Prompts Submitted" counter after each submission
- [ ] increments "Violations Logged" counter for diagnostic violations
- [ ] increments "Prompts Blocked" counter for prophylactic blocks
- [ ] increments "Clean Executions" counter for benign prompts that pass both panels

## User Journey Tests

### Primary Workflow
1. App loads → both panels show "Awaiting prompt..." state, prompt input is focused
2. User types a violating prompt (e.g., containing PII) and submits
3. Diagnostic panel: shows execution completing, then surfaces violation log after delay
4. Prophylactic panel: immediately shows policy violation and blocks execution
5. Visual contrast between "already executed then flagged" vs "blocked before execution" is clear
6. User types a benign prompt and submits
7. Both panels show successful execution with no violations
8. Summary statistics update to reflect all actions

### Edge Cases
1. Empty prompt → submit button disabled, no action
2. Very long prompt → input handles gracefully, panels process normally
3. Rapid successive submissions → each prompt is processed in order, no state corruption
4. Special characters in prompt → no rendering errors in panels

## Acceptance Criteria Checklist
(Reviewer verifies these against PRD.md Must Have features)

- [ ] AC: submitting one prompt simultaneously triggers both panels with visible timing and outcome differences
- [ ] AC: violations appear only after a simulated execution completes, with a log-style timeline showing the delay between action and detection
- [ ] AC: blocking occurs before any simulated execution begins, with a clear denial message and matched policy rule shown instantly
- [ ] AC: at least 5 distinct policy rules are active by default and each panel correctly references the matched rule
- [ ] AC: each panel renders a step-by-step timeline with measurable delay differences between diagnostic and prophylactic flows
