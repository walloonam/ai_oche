# Codex Connection Guide

This project currently connects the office UI to a local agent server. The local server is the bridge between the browser UI and the workspace on disk.

```txt
React UI :4173
  -> /api through Vite proxy
  -> Local Agent Server :4174
  -> installed Codex CLI, repo, git, npm, shell allowlist
```

The CTO planner now uses the `codex` CLI installed on the server. It does not require an `OPENAI_API_KEY` in this project.

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
server/cto-plan.schema.json
                          JSON shape expected from codex exec
vite.config.js            Proxies /api to localhost:4174
src/App.jsx               Calls /api/workspace and /api/capabilities/run
                          Calls /api/cto/plan for CTO planning
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

### Select Workspace

```bash
curl -X POST http://localhost:4174/api/workspace/select \
  -H "Content-Type: application/json" \
  -d '{"path":"/root/ai_oche"}'
```

The UI uses the Workspace input and `Change` button to call this endpoint.

After a workspace is selected:

```txt
/api/workspace          reads git/package info from that directory
/api/capabilities/run   runs allowlisted commands in that directory
/api/cto/plan           calls codex exec --cd with that directory
```

Relative paths are resolved from the current active workspace. The server validates that the selected path exists and is a directory.

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

### CTO Plan

```bash
curl -X POST http://localhost:4174/api/cto/plan \
  -H "Content-Type: application/json" \
  -d '{"command":"로그인 화면 API 연결하고 테스트까지 진행해줘"}'
```

Returns a CTO plan and the planner source:

```js
{
  ok: true,
  planner: "codex-cli", // or "local-fallback"
  plan: {
    id,
    command,
    summary,
    priority,
    estimatedSteps,
    assignments: [
      {
        id,
        roleKey,
        roleShortName,
        title,
        reason,
        dependencies,
        status
      }
    ]
  }
}
```

The server calls:

```bash
codex exec - \
  --cd /root/ai_oche \
  --sandbox read-only \
  --output-schema server/cto-plan.schema.json
```

If the installed Codex CLI is missing, logged out, times out, or returns invalid JSON, the endpoint falls back to the local rule-based planner so the UI still works.

### Run Codex Events

```bash
curl -X POST http://localhost:4174/api/codex/run \
  -H "Content-Type: application/json" \
  -d '{"command":"현재 프로젝트 구조 확인해줘","sandbox":"read-only"}'
```

Supported sandbox values:

```txt
read-only         Inspect and report only
workspace-write   Allow Codex to edit files inside the selected workspace
```

The UI calls this from the plan card's `Execute with Codex` button. The server runs:

```bash
codex exec --json - \
  --cd <active workspace> \
  --sandbox <read-only|workspace-write>
```

The endpoint returns the Codex JSONL events, a compact event-derived plan, and the refreshed workspace state. The UI maps those real Codex events back into the visible subagent desks.

Optional environment variables:

```txt
CODEX_BIN          Override the codex executable path
CODEX_TIMEOUT_MS   Override planner timeout, default 120000
CODEX_RUN_TIMEOUT_MS
                   Override event run timeout, default 300000
AGENT_PORT         Override local agent server port, default 4174
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
  -> server-side planner adapter
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
  // current: local rule-based planner in server/agent-server.mjs
  // next: optionally call OpenAI/Codex here
  return {
    summary: "...",
    assignments: [
      { roleKey: "frontend", title: "...", reason: "...", dependencies: [] }
    ]
  };
}
```

Do not put API keys in React, Vite client env variables, or browser local storage. The current integration uses the server-installed Codex CLI instead of a browser-side or project-side OpenAI API key.

## Current Limitations

- CTO planning calls `codex exec`, but planner output is non-streaming for now.
- Codex execution uses `codex exec --json`; the UI receives events after the run completes, not live over SSE yet.
- When Codex CLI fails, the UI uses the local fallback planner.
- Workspace selection is process-local; restarting `npm run agent` resets it to the directory where the server starts.
- Capability buttons execute simple allowlisted commands only.
- `Edit Files` is a placeholder and does not write files.
- There is no persistent run history yet.
- There is no streaming event log yet.

## Suggested Next Step

Add execution and run history behind the same local server:

```txt
POST /api/cto/execute
GET  /api/runs/:id
GET  /api/runs/:id/events
```

Keep all actual filesystem and shell work on the server side, with narrow commands and visible results in the UI.
