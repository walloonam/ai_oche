import { exec, spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const PORT = Number(process.env.AGENT_PORT ?? 4174);
const workspaceRoot = process.cwd();
const codexBinary = process.env.CODEX_BIN ?? "codex";
const codexTimeoutMs = Number(process.env.CODEX_TIMEOUT_MS ?? 120000);
const ctoPlanSchemaPath = new URL("./cto-plan.schema.json", import.meta.url);

const roleShortNames = {
  pm: "PM",
  frontend: "FE",
  backend: "BE",
  qa: "QA",
  designer: "Design",
  platform: "Ops",
};

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

function getDistributionTargets(command) {
  const text = command.toLowerCase();
  const targets = new Set();

  if (/기획|일정|요구|정리|우선|문서|스펙|정책|분배/.test(text)) {
    targets.add("pm");
  }
  if (/화면|ui|ux|프론트|버튼|채팅|컴포넌트|레이아웃|상태/.test(text)) {
    targets.add("frontend");
  }
  if (/api|서버|백엔드|db|데이터|저장|인증|연결/.test(text)) {
    targets.add("backend");
  }
  if (/테스트|검증|qa|버그|품질|회귀|확인/.test(text)) {
    targets.add("qa");
  }
  if (/디자인|예쁘|컬러|캐릭터|애니|모션|배경|톤/.test(text)) {
    targets.add("designer");
  }
  if (/배포|빌드|운영|로그|모니터|인프라|파이프라인/.test(text)) {
    targets.add("platform");
  }

  if (targets.size === 0) {
    return ["pm", "frontend", "backend", "qa"];
  }

  if (targets.has("frontend") || targets.has("backend")) {
    targets.add("qa");
  }
  if (targets.has("designer")) {
    targets.add("frontend");
  }

  return [...targets];
}

function getDistributedTitle(command, roleKey) {
  const brief = command.length > 24 ? `${command.slice(0, 24)}...` : command;
  const prefixes = {
    pm: "요구사항 정리",
    frontend: "화면 구현",
    backend: "기능 연결",
    qa: "검증 계획",
    designer: "시각 정리",
    platform: "운영 점검",
  };

  return `${prefixes[roleKey] ?? "작업"}: ${brief}`;
}

function getAssignmentReason(roleKey) {
  const reasons = {
    pm: "요구사항과 우선순위를 먼저 정리해야 합니다.",
    frontend: "사용자가 보는 화면과 상호작용을 구현해야 합니다.",
    backend: "데이터 흐름과 API 연결이 필요합니다.",
    qa: "분배된 작업의 회귀/완료 기준을 검증해야 합니다.",
    designer: "화면 톤, 여백, 모션의 품질을 다듬어야 합니다.",
    platform: "빌드, 배포, 운영 안정성 확인이 필요합니다.",
  };

  return reasons[roleKey] ?? "CTO가 실행이 필요하다고 판단했습니다.";
}

function getDependencies(roleKey, targets) {
  if (roleKey === "qa") {
    return targets.filter((target) => target !== "qa");
  }
  if (roleKey === "frontend" && targets.includes("designer")) {
    return ["designer"];
  }
  if (roleKey === "platform") {
    return targets.filter((target) => ["frontend", "backend"].includes(target));
  }
  return [];
}

function createLocalCtoPlan(command) {
  const targets = getDistributionTargets(command);
  const priority = /급|빨리|오늘|장애|오류|막힘|긴급/.test(command) ? "high" : "normal";
  const id = `plan-${Date.now()}`;

  return {
    id,
    command,
    summary: command.length > 34 ? `${command.slice(0, 34)}...` : command,
    priority,
    estimatedSteps: targets.length + 1,
    assignments: targets.map((roleKey, index) => ({
      id: `${id}-${roleKey}`,
      roleKey,
      roleShortName: roleShortNames[roleKey] ?? roleKey,
      title: getDistributedTitle(command, roleKey),
      reason: getAssignmentReason(roleKey),
      dependencies: getDependencies(roleKey, targets),
      status: index === 0 ? "in_progress" : "todo",
    })),
  };
}

function normalizeCtoPlan(command, rawPlan) {
  const id = `plan-${Date.now()}`;
  const assignments = Array.isArray(rawPlan.assignments)
    ? rawPlan.assignments.filter((assignment) => roleShortNames[assignment.roleKey])
    : [];

  if (assignments.length === 0) {
    throw new Error("Codex returned no valid assignments.");
  }

  const hasActiveAssignment = assignments.some((assignment) => assignment.status !== "todo");

  return {
    id,
    command,
    summary: String(rawPlan.summary || command).slice(0, 80),
    priority: rawPlan.priority === "high" ? "high" : "normal",
    estimatedSteps: Number.isInteger(rawPlan.estimatedSteps)
      ? rawPlan.estimatedSteps
      : assignments.length + 1,
    assignments: assignments.map((assignment, index) => ({
      id: `${id}-${assignment.roleKey}`,
      roleKey: assignment.roleKey,
      roleShortName: roleShortNames[assignment.roleKey],
      title: String(assignment.title || getDistributedTitle(command, assignment.roleKey)).slice(0, 96),
      reason: String(assignment.reason || getAssignmentReason(assignment.roleKey)).slice(0, 160),
      dependencies: Array.isArray(assignment.dependencies)
        ? assignment.dependencies.filter((dependency) => roleShortNames[dependency])
        : [],
      status: hasActiveAssignment
        ? assignment.status
        : index === 0
          ? "in_progress"
          : "todo",
    })),
  };
}

function createCtoPrompt(command, workspace) {
  return `You are the CTO main agent for a Korean pixel-art Codex office UI.

Create a concise work distribution plan for the user's command.
Return only JSON that matches the provided output schema.
Do not edit files, do not run shell commands, and do not include markdown.

Available subagents:
- pm: requirements, priority, scope, documentation
- frontend: React UI, interaction, layout, client state
- backend: local server, API, data flow, integrations
- qa: tests, regression checks, acceptance criteria
- designer: visual direction, pixel assets, spacing, motion
- platform: build, scripts, runtime, deployment readiness

Rules:
- Pick only the roles that are useful for this command.
- Include qa when implementation work should be verified.
- Use Korean for title and reason.
- Set exactly one first actionable assignment to "in_progress" unless the task is blocked.
- Keep titles short enough for a compact UI card.

Workspace:
${JSON.stringify(workspace, null, 2)}

User command:
${command}`;
}

function runCodexPlanner(prompt) {
  return new Promise((resolve, reject) => {
    mkdtemp(join(tmpdir(), "codex-cto-"))
      .then((tempDir) => {
        const outputFile = join(tempDir, "last-message.json");
        const args = [
          "exec",
          "-",
          "--cd",
          workspaceRoot,
          "--sandbox",
          "read-only",
          "--output-schema",
          ctoPlanSchemaPath.pathname,
          "--output-last-message",
          outputFile,
          "--color",
          "never",
        ];
        const child = spawn(codexBinary, args, {
          cwd: workspaceRoot,
          env: process.env,
          stdio: ["pipe", "ignore", "pipe"],
        });
        let stderr = "";
        let settled = false;
        const cleanup = () => rm(tempDir, { recursive: true, force: true }).catch(() => {});
        const timer = setTimeout(() => {
          if (!settled) {
            settled = true;
            child.kill("SIGTERM");
            cleanup();
            reject(new Error(`codex exec timed out after ${codexTimeoutMs}ms`));
          }
        }, codexTimeoutMs);

        child.stderr.on("data", (chunk) => {
          stderr += chunk.toString();
        });
        child.on("error", (error) => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            cleanup();
            reject(error);
          }
        });
        child.on("close", async (code) => {
          if (settled) {
            return;
          }
          settled = true;
          clearTimeout(timer);
          if (code !== 0) {
            cleanup();
            reject(new Error(stderr.trim() || `codex exec exited with code ${code}`));
            return;
          }
          try {
            const output = await readFile(outputFile, "utf8");
            resolve(output.trim());
          } catch (error) {
            reject(error);
          } finally {
            cleanup();
          }
        });

        child.stdin.end(prompt);
      })
      .catch(reject);
  });
}

function parseCodexJson(output) {
  try {
    return JSON.parse(output);
  } catch {
    const match = output.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("Codex did not return JSON.");
    }
    return JSON.parse(match[0]);
  }
}

async function createCodexCtoPlan(command, workspace) {
  const output = await runCodexPlanner(createCtoPrompt(command, workspace));
  return normalizeCtoPlan(command, parseCodexJson(output));
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

    if (request.method === "POST" && url.pathname === "/api/cto/plan") {
      const body = await readBody(request);
      const command = String(body.command ?? "").trim();
      if (!command) {
        sendJson(response, 400, { ok: false, error: "command is required" });
        return;
      }

      const workspace = await getWorkspace();
      try {
        const plan = await createCodexCtoPlan(command, workspace);
        sendJson(response, 200, { ok: true, planner: "codex-cli", plan });
      } catch (error) {
        const plan = createLocalCtoPlan(command);
        sendJson(response, 200, {
          ok: true,
          planner: "local-fallback",
          fallbackReason: error.message,
          plan,
        });
      }
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
