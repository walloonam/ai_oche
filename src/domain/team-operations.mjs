export const TASK_STATUSES = Object.freeze([
  "todo",
  "in_progress",
  "in_review",
  "blocked",
  "done",
]);

export const ROLE_KEYS = Object.freeze([
  "cto",
  "backend",
  "frontend",
  "qa",
  "reviewer",
]);

export const TEAM_ROLES = Object.freeze([
  {
    key: "cto",
    name: "CTO",
    character: "strategy_cat",
    specialty: "task_split, priority, approval_flow",
  },
  {
    key: "backend",
    name: "Backend Engineer",
    character: "server_dragon",
    specialty: "data_model, transition_rules, error_handling",
  },
  {
    key: "frontend",
    name: "Frontend Engineer",
    character: "ui_fox",
    specialty: "state_visibility, card_layout, flow",
  },
  {
    key: "qa",
    name: "QA Engineer",
    character: "validation_owl",
    specialty: "regression_checks, edge_cases",
  },
  {
    key: "reviewer",
    name: "Reviewer",
    character: "review_panda",
    specialty: "stability, maintainability, risk_review",
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
    title: "Operations board layout",
    status: "in_progress",
    ownerRole: "frontend",
    assignee: "Frontend Engineer",
    approval: {
      state: "pending",
      byRole: "reviewer",
      reason: "layout and status badges need a joint review",
    },
    blocker: null,
    risk: {
      level: "medium",
      label: "too much information density",
    },
    outputs: ["single screen board", "status cards", "workflow timeline"],
  },
  {
    id: "item-02",
    title: "State transition rules",
    status: "done",
    ownerRole: "backend",
    assignee: "Backend Engineer",
    approval: {
      state: "approved",
      byRole: "cto",
      reason: "transition rules are compact and unambiguous",
    },
    blocker: null,
    risk: {
      level: "low",
      label: "limited change scope",
    },
    outputs: ["transition map", "validation function", "sample data"],
  },
  {
    id: "item-03",
    title: "Regression checklist",
    status: "in_review",
    ownerRole: "qa",
    assignee: "QA Engineer",
    approval: {
      state: "pending",
      byRole: "reviewer",
      reason: "blocked and done transition cases need more review",
    },
    blocker: "resume condition after done is not documented",
    risk: {
      level: "medium",
      label: "possible edge-case gap",
    },
    outputs: ["validation checklist", "edge-case scenarios"],
  },
  {
    id: "item-04",
    title: "Blocked reason standard",
    status: "blocked",
    ownerRole: "cto",
    assignee: "CTO",
    approval: {
      state: "pending",
      byRole: "qa",
      reason: "blocked reason taxonomy needs alignment",
    },
    blocker: "risk labels are displayed inconsistently across roles",
    risk: {
      level: "high",
      label: "no shared standard",
    },
    outputs: ["blocked reason tags", "approval criteria"],
  },
]);

export function isKnownStatus(status) {
  return TASK_STATUSES.includes(status);
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
