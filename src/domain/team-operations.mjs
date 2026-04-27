export const TASK_STATUSES = Object.freeze([
  "todo",
  "in_progress",
  "in_review",
  "blocked",
  "done",
]);

export const ROLE_KEYS = Object.freeze([
  "cto",
  "pm",
  "frontend",
  "backend",
  "qa",
  "designer",
  "platform",
]);

export const TEAM_ROLES = Object.freeze([
  {
    key: "cto",
    shortName: "CTO",
    name: "CTO / Coordinator",
    mission: "작업 범위를 쪼개고 승인 흐름과 리스크를 조율합니다.",
    specialties: ["priority", "approval", "handoff"],
  },
  {
    key: "pm",
    shortName: "PM",
    name: "Planner / PM",
    mission: "일정과 요구사항을 정리하고 다음 의사결정을 명확히 만듭니다.",
    specialties: ["scope", "timeline", "decision"],
  },
  {
    key: "frontend",
    shortName: "FE",
    name: "Frontend Engineer",
    mission: "사용자 흐름, 상태 가시성, 인터랙션 품질을 책임집니다.",
    specialties: ["ui state", "layout", "accessibility"],
  },
  {
    key: "backend",
    shortName: "BE",
    name: "Backend Engineer",
    mission: "데이터 모델과 상태 전환 규칙을 안정적으로 관리합니다.",
    specialties: ["data model", "rules", "errors"],
  },
  {
    key: "qa",
    shortName: "QA",
    name: "QA Engineer",
    mission: "회귀 위험과 엣지 케이스를 찾아 릴리스 품질을 지킵니다.",
    specialties: ["regression", "edge cases", "release"],
  },
  {
    key: "designer",
    shortName: "Design",
    name: "Designer",
    mission: "정보 위계, 시각 톤, 화면 밀도를 조정합니다.",
    specialties: ["visual system", "density", "polish"],
  },
  {
    key: "platform",
    shortName: "Ops",
    name: "Platform Engineer",
    mission: "빌드, 배포, 운영 안정성에 필요한 기반을 점검합니다.",
    specialties: ["build", "deploy", "observability"],
  },
]);

export const TASK_STATUS_TRANSITIONS = Object.freeze({
  todo: ["in_progress", "blocked"],
  in_progress: ["in_review", "blocked", "todo"],
  in_review: ["in_progress", "done", "blocked"],
  blocked: ["in_progress", "todo"],
  done: ["in_review"],
});

export const STATUS_LABELS = Object.freeze({
  todo: "To Do",
  in_progress: "In Progress",
  in_review: "In Review",
  blocked: "Blocked",
  done: "Done",
});

export const APPROVAL_LABELS = Object.freeze({
  pending: "Pending",
  approved: "Approved",
  needs_changes: "Needs Changes",
});

export const RISK_LEVELS = Object.freeze(["low", "medium", "high"]);

export const TEAM_WORK_ITEMS = Object.freeze([
  {
    id: "item-01",
    title: "운영 보드 재구성",
    status: "in_progress",
    ownerRole: "frontend",
    assignee: "Frontend Engineer",
    approval: {
      state: "pending",
      byRole: "designer",
      reason: "layout density and hierarchy need a paired review",
    },
    blocker: null,
    risk: {
      level: "medium",
      label: "too much information can compete for attention",
    },
    outputs: ["responsive board", "role rail", "task detail panel"],
  },
  {
    id: "item-02",
    title: "상태 전환 규칙",
    status: "done",
    ownerRole: "backend",
    assignee: "Backend Engineer",
    approval: {
      state: "approved",
      byRole: "cto",
      reason: "transition map is compact and testable",
    },
    blocker: null,
    risk: {
      level: "low",
      label: "small blast radius",
    },
    outputs: ["transition map", "validator", "summary helper"],
  },
  {
    id: "item-03",
    title: "회귀 점검표",
    status: "in_review",
    ownerRole: "qa",
    assignee: "QA Engineer",
    approval: {
      state: "pending",
      byRole: "cto",
      reason: "blocked and done recovery paths need confirmation",
    },
    blocker: "done items can only reopen through review",
    risk: {
      level: "medium",
      label: "missed recovery path",
    },
    outputs: ["validation checklist", "transition scenarios"],
  },
  {
    id: "item-04",
    title: "막힘 사유 표준화",
    status: "blocked",
    ownerRole: "pm",
    assignee: "Planner / PM",
    approval: {
      state: "needs_changes",
      byRole: "qa",
      reason: "blocked labels need consistent wording",
    },
    blocker: "risk labels are displayed inconsistently across handoffs",
    risk: {
      level: "high",
      label: "ambiguous ownership",
    },
    outputs: ["blocked reason taxonomy", "handoff criteria"],
  },
  {
    id: "item-05",
    title: "스프라이트 자산 파이프라인",
    status: "todo",
    ownerRole: "platform",
    assignee: "Platform Engineer",
    approval: {
      state: "pending",
      byRole: "designer",
      reason: "asset import path should work in build output",
    },
    blocker: null,
    risk: {
      level: "low",
      label: "clear static asset surface",
    },
    outputs: ["asset imports", "sprite sheet preview"],
  },
  {
    id: "item-06",
    title: "시각 QA 점검",
    status: "in_progress",
    ownerRole: "designer",
    assignee: "Designer",
    approval: {
      state: "pending",
      byRole: "qa",
      reason: "mobile density and contrast should be checked together",
    },
    blocker: null,
    risk: {
      level: "medium",
      label: "small screens can crowd controls",
    },
    outputs: ["contrast pass", "mobile layout pass"],
  },
]);

export function isKnownStatus(status) {
  return TASK_STATUSES.includes(status);
}

export function isKnownRole(roleKey) {
  return ROLE_KEYS.includes(roleKey);
}

export function getAllowedNextStatuses(status) {
  return TASK_STATUS_TRANSITIONS[status] ? [...TASK_STATUS_TRANSITIONS[status]] : [];
}

export function canTransitionStatus(fromStatus, toStatus) {
  if (!isKnownStatus(fromStatus) || !isKnownStatus(toStatus)) {
    return false;
  }

  return TASK_STATUS_TRANSITIONS[fromStatus].includes(toStatus);
}

export function validateStatusTransition(fromStatus, toStatus) {
  const validFrom = isKnownStatus(fromStatus);
  const validTo = isKnownStatus(toStatus);

  if (!validFrom || !validTo) {
    return {
      ok: false,
      reason: "unknown-status",
      message: `Unknown status: ${!validFrom ? fromStatus : toStatus}`,
      fromStatus,
      toStatus,
    };
  }

  const allowed = TASK_STATUS_TRANSITIONS[fromStatus];
  if (!allowed.includes(toStatus)) {
    return {
      ok: false,
      reason: "invalid-transition",
      message: `${fromStatus} cannot transition to ${toStatus}.`,
      fromStatus,
      toStatus,
      allowedNext: [...allowed],
    };
  }

  return {
    ok: true,
    reason: "valid-transition",
    message: `${fromStatus} can transition to ${toStatus}.`,
    fromStatus,
    toStatus,
  };
}

export function assertStatusTransition(fromStatus, toStatus) {
  const result = validateStatusTransition(fromStatus, toStatus);
  if (!result.ok) {
    throw new Error(result.message);
  }

  return true;
}

export function getWorkItemSummary(item) {
  return {
    id: item.id,
    title: item.title,
    status: item.status,
    ownerRole: item.ownerRole,
    assignee: item.assignee,
    blocker: item.blocker,
    approvalState: item.approval?.state ?? "pending",
    riskLevel: item.risk?.level ?? "low",
  };
}
