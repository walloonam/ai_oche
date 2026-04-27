import React, { useEffect, useMemo, useState } from "react";
import {
  STATUS_LABELS,
  TASK_STATUSES,
  TEAM_ROLES,
  TEAM_WORK_ITEMS,
  getAllowedNextStatuses,
} from "./domain/team-operations.mjs";

import backendCharacter from "../assets/ai-characters/backend.png";
import ctoCharacter from "../assets/ai-characters/cto.png";
import designerCharacter from "../assets/ai-characters/designer.png";
import frontendCharacter from "../assets/ai-characters/frontend.png";
import platformCharacter from "../assets/ai-characters/platform.png";
import pmCharacter from "../assets/ai-characters/pm.png";
import qaCharacter from "../assets/ai-characters/qa.png";

const ROLE_IMAGES = {
  cto: ctoCharacter,
  pm: pmCharacter,
  frontend: frontendCharacter,
  backend: backendCharacter,
  qa: qaCharacter,
  designer: designerCharacter,
  platform: platformCharacter,
};

const STATUS_COPY = {
  todo: "대기",
  in_progress: "작업중",
  in_review: "검토중",
  blocked: "막힘",
  done: "완료",
};

const AGENT_POSITIONS = {
  pm: "agent-pm",
  frontend: "agent-frontend",
  backend: "agent-backend",
  qa: "agent-qa",
  designer: "agent-designer",
  platform: "agent-platform",
};

const DEFAULT_MESSAGES = [
  {
    id: "msg-01",
    from: "system",
    text: "Codex 메인 에이전트가 CTO 데스크에 연결되었습니다.",
  },
  {
    id: "msg-02",
    from: "cto",
    text: "나에게 지시하면 필요한 서브에이전트를 골라 작업을 분배하겠습니다.",
  },
];

const WORKSPACE_INFO = {
  path: "/root/ai_oche",
  branch: "main",
  status: "prototype changes",
  framework: "Vite + React",
  packageManager: "npm",
};

const CODEX_CAPABILITIES = [
  { key: "read", label: "Read Code", detail: "파일/구조 읽기" },
  { key: "edit", label: "Edit Files", detail: "패치 작성" },
  { key: "test", label: "Run Tests", detail: "테스트 실행" },
  { key: "build", label: "Build", detail: "빌드 검증" },
  { key: "review", label: "Review Diff", detail: "변경 검토" },
  { key: "commit", label: "Commit", detail: "작업 저장" },
];

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function getRole(roleKey) {
  return TEAM_ROLES.find((role) => role.key === roleKey) ?? TEAM_ROLES[0];
}

function getStatusCopy(status) {
  return STATUS_COPY[status] ?? STATUS_LABELS[status] ?? status;
}

function createInitialTaskQueues() {
  const queues = Object.fromEntries(
    TEAM_ROLES.filter((role) => role.key !== "cto").map((role) => [role.key, []]),
  );

  TEAM_WORK_ITEMS.filter((item) => item.status !== "done").forEach((item) => {
    queues[item.ownerRole] = [...(queues[item.ownerRole] ?? []), item];
  });

  return queues;
}

function getQueueItems(taskQueues) {
  return Object.values(taskQueues).flat();
}

function getCurrentTask(roleKey, taskQueues) {
  const queue = taskQueues[roleKey] ?? [];
  return (
    queue.find((item) => ["in_progress", "in_review", "blocked"].includes(item.status)) ??
    queue.find((item) => item.status === "todo") ??
    queue[0]
  );
}

function countByStatus(items) {
  return items.reduce((counts, item) => {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
    return counts;
  }, {});
}

function AgentSprite({ role, active = false, size = "md" }) {
  return (
    <div className={classNames("agent-sprite", `agent-sprite--${size}`, active && "is-working")}>
      <img src={ROLE_IMAGES[role.key]} alt="" className="pixel" />
    </div>
  );
}

function StatusPill({ status }) {
  return <span className={classNames("status-pill", `status-${status}`)}>{getStatusCopy(status)}</span>;
}

