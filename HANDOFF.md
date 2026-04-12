# AI Agent Office Handoff

## Project State
- This repo now contains a Vite + React + Tailwind pixel office UI.
- The app shows a shared AI agent office layout with:
  - CTO as the main coordinator on the left
  - subagents on the right
  - a separate Character Lab view for sprite preview and downloads
- Current work focused on making the CTO workstation read as a real seated desk scene:
  - chair, desk, monitor, mug, tablet, and keyboard are simplified and readable
  - the CTO is meant to be the focal point of the main command desk
  - the composition is intentionally clean and uncluttered

## Key Files
- `src/App.jsx`
- `src/index.css`
- `assets/characters/`
- `assets/spritesheet/`
- `assets/palettes/`
- `docs/art-direction.md`
- `docs/character-notes.md`

## Current UI Structure
- Header with view toggle, scale toggle, and background toggle
- `Office UI` view:
  - CTO main workstation on the left
  - subagent workstations on the right
  - main agent chat below the CTO area
  - work board below the chat
- `Character Lab` view:
  - role previews
  - download links for sprites, sprite sheet, and palettes

## Current CTO Direction
- CTO should read as:
  - seated in the chair
  - using a desk monitor
  - coordinating from a command desk
- The current focus is readability:
  - monitor must be clearly a desk monitor
  - desk details must look like furniture, not decoration
  - props should stay minimal and identifiable

## Recent Commit Pattern
- Every user-facing polish pass has been committed separately.
- Commit messages are in Korean when the user asked for that.
- The repo has been kept in a clean, revert-friendly state after each change.

## Run It
- Start dev server with:
  - `npm run dev -- --host 0.0.0.0 --port 4173`
- Current browser URL used during work:
  - `http://192.168.25.150:4173`

## Resume Checklist
1. Read `src/App.jsx` and `src/index.css`.
2. Open the app in a browser.
3. Check the CTO workstation first.
4. Keep changes limited to the requested role or scene.
5. Commit after each completed polish pass.

## Notes For Next Session
- Do not redesign the whole page unless explicitly asked.
- Keep the same warm pixel-art office style.
- Keep the CTO as the main coordinator.
- If the CTO scene needs more work, prefer simplifying over adding more props.
