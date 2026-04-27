# Codex Connection Guide

This project currently connects the office UI to a local agent server. The local server is the bridge between the browser UI and the workspace on disk.

```txt
React UI :4173
  -> /api through Vite proxy
  -> Local Agent Server :4174
  -> repo, git, npm, shell allowlist
```

The current setup is not a direct OpenAI API integration yet. It is the local execution layer that a real Codex/OpenAI adapter should sit behind later.

## Run It

Start both the UI and local agent server:

```bash
npm run dev:all
```

Or start them separately:

```bash
npm run agent
npm run dev
```

Open the UI:

```txt
http://localhost:4173/
```

The local agent server runs at:

```txt
http://localhost:4174/
```

## Files

```txt
server/agent-server.mjs   Local agent server
vite.config.js            Proxies /api to localhost:4174
src/App.jsx               Calls /api/workspace and /api/capabilities/run
package.json              agent, dev, dev:all scripts
```

## Current API

### Health

```bash
curl http://localhost:4174/api/health
```

Returns whether the local agent server is alive.

### Workspace

```bash
curl http://localhost:4174/api/workspace
```

Returns:

```js
{
  path,
  branch,
  status,
  changedFiles,
  framework,
  packageManager,
  scripts
}
```

The UI uses this to fill the Workspace panel.

### Run Capability

```bash
curl -X POST http://localhost:4174/api/capabilities/run \
  -H "Content-Type: application/json" \
  -d '{"capability":"review"}'
```

Supported capabilities:

```txt
read    -> rg --files
build   -> npm run build
review  -> git diff --stat && git status --short
test    -> npm test if package.json has a test script
edit    -> placeholder; actual file edits should be task-gated
commit  -> git status --short
```

## Safety Model

The server intentionally does not accept arbitrary shell commands from the browser. It only runs a fixed allowlist in `runCapability()`.

When adding a new capability:

1. Add a button entry in `CODEX_CAPABILITIES` in `src/App.jsx`.
2. Add a matching handler in `runCapability()` in `server/agent-server.mjs`.
3. Keep the command narrow and predictable.
4. Avoid destructive commands such as reset, checkout, rm, or force pushes.
5. For file writes, require an explicit CTO plan and show the intended change before execution.

## How This Becomes Real Codex

The next integration should happen server-side, not in the browser.

```txt
React chat
  -> POST /api/cto/plan
  -> server-side Codex/OpenAI adapter
  -> tool calls / repo reads / shell allowlist
  -> CTO plan + agent assignments
```

Recommended next endpoints:

```txt
POST /api/cto/plan
POST /api/cto/execute
GET  /api/runs/:id
GET  /api/runs/:id/events
```

Suggested adapter shape:

```js
async function planWithCto({ command, workspace }) {
  // current: local rule-based planner in src/App.jsx
  // next: move planner to server and optionally call OpenAI/Codex here
  return {
    summary: "...",
    assignments: [
      { roleKey: "frontend", title: "...", reason: "...", dependencies: [] }
    ]
  };
}
```

Keep API keys only on the server. Never expose an OpenAI API key in React, Vite env variables intended for the client, or browser local storage.

## Current Limitations

- CTO planning is still local/rule-based in `src/App.jsx`.
- Capability buttons execute simple allowlisted commands only.
- `Edit Files` is a placeholder and does not write files.
- There is no persistent run history yet.
- There is no streaming event log yet.

## Suggested Next Step

Move CTO planning from `src/App.jsx` into `server/agent-server.mjs`:

```txt
POST /api/cto/plan
```

Then the UI should send the chat command to the server, receive the CTO plan, and update the subagent queues from that server response. After that, replacing the local planner with a real Codex/OpenAI planner becomes a contained server-side change.
