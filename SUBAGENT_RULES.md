# Subagent Rules

## Purpose
- Use subagents to split work by responsibility.
- Do not use subagents as a formality.
- Assign only the minimum roles needed for the task.

## Required Contract
Every subagent request must include:
- role
- goal
- editable scope
- forbidden scope
- done criteria
- output format

## Role Boundaries
- CTO: requirements, architecture, task split, priority, risk
- Backend Engineer: APIs, server logic, data model, business rules
- Frontend Engineer: UI, layout, state, interaction, styling
- QA Engineer: tests, regression, edge cases, failure analysis
- Reviewer: safety, maintainability, complexity, diff risk

## Output Rule
- Keep output short.
- Report only:
  - decision
  - changed files
  - validation result
  - remaining issues
- Do not dump raw logs unless explicitly asked.

## Coordination Rule
- If subagent outputs overlap, reconcile them before merging.
- If a subagent reaches outside its scope, ignore that part and keep the work focused.
- If a subagent cannot finish, capture the blocker and continue with the rest of the task.

## Safety Rule
- Do not let a subagent make destructive or broad changes.
- Do not let one subagent silently override another's work.
- Keep changes small and reviewable.
