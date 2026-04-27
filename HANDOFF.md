# AI Agent Office Handoff

## Project State
- This repo now contains a Vite + React pixel office UI for a CTO-led Codex workspace.
- The app shows:
  - CTO as the main agent on the left
  - user commands sent only to the CTO
  - CTO planning/distribution into subagent queues
  - subagents on the right
  - a Workspace/Codex capability panel connected to a local agent server
  - CTO planning connected to the installed server-side `codex` CLI

## Key Files
- `src/App.jsx`
- `src/index.css`
- `server/agent-server.mjs`
- `server/cto-plan.schema.json`
- `docs/codex-connection.md`
- `assets/ai-characters/`
- `assets/palettes/`
- `docs/art-direction.md`
- `docs/character-notes.md`

## Current UI Structure
- Header with office stats
- Left side:
  - CTO command desk
  - Workspace/Codex capability panel
  - command chat to the CTO main agent
- Right side:
  - subagent office booths
  - queue counts and current task per subagent
  - CTO distribution/plan summary

## Current CTO Direction
- CTO should read as:
  - the single main agent
  - the only direct target for user instructions
  - the planner that decides which subagents receive work
- The current focus is readability:
  - do not make users manually pick subagents as the primary flow
  - show the CTO plan and resulting subagent queues
  - keep local command execution behind the agent server allowlist

## Recent Commit Pattern
- Every user-facing polish pass has been committed separately.
- Commit messages are in Korean when the user asked for that.
- The repo has been kept in a clean, revert-friendly state after each change.

## Run It
- Start UI + local agent server:
  - `npm run dev:all`
- Or start separately:
  - `npm run agent`
  - `npm run dev`
- Browser URL:
  - `http://localhost:4173`
- Agent server:
  - `http://localhost:4174`

## Resume Checklist
1. Read `src/App.jsx` and `src/index.css`.
2. Read `docs/codex-connection.md` before changing agent integration.
3. Start `npm run agent` and `npm run dev`.
4. Test `/api/workspace` before debugging the UI.
5. Open the app in a browser.
6. Keep the CTO as the command entry point.
7. Commit after each completed integration or polish pass.

## Notes For Next Session
- Keep the same warm pixel-art office style.
- Keep the CTO as the main coordinator.
- Do not allow arbitrary browser-supplied shell commands.
- CTO planner now runs in `server/agent-server.mjs` as `POST /api/cto/plan`.
- The planner tries `codex exec` first with `--sandbox read-only` and a strict output schema.
- If Codex CLI is unavailable or returns invalid JSON, it falls back to the local rule-based planner.
- Next likely task: add execution/run history after the planning step, still behind the local agent server.
