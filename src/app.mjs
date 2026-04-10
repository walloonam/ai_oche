import {
  APPROVAL_LABELS,
  STATUS_LABELS,
  TEAM_ROLES,
  TEAM_WORK_ITEMS,
  getAllowedNextStatuses,
} from "./domain/team-operations.mjs";

const summaryStrip = document.querySelector("#summary-strip");
const roleGrid = document.querySelector("#role-grid");
const boardGrid = document.querySelector("#board-grid");
const detailPanel = document.querySelector("#detail-panel");

const statusOrder = ["todo", "in_progress", "in_review", "blocked", "done"];
const statusTone = {
  todo: "status--todo",
  in_progress: "status--progress",
  in_review: "status--review",
  blocked: "status--blocked",
  done: "status--done",
};

const approvalTone = {
  pending: "chip--pending",
  approved: "chip--approved",
  needs_changes: "chip--changes",
};

const characterGlyph = {
  strategy_cat: "SC",
  server_dragon: "SD",
  ui_fox: "UF",
  validation_owl: "VO",
  review_panda: "RP",
};

const validRoleKeys = new Set(TEAM_ROLES.map((role) => role.key));
const fallbackRoleKey = TEAM_ROLES[0]?.key ?? "cto";

const activeRole = {
  key: fallbackRoleKey,
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSafeRoleKey(roleKey) {
  return validRoleKeys.has(roleKey) ? roleKey : fallbackRoleKey;
}

function getItemsByRole(roleKey) {
  return TEAM_WORK_ITEMS.filter((item) => item.ownerRole === roleKey);
}

function getActiveRole() {
  const safeRoleKey = getSafeRoleKey(activeRole.key);

  if (activeRole.key !== safeRoleKey) {
    activeRole.key = safeRoleKey;
  }

  return TEAM_ROLES.find((role) => role.key === safeRoleKey) ?? TEAM_ROLES[0];
}

function getSummaryStats() {
  const total = TEAM_WORK_ITEMS.length;
  const blocked = TEAM_WORK_ITEMS.filter((item) => item.status === "blocked").length;
  const inFlight = TEAM_WORK_ITEMS.filter((item) =>
    ["in_progress", "in_review"].includes(item.status),
  ).length;
  const approvals = TEAM_WORK_ITEMS.filter((item) => item.approval.state === "pending").length;

  return [
    { label: "Total items", value: String(total) },
    { label: "In flight", value: String(inFlight) },
    { label: "Pending approvals", value: String(approvals) },
    { label: "Blocked", value: String(blocked) },
  ];
}

function renderSummary() {
  summaryStrip.innerHTML = getSummaryStats()
    .map(
      (stat) => `
        <article class="summary-card">
          <span class="summary-card__label">${escapeHtml(stat.label)}</span>
          <strong class="summary-card__value">${escapeHtml(stat.value)}</strong>
        </article>
      `,
    )
    .join("");
}

function renderRoles() {
  const currentRole = getActiveRole();

  roleGrid.innerHTML = TEAM_ROLES.map((role) => {
    const items = getItemsByRole(role.key);
    const primary = items[0];
    const blocked = items.filter((item) => item.status === "blocked").length;
    const selected = role.key === currentRole.key;

    return `
      <button
        class="role-card ${selected ? "is-active" : ""}"
        type="button"
        data-role-key="${escapeHtml(role.key)}"
        aria-pressed="${selected ? "true" : "false"}"
      >
        <span class="role-card__avatar">${escapeHtml(characterGlyph[role.character] ?? "AI")}</span>
        <span class="role-card__body">
          <span class="role-card__name">${escapeHtml(role.name)}</span>
          <span class="role-card__specialty">${escapeHtml(formatList(role.specialty))}</span>
          <span class="role-card__meta">
            <span class="status-pill ${statusTone[primary?.status ?? "todo"]}">
              ${escapeHtml(STATUS_LABELS[primary?.status ?? "todo"])}
            </span>
            <span class="role-card__count">${escapeHtml(`${items.length} item${items.length === 1 ? "" : "s"}`)}</span>
            <span class="role-card__count">${escapeHtml(`${blocked} blocked`)}</span>
          </span>
        </span>
      </button>
    `;
  }).join("");
}

function renderBoard() {
  boardGrid.innerHTML = statusOrder
    .map((status) => {
      const items = TEAM_WORK_ITEMS.filter((item) => item.status === status);
      return `
        <section class="board-column">
          <header class="board-column__header">
            <div>
              <p class="board-column__label">${escapeHtml(STATUS_LABELS[status])}</p>
              <strong class="board-column__count">${escapeHtml(items.length)}</strong>
            </div>
            <span class="status-pill ${statusTone[status]}">${escapeHtml(status.replace("_", " "))}</span>
          </header>
          <div class="board-column__items">
            ${
              items.length
                ? items
                    .map(
                      (item) => `
                        <article class="work-card">
                          <div class="work-card__header">
                            <p>${escapeHtml(item.title)}</p>
                            <span class="chip ${approvalTone[item.approval.state]}">
                              ${escapeHtml(APPROVAL_LABELS[item.approval.state])}
                            </span>
                          </div>
                          <p class="work-card__owner">${escapeHtml(item.assignee)}</p>
                          <p class="work-card__risk">${escapeHtml(`Risk: ${item.risk.level}`)}</p>
                          <p class="work-card__blocker">
                            ${escapeHtml(item.blocker ? `Blocker: ${item.blocker}` : "No active blocker")}
                          </p>
                        </article>
                      `,
                    )
                    .join("")
                : '<div class="work-card work-card--empty">No items in this state.</div>'
            }
          </div>
        </section>
      `;
    })
    .join("");
}

function renderDetail() {
  const role = getActiveRole();
  const items = getItemsByRole(role.key);
  const detailItems = items.length
    ? items
        .map((item) => {
          const nextStates = getAllowedNextStatuses(item.status);
          return `
            <section class="detail-item">
              <div class="detail-item__header">
                <div>
                  <p class="detail-item__title">${escapeHtml(item.title)}</p>
                  <p class="detail-item__owner">${escapeHtml(`Approval by ${item.approval.byRole}`)}</p>
                </div>
                <span class="status-pill ${statusTone[item.status]}">${escapeHtml(STATUS_LABELS[item.status])}</span>
              </div>
              <div class="detail-item__chips">
                <span class="chip ${approvalTone[item.approval.state]}">${escapeHtml(APPROVAL_LABELS[item.approval.state])}</span>
                <span class="chip chip--risk">${escapeHtml(`Risk ${item.risk.level}`)}</span>
              </div>
              <p class="detail-item__reason">${escapeHtml(item.approval.reason)}</p>
              <p class="detail-item__blocker">${escapeHtml(item.blocker ? `Blocker: ${item.blocker}` : "Blocker: none")}</p>
              <p class="detail-item__outputs">${escapeHtml(`Outputs: ${item.outputs.join(", ")}`)}</p>
              <p class="detail-item__next">${escapeHtml(`Next allowed: ${nextStates.map((state) => STATUS_LABELS[state]).join(", ") || "None"}`)}</p>
            </section>
          `;
        })
        .join("")
    : `
        <section class="detail-item">
          <p class="detail-item__title">${escapeHtml("No assigned work yet")}</p>
          <p class="detail-item__reason">
            ${escapeHtml("This role is ready to review approvals and risks, but no direct work item is assigned yet.")}
          </p>
          <p class="detail-item__next">${escapeHtml("Next allowed: wait for handoff or attach a review task.")}</p>
        </section>
      `;

  detailPanel.innerHTML = `
    <article class="detail-card">
      <div class="detail-card__intro">
        <span class="detail-card__avatar">${escapeHtml(characterGlyph[role.character] ?? "AI")}</span>
        <div>
          <p class="detail-card__eyebrow">${escapeHtml("Selected role")}</p>
          <h3>${escapeHtml(role.name)}</h3>
          <p class="detail-card__specialty">${escapeHtml(formatList(role.specialty))}</p>
        </div>
      </div>
      <p class="detail-card__directive">
        ${escapeHtml("Character first impression stays playful, but the real reading order is state, blocker, approval, then output.")}
      </p>
      <div class="detail-card__list">${detailItems}</div>
    </article>
  `;
}

function formatList(value) {
  return value.split(",").map((part) => part.trim()).join(" / ");
}

function attachEvents() {
  roleGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-role-key]");
    if (!trigger) {
      return;
    }

    const nextRoleKey = trigger.dataset.roleKey;
    if (!validRoleKeys.has(nextRoleKey)) {
      activeRole.key = fallbackRoleKey;
      renderRoles();
      renderDetail();
      return;
    }

    activeRole.key = nextRoleKey;
    renderRoles();
    renderDetail();
  });
}

function init() {
  getActiveRole();
  renderSummary();
  renderRoles();
  renderBoard();
  renderDetail();
  attachEvents();
}

init();
