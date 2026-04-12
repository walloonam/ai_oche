# Decisions Log

## 2026-04-11
- Chose a single-screen "AI development team ops room" UI.
- Kept character styling secondary to status visibility.
- Used a warm beige operational look instead of a generic app theme.
- Chose static files for the first implementation because the workspace had no existing stack.
- Chose ASCII-safe data values in the domain layer to reduce encoding risk.
- Added explicit handoff files so the next server can continue without reconstructing context.

## 2026-04-10
- Reframed the surface as a game-style party scene instead of a dashboard.
- Placed the selected main agent on the left and the subagents on the right.
- Compressed the layout to fit one desktop viewport without requiring page scroll.
- Added a local `favicon.svg` to remove browser noise during validation.

## 2026-04-10
- Upgraded the agent portraits from text badges to pixel-style SVG sprites.
- Shifted the visual language toward a dot/pixel party scene on top of the same single-screen layout.

## 2026-04-10
- Switched the palette to a bright office theme with Korean UI copy.
- Added a Korean web font fallback because the environment did not have local Korean fonts.
- Represented each agent as sitting in an office booth with a computer, desk, and room frame.

## 2026-04-11
- Simplified the pixel portraits into seated human silhouettes so they read as people instead of icons.
- Restored the booth elements as separate room layers so the office scene reads more clearly.

## 2026-04-11
- Enlarged the compact party tiles so the character silhouette dominates the square.
- Kept the office-room framing, but reduced extra decoration in the small tiles to prioritize the person.

## 2026-04-11
- Softened the pixel human proportions after the user flagged the earlier version as broken and scary.
- Kept the job-specific identity, but moved the art direction toward calmer, cleaner office avatars.

## 2026-04-11
- Rebased the compact subagent tile on the user's portrait reference.
- Simplified the tile into a centered human sprite with a label and base bar, reducing room clutter to almost nothing.

## Working Rule
- Record only decisions that affect future work.
- Keep each note short.
- Do not turn this into a full changelog.
