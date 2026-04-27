import { exec } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const PORT = Number(process.env.AGENT_PORT ?? 4174);
const workspaceRoot = process.cwd();

const jsonHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, jsonHeaders);
  response.end(JSON.stringify(payload));
}

async function runCommand(command, timeout = 20000) {
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: workspaceRoot,
      timeout,
      maxBuffer: 1024 * 1024,
      env: process.env,
    });

    return {
      ok: true,
      command,
      output: [stdout.trim(), stderr.trim()].filter(Boolean).join("\n"),
    };
  } catch (error) {
    return {
      ok: false,
      command,
      output: [error.stdout?.trim(), error.stderr?.trim(), error.message].filter(Boolean).join("\n"),
    };
  }
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function getPackageInfo() {
  try {
    const raw = await readFile(new URL("../package.json", import.meta.url), "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function getWorkspace() {
  const [branch, status, packageInfo] = await Promise.all([
    runCommand("git branch --show-current", 5000),
    runCommand("git status --short", 5000),
    getPackageInfo(),
  ]);
  const statusLines = status.output ? status.output.split("\n").filter(Boolean) : [];

  return {
    path: workspaceRoot,
    branch: branch.output || "unknown",
    status: statusLines.length > 0 ? `${statusLines.length} changed files` : "clean",
    changedFiles: statusLines,
    framework: packageInfo.dependencies?.react ? "Vite + React" : "unknown",
    packageManager: "npm",
    scripts: Object.keys(packageInfo.scripts ?? {}),
  };
}

async function runCapability(capability) {
  const handlers = {
    read: () => runCommand("rg --files -g '!node_modules' -g '!dist' | head -80", 8000),
    build: () => runCommand("npm run build", 30000),
    review: () => runCommand("git diff --stat && git status --short", 8000),
    test: async () => {
      const packageInfo = await getPackageInfo();
      if (!packageInfo.scripts?.test) {
        return {
          ok: true,
          command: "npm test",
          output: "No test script is defined in package.json.",
        };
      }
      return runCommand("npm test", 30000);
    },
    edit: () => ({
      ok: true,
      command: "edit",
      output: "Edit mode is available through the CTO chat. File writes still require an explicit task plan.",
    }),
    commit: () => runCommand("git status --short", 8000),
  };

  if (!handlers[capability]) {
    return {
      ok: false,
      command: capability,
      output: `Unknown capability: ${capability}`,
    };
  }

  return handlers[capability]();
}

const server = createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 200, { ok: true });
    return;
  }

  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/api/health") {
      sendJson(response, 200, { ok: true, workspaceRoot });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/workspace") {
      sendJson(response, 200, { ok: true, workspace: await getWorkspace() });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/capabilities/run") {
      const body = await readBody(request);
      const result = await runCapability(body.capability);
      sendJson(response, 200, { ok: result.ok, result });
      return;
    }

    sendJson(response, 404, { ok: false, error: "Not found" });
  } catch (error) {
    sendJson(response, 500, { ok: false, error: error.message });
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Agent server listening on http://localhost:${PORT}`);
});