function SubAgentDesk({ role, task, queueCount, selected, onSelect }) {
  const isWorking = Boolean(task && task.status !== "todo" && task.status !== "done");
  const nextStatuses = task ? getAllowedNextStatuses(task.status).map(getStatusCopy).join(" / ") : "대기";

  return (
    <button
      type="button"
      className={classNames(
        "sub-agent",
        AGENT_POSITIONS[role.key],
        selected && "is-selected",
        isWorking && "is-working",
      )}
      onClick={() => onSelect(role.key)}
    >
      <span className="desk-monitor">
        <span />
      </span>
      <AgentSprite role={role} active={isWorking} />
      <span className="sub-agent__name">{role.shortName}</span>
      <span className="sub-agent__queue">큐 {queueCount}</span>
      <span className="sub-agent__task">{task?.title ?? "작업 대기"}</span>
      {task ? <StatusPill status={task.status} /> : null}
      <span className="sub-agent__next">next: {nextStatuses || "없음"}</span>
    </button>
  );
}

function TaskTicket({ item, active }) {
  const role = getRole(item.ownerRole);

  return (
    <div className={classNames("task-ticket", active && "is-active")}>
      <div>
        <strong>{item.title}</strong>
        <span>{role.name}</span>
      </div>
      <StatusPill status={item.status} />
    </div>
  );
}

function PlanCard({ plan, codexRunning, onRunCodex }) {
  if (!plan) {
    return (
      <div className="plan-card plan-card--empty">
        <strong>CTO 계획 대기</strong>
        <span>채팅으로 지시하면 CTO가 역할별 작업 계획을 생성합니다.</span>
      </div>
    );
  }

  return (
    <div className="plan-card">
      <div className="plan-card__top">
        <div>
          <strong>{plan.summary}</strong>
          <span>
            {plan.planner === "codex-cli" ? "Codex CLI" : "Local"} · 우선순위{" "}
            {plan.priority === "high" ? "높음" : "보통"} · {plan.estimatedSteps}단계
          </span>
        </div>
        <span>{plan.assignments.length}개 배정</span>
      </div>
      <div className="plan-card__actions">
        <button type="button" onClick={onRunCodex} disabled={codexRunning}>
          {codexRunning ? "Running..." : "Execute with Codex"}
        </button>
      </div>
      <div className="plan-list">
        {plan.assignments.map((assignment) => (
          <div key={`${plan.id}-${assignment.roleKey}`}>
            <b>{getRole(assignment.roleKey).shortName}</b>
            <span>{assignment.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkspacePanel({
  workspace,
  capabilityState,
  workspaceDraft,
  workspaceChanging,
  onWorkspaceDraftChange,
  onChangeWorkspace,
  onRunCapability,
}) {
  const info = workspace ?? WORKSPACE_INFO;

  return (
    <section className="workspace-panel">
      <div className="workspace-panel__header">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>Codex 작업 공간</h2>
        </div>
      </div>

      <form className="workspace-selector" onSubmit={onChangeWorkspace}>
        <input
          value={workspaceDraft}
          onChange={(event) => onWorkspaceDraftChange(event.target.value)}
          placeholder={info.path}
          aria-label="Workspace path"
        />
        <button type="submit" disabled={workspaceChanging}>
          {workspaceChanging ? "..." : "Change"}
        </button>
      </form>

      <div className="workspace-path">{info.path}</div>

      <div className="workspace-meta">
        <span>branch {info.branch}</span>
        <span>{info.status}</span>
        <span>{info.framework}</span>
        <span>{info.packageManager}</span>
      </div>

      <div className="capability-grid" aria-label="Codex capabilities">
        {CODEX_CAPABILITIES.map((capability) => (
          <button
            key={capability.key}
            type="button"
            className="capability-button"
            disabled={capabilityState.running === capability.key}
            onClick={() => onRunCapability(capability.key)}
          >
            <strong>{capability.label}</strong>
            <span>{capability.detail}</span>
          </button>
        ))}
      </div>

      <div className="agent-output">
        <span>{capabilityState.command ?? "agent server"}</span>
        <pre>{capabilityState.output ?? "Codex capability output will appear here."}</pre>
      </div>
    </section>
  );
}

export default function App() {
  const [focusedAgentKey, setFocusedAgentKey] = useState("frontend");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState(DEFAULT_MESSAGES);
  const [taskQueues, setTaskQueues] = useState(createInitialTaskQueues);
  const [lastDistributedKeys, setLastDistributedKeys] = useState(["frontend"]);
  const [lastPlan, setLastPlan] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [workspaceDraft, setWorkspaceDraft] = useState("");
  const [workspaceChanging, setWorkspaceChanging] = useState(false);
  const [codexRunning, setCodexRunning] = useState(false);
  const [capabilityState, setCapabilityState] = useState({
    running: null,
    command: null,
    output: null,
  });

  const subAgents = TEAM_ROLES.filter((role) => role.key !== "cto");
  const focusedAgent = getRole(focusedAgentKey);
  const focusedTask = getCurrentTask(focusedAgentKey, taskQueues);
  const focusedQueue = taskQueues[focusedAgentKey] ?? [];
  const allQueueItems = useMemo(() => getQueueItems(taskQueues), [taskQueues]);
  const statusCounts = useMemo(() => countByStatus(allQueueItems), [allQueueItems]);
  const activeCount = subAgents.filter((role) => {
    const task = getCurrentTask(role.key, taskQueues);
    return task && task.status !== "todo" && task.status !== "done";
  }).length;

  useEffect(() => {
    let active = true;

    fetch("/api/workspace")
      .then((response) => response.json())
      .then((payload) => {
        if (active && payload.ok) {
          setWorkspace(payload.workspace);
          setWorkspaceDraft(payload.workspace.path);
        }
      })
      .catch(() => {
        if (active) {
          setCapabilityState((current) => ({
            ...current,
            command: "agent server",
            output: "Local agent server is not connected yet. Run `npm run agent`.",
          }));
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function runCapability(capability) {
    setCapabilityState({
      running: capability,
      command: capability,
      output: "Running...",
    });

    try {
      const response = await fetch("/api/capabilities/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capability }),
      });
      const payload = await response.json();
      setCapabilityState({
        running: null,
        command: payload.result?.command ?? capability,
        output: payload.result?.output || "No output.",
      });
      fetch("/api/workspace")
        .then((workspaceResponse) => workspaceResponse.json())
        .then((workspacePayload) => {
          if (workspacePayload.ok) {
            setWorkspace(workspacePayload.workspace);
            setWorkspaceDraft(workspacePayload.workspace.path);
          }
        })
        .catch(() => {});
    } catch (error) {
      setCapabilityState({
        running: null,
        command: capability,
        output: error.message,
      });
    }
  }

  async function changeWorkspace(event) {
    event.preventDefault();
    const path = workspaceDraft.trim();
    if (!path) {
      return;
    }

    setWorkspaceChanging(true);
    setCapabilityState({
      running: "workspace",
      command: "workspace select",
      output: `Switching workspace to ${path}...`,
    });

    try {
      const response = await fetch("/api/workspace/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const payload = await response.json();
      if (!payload.ok) {
        throw new Error(payload.error ?? "Failed to change workspace.");
      }

      setWorkspace(payload.workspace);
      setWorkspaceDraft(payload.workspace.path);
      setLastPlan(null);
      setLastDistributedKeys([]);
      setCapabilityState({
        running: null,
        command: "workspace select",
        output: `Workspace changed to ${payload.workspace.path}`,
      });
      setMessages((current) => [
        ...current,
        {
          id: `workspace-${Date.now()}`,
          from: "system",
          text: `작업공간을 ${payload.workspace.path}로 변경했습니다.`,
        },
      ]);
    } catch (error) {
      setCapabilityState({
        running: null,
        command: "workspace select",
        output: error.message,
      });
    } finally {
      setWorkspaceChanging(false);
    }
  }

  async function requestCtoPlan(command) {
    const response = await fetch("/api/cto/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    });
    const payload = await response.json();
    if (!payload.ok) {
      throw new Error(payload.error ?? "Failed to create CTO plan.");
    }
    return {
      ...payload.plan,
      planner: payload.planner,
      fallbackReason: payload.fallbackReason,
    };
  }

  function createTasksFromPlan(plan) {
    return plan.assignments.map((assignment) => {
        const role = getRole(assignment.roleKey);
        return {
            id: assignment.id,
            title: assignment.title,
            status: assignment.status,
            ownerRole: assignment.roleKey,
            assignee: role.name,
            reason: assignment.reason,
            dependencies: assignment.dependencies,
            approval: {
              state: plan.planner === "codex-json" ? "approved" : "pending",
              byRole: "cto",
              reason:
                plan.planner === "codex-json"
                  ? "mirrored from Codex JSON event stream"
                  : "distributed by CTO main agent",
            },
            blocker: null,
            risk: {
              level: plan.planner === "codex-json" ? "low" : "medium",
              label:
                plan.planner === "codex-json"
                  ? "actual Codex event"
                  : "new command requires coordination",
            },
            outputs: plan.planner === "codex-json" ? ["codex json event"] : ["agent response", "task update"],
          };
      });
  }

  function applyPlanToQueues(plan) {
    const targets = plan.assignments.map((assignment) => assignment.roleKey);
    const createdTasks = createTasksFromPlan(plan);

    setTaskQueues((current) => {
      const next = { ...current };
      createdTasks.forEach((item) => {
        next[item.ownerRole] = [item, ...(next[item.ownerRole] ?? [])];
      });
      return next;
    });
    setLastDistributedKeys(targets);
    setFocusedAgentKey(targets[0]);
    setLastPlan(plan);

    return targets;
  }

  function formatCodexEvents(events) {
    return events
      .slice(-12)
      .map((event) => {
        const itemType = event.item?.type ? `:${event.item.type}` : "";
        const text = event.item?.command ?? event.item?.text ?? event.type;
        return `${event.type}${itemType} ${String(text).slice(0, 120)}`;
      })
      .join("\n");
  }

  async function runCodexExecution() {
    const command = lastPlan?.command;
    if (!command) {
      return;
    }

    setCodexRunning(true);
    setCapabilityState({
      running: "codex-run",
      command: "codex exec --json",
      output: "Running Codex event stream...",
    });

    try {
      const response = await fetch("/api/codex/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command, sandbox: "workspace-write" }),
      });
      const payload = await response.json();
      if (!payload.ok) {
        throw new Error(payload.error ?? "Codex execution failed.");
      }

      const plan = {
        ...payload.plan,
        planner: payload.planner,
      };
      const targets = applyPlanToQueues(plan);
      setWorkspace(payload.workspace);
      setWorkspaceDraft(payload.workspace.path);
      setCapabilityState({
        running: null,
        command: `codex exec --json (${payload.sandbox})`,
        output: formatCodexEvents(payload.events),
      });
      setMessages((current) => [
        ...current,
        {
          id: `codex-run-${Date.now()}`,
          from: "cto",
          text: `Codex 실제 실행 이벤트 ${payload.eventCount}개를 ${targets.map((roleKey) => getRole(roleKey).shortName).join(", ")} 큐에 반영했습니다.`,
        },
      ]);
    } catch (error) {
      setCapabilityState({
        running: null,
        command: "codex exec --json",
        output: error.message,
      });
      setMessages((current) => [
        ...current,
        {
          id: `codex-run-error-${Date.now()}`,
          from: "system",
          text: `Codex execution error: ${error.message}`,
        },
      ]);
    } finally {
      setCodexRunning(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, from: "user", text },
    ]);
    setDraft("");

    requestCtoPlan(text)
      .then((plan) => {
        const targets = applyPlanToQueues(plan);

        setMessages((current) => [
          ...current,
          {
            id: `cto-${Date.now()}`,
            from: "cto",
            text: `${plan.planner === "codex-cli" ? "Codex CLI로" : "로컬 백업으로"} 계획을 만들었습니다. ${targets.map((roleKey) => getRole(roleKey).shortName).join(", ")}에게 ${plan.assignments.length}개 작업을 큐에 넣었습니다.`,
          },
        ]);
      })
      .catch((error) => {
        setMessages((current) => [
          ...current,
          {
            id: `cto-error-${Date.now()}`,
            from: "system",
            text: `CTO planner server error: ${error.message}`,
          },
        ]);
      });
  }

  return (
    <main className="office-app">
      <header className="office-header">
        <div>
          <p className="eyebrow">AI Agent Office</p>
          <h1>Codex 지휘실</h1>
        </div>
        <div className="office-stats">
          <span>서브에이전트 {subAgents.length}</span>
          <span>작업중 {activeCount}</span>
          <span>막힘 {statusCounts.blocked ?? 0}</span>
        </div>
      </header>

      <section className="office-floorplan">
        <section className="cto-zone" aria-label="메인 Codex 연결 영역">
          <div className="office-window">
            <span />
            <span />
            <span />
          </div>

          <div className="cto-desk">
            <div className="cto-screen">
              <span>CODEX</span>
              <strong>MAIN ONLINE</strong>
            </div>
            <AgentSprite role={getRole("cto")} size="lg" active />
            <div className="desk-surface">
              <span className="keyboard" />
              <span className="coffee" />
            </div>
          </div>

          <WorkspacePanel
            workspace={workspace}
            capabilityState={capabilityState}
            workspaceDraft={workspaceDraft}
            workspaceChanging={workspaceChanging}
            onWorkspaceDraftChange={setWorkspaceDraft}
            onChangeWorkspace={changeWorkspace}
            onRunCapability={runCapability}
          />

          <section className="chat-console">
            <div className="chat-console__header">
              <div>
                <p className="eyebrow">Command Chat</p>
                <h2>나 → CTO 메인 에이전트</h2>
              </div>
              <span>자동 분배 모드</span>
            </div>

            <div className="chat-log" aria-live="polite">
              {messages.map((message) => (
                <div key={message.id} className={classNames("chat-message", `from-${message.from}`)}>
                  <span>{message.from === "user" ? "나" : message.from === "cto" ? "CTO" : "System"}</span>
                  <p>{message.text}</p>
                </div>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="CTO에게 지시할 내용을 입력하세요"
              />
              <button type="submit">Send</button>
            </form>
          </section>
        </section>

        <section className="agent-zone" aria-label="서브에이전트 사무실">
          <div className="agent-zone__header">
            <div>
              <p className="eyebrow">Sub Agents</p>
              <h2>오른쪽 작업 부스</h2>
            </div>
            <div className="status-legend">
              {TASK_STATUSES.map((status) => (
                <StatusPill key={status} status={status} />
              ))}
            </div>
          </div>

          <div className="agent-room">
            <div className="room-backdrop">
              <span className="shelf shelf-one" />
              <span className="shelf shelf-two" />
              <span className="plant" />
            </div>
            {subAgents.map((role) => (
              <SubAgentDesk
                key={role.key}
                role={role}
                task={getCurrentTask(role.key, taskQueues)}
                queueCount={(taskQueues[role.key] ?? []).length}
                selected={lastDistributedKeys.includes(role.key)}
                onSelect={setFocusedAgentKey}
              />
            ))}
          </div>

          <aside className="assignment-panel">
            <div>
              <p className="eyebrow">CTO Distribution</p>
              <h2>{focusedAgent.name}</h2>
              <p>{focusedAgent.mission}</p>
            </div>
            <PlanCard
              plan={lastPlan}
              codexRunning={codexRunning}
              onRunCodex={runCodexExecution}
            />
            <div className="queue-panel">
              <div className="specialty-list">
                {focusedAgent.specialties.map((specialty) => (
                  <span key={specialty}>{specialty}</span>
                ))}
              </div>
              <span className="queue-count">큐 {focusedQueue.length}</span>
            </div>
            {focusedTask ? (
              <TaskTicket item={focusedTask} active />
            ) : (
              <div className="empty-task">아직 배정된 작업이 없습니다.</div>
            )}
          </aside>
        </section>
      </section>
    </main>
  );
}
