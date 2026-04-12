import {
  TEAM_ROLES,
  TEAM_WORK_ITEMS,
  getAllowedNextStatuses,
} from "./domain/team-operations.mjs";

const summaryStrip = document.querySelector("#summary-strip");
const mainAgentPanel = document.querySelector("#main-agent-panel");
const partyGrid = document.querySelector("#party-grid");

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

const roleLabels = {
  cto: "CTO",
  backend: "백엔드",
  frontend: "프론트엔드",
  qa: "QA",
  reviewer: "디자이너",
};

const roleSpecialtiesKo = {
  cto: "일정 조율 / 우선순위 / 승인 흐름",
  backend: "데이터 모델 / 전환 규칙 / 오류 처리",
  frontend: "상태 가시성 / 화면 구성 / 흐름",
  qa: "회귀 점검 / 엣지 케이스",
  reviewer: "시각 톤 / 레이아웃 / 인터랙션",
};

const statusLabelsKo = {
  todo: "대기",
  in_progress: "진행중",
  in_review: "검토중",
  blocked: "막힘",
  done: "완료",
};

const approvalLabelsKo = {
  pending: "대기",
  approved: "승인",
  needs_changes: "수정 필요",
};

const itemLabelsKo = {
  "item-01": "운영 보드 배치",
  "item-02": "상태 전환 규칙",
  "item-03": "회귀 점검표",
  "item-04": "막힘 사유 표준",
};

const itemDetailsKo = {
  "item-01": "화면 배치와 상태 배지가 같이 보이도록 정리 중",
  "item-02": "전환 규칙이 짧고 명확하게 유지됨",
  "item-03": "막힘과 완료 전환 케이스를 다시 확인 중",
  "item-04": "막힘 사유 분류 기준을 맞추는 중",
};

const blockerLabelsKo = {
  "layout and status badges need a joint review": "레이아웃과 상태 배지를 함께 검토해야 합니다",
  "resume condition after done is not documented": "완료 이후 재개 조건이 문서화되지 않았습니다",
  "risk labels are displayed inconsistently across roles": "위험도 라벨이 역할마다 다르게 표시됩니다",
};

const approvalReasonKo = {
  "layout and status badges need a joint review": "레이아웃과 상태 배지를 같이 살펴봐야 합니다",
  "blocked and done transition cases need more review": "막힘과 완료 전환 케이스를 더 확인해야 합니다",
  "transition rules are compact and unambiguous": "전환 규칙이 짧고 명확합니다",
  "blocked reason taxonomy needs alignment": "막힘 사유 분류 기준을 맞춰야 합니다",
};

const outputLabelsKo = {
  "single screen board": "한 화면 보드",
  "status cards": "상태 카드",
  "workflow timeline": "흐름 타임라인",
  "transition map": "전환 맵",
  "validation function": "검증 함수",
  "sample data": "샘플 데이터",
  "validation checklist": "검증 점검표",
  "edge-case scenarios": "엣지 케이스 시나리오",
  "blocked reason tags": "막힘 사유 태그",
  "approval criteria": "승인 기준",
};

const roomLabelsKo = {
  main: "메인 사무실",
  compact: "개별 부스",
};

const pixelSprites = {
  strategy_cat: {
    outline: "#2a1e1a",
    skin: "#f6cfab",
    hair: "#3a2d2b",
    hat: "#c5a17a",
    robe: "#5a5f7a",
    accent: "#ffd59a",
    staff: "#e7b25c",
  },
  server_dragon: {
    outline: "#1f1c1b",
    skin: "#f7d1ad",
    hair: "#1f1c1b",
    hat: "#1f1c1b",
    robe: "#6b6b6b",
    accent: "#f06ad0",
    staff: "#caa78d",
  },
  ui_fox: {
    outline: "#2a1e1a",
    skin: "#f6cfab",
    hair: "#a05b2c",
    hat: "#7a5a3b",
    robe: "#8dd1ff",
    accent: "#ffe0a8",
    staff: "#6a4a2f",
  },
  validation_owl: {
    outline: "#2a1e1a",
    skin: "#f6cfab",
    hair: "#c7a17b",
    hat: "#c7a17b",
    robe: "#f1d4a3",
    accent: "#ffcc6a",
    staff: "#8b5a3d",
  },
  review_panda: {
    outline: "#1f1c1b",
    skin: "#f7d1ad",
    hair: "#6b5a52",
    hat: "#6b5a52",
    robe: "#f4d9a8",
    accent: "#f6b15a",
    staff: "#7a5436",
  },
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

function formatList(value) {
  return value.split(",").map((part) => part.trim()).join(" / ");
}

function getRoleLabel(roleKey) {
  return roleLabels[roleKey] ?? roleKey;
}

function getRoleSpecialty(roleKey) {
  return roleSpecialtiesKo[roleKey] ?? "";
}

function getStatusLabelKo(status) {
  return statusLabelsKo[status] ?? status;
}

function getApprovalLabelKo(state) {
  return approvalLabelsKo[state] ?? state;
}

function getItemLabel(item) {
  return itemLabelsKo[item.id] ?? item.title;
}

function getItemDetailKo(item) {
  return itemDetailsKo[item.id] ?? item.approval?.reason ?? "";
}

function getBlockerLabelKo(blocker) {
  return blockerLabelsKo[blocker] ?? blocker;
}

function getApprovalReasonKo(reason) {
  return approvalReasonKo[reason] ?? reason;
}

function getOutputLabelKo(output) {
  return outputLabelsKo[output] ?? output;
}

function svgRect(x, y, width, height, fill, rx = 0) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" />`;
}

function renderPixelPortrait(character, variant) {
  const theme = pixelSprites[character] ?? pixelSprites.strategy_cat;
  const compact = variant === "compact";
  const width = compact ? 48 : 56;
  const height = compact ? 48 : 56;
  const pieces = [];
  const add = (x, y, w, h, fill, rx = 0) => {
    pieces.push(svgRect(x, y, w, h, fill, rx));
  };

  const headX = compact ? 16 : 18;
  const headY = compact ? 8 : 10;
  const bodyX = compact ? 15 : 17;
  const bodyY = compact ? 18 : 21;
  const seatY = compact ? 27 : 30;

  add(headX - 1, headY - 1, compact ? 12 : 14, compact ? 10 : 11, theme.hair, 4);
  add(headX + 1, headY + 1, compact ? 7 : 8, compact ? 6 : 6, theme.skin, 2);
  add(headX + 2, headY + 2, 1, 1, theme.outline);
  add(headX + 5, headY + 2, 1, 1, theme.outline);
  add(headX + 3, headY + 4, 2, 1, theme.outline);
  add(headX + 2, headY + 5, 1, 1, theme.accent);

  add(headX + 3, headY + 7, 2, 1, theme.skin);
  add(bodyX - 1, bodyY, compact ? 11 : 12, compact ? 8 : 8, theme.shirt, 3);
  add(bodyX, bodyY + 1, compact ? 9 : 10, compact ? 6 : 6, theme.shirt, 2);
  add(bodyX - 1, bodyY + 1, 1, compact ? 5 : 5, theme.outline);
  add(bodyX + (compact ? 11 : 12), bodyY + 1, 1, compact ? 5 : 5, theme.outline);
  add(bodyX + 1, bodyY + 7, compact ? 8 : 9, 1, theme.outline);

  add(bodyX - 2, bodyY + 2, 2, 1, theme.outline);
  add(bodyX + (compact ? 11 : 12), bodyY + 2, 2, 1, theme.outline);
  add(bodyX - 1, bodyY + 3, 4, 1, theme.skin);
  add(bodyX + (compact ? 7 : 8), bodyY + 3, 4, 1, theme.skin);
  add(bodyX + 2, bodyY + 4, 2, 1, theme.outline);
  add(bodyX + 6, bodyY + 4, 2, 1, theme.outline);

  add(bodyX + 1, seatY, compact ? 3 : 4, compact ? 7 : 7, theme.pants, 1);
  add(bodyX + 5, seatY, compact ? 3 : 4, compact ? 7 : 7, theme.pants, 1);
  add(bodyX, seatY + 1, 1, compact ? 5 : 6, theme.outline);
  add(bodyX + (compact ? 7 : 8), seatY + 1, 1, compact ? 5 : 6, theme.outline);
  add(bodyX + 1, seatY + (compact ? 6 : 6), compact ? 4 : 5, 1, theme.outline);
  add(bodyX + 5, seatY + (compact ? 6 : 6), compact ? 4 : 5, 1, theme.outline);

  add(bodyX - 1, seatY + 4, compact ? 3 : 4, 1, theme.accent);
  add(bodyX + 5, seatY + 4, compact ? 3 : 4, 1, theme.accent);

  return `
    <svg
      class="portrait__sprite portrait__sprite--${variant}"
      viewBox="0 0 ${width} ${height}"
      aria-hidden="true"
      shape-rendering="crispEdges"
      preserveAspectRatio="xMidYMid meet"
    >
      ${pieces.join("")}
    </svg>
  `;
}

function renderOfficeScene(character, variant, label) {
  return `
    <div class="office-scene office-scene--${variant}">
      <div class="office-scene__label">${escapeHtml(label)}</div>
      <div class="office-scene__ceiling"></div>
      <div class="office-scene__window"></div>
      <div class="office-scene__wall-panel office-scene__wall-panel--left"></div>
      <div class="office-scene__wall-panel office-scene__wall-panel--right"></div>
      <div class="office-scene__desk"></div>
      <div class="office-scene__chair"></div>
      <div class="office-scene__sprite">${renderPixelPortrait(character, variant)}</div>
    </div>
  `;
}

function getSafeRoleKey(roleKey) {
  return validRoleKeys.has(roleKey) ? roleKey : fallbackRoleKey;
}

function getActiveRole() {
  const safeRoleKey = getSafeRoleKey(activeRole.key);

  if (activeRole.key !== safeRoleKey) {
    activeRole.key = safeRoleKey;
  }

  return TEAM_ROLES.find((role) => role.key === safeRoleKey) ?? TEAM_ROLES[0];
}

function getItemsByRole(roleKey) {
  return TEAM_WORK_ITEMS.filter((item) => item.ownerRole === roleKey);
}

function getPrimaryItem(roleKey) {
  return getItemsByRole(roleKey)[0] ?? null;
}

function getOtherRoles() {
  const currentRole = getActiveRole();
  return TEAM_ROLES.filter((role) => role.key !== currentRole.key);
}

function getSummaryStats() {
  const total = TEAM_WORK_ITEMS.length;
  const blocked = TEAM_WORK_ITEMS.filter((item) => item.status === "blocked").length;
  const approvals = TEAM_WORK_ITEMS.filter((item) => item.approval.state === "pending").length;

  return [
    { label: "팀", value: String(TEAM_ROLES.length) },
    { label: "작업", value: String(total) },
    { label: "승인 대기", value: String(approvals) },
    { label: "막힘", value: String(blocked) },
  ];
}

function renderSummary() {
  summaryStrip.innerHTML = getSummaryStats()
    .map(
      (stat) => `
        <div class="summary-chip">
          <span class="summary-chip__label">${escapeHtml(stat.label)}</span>
          <strong class="summary-chip__value">${escapeHtml(stat.value)}</strong>
        </div>
      `,
    )
    .join("");
}

function renderMainAgent() {
  const role = getActiveRole();
  const items = getItemsByRole(role.key);
  const primary = items[0];
  const nextStates = primary ? getAllowedNextStatuses(primary.status) : [];

  mainAgentPanel.innerHTML = `
    <article class="main-agent">
      <div class="main-agent__top">
        ${renderOfficeScene(role.character, "main", roomLabelsKo.main)}
        <div class="main-agent__identity">
          <p class="eyebrow">선택된 메인 에이전트</p>
          <h2 id="main-agent-title">${escapeHtml(getRoleLabel(role.key))}</h2>
          <p class="main-agent__specialty">${escapeHtml(getRoleSpecialty(role.key) || formatList(role.specialty))}</p>
          <p class="main-agent__line">
            ${escapeHtml(items.length ? `작업 ${items.length}개` : "새 작업을 기다리는 중")}
          </p>
        </div>
      </div>

      <div class="status-row" aria-label="현재 에이전트 상태">
        <span class="status-pill ${statusTone[primary?.status ?? "todo"]}">
          ${escapeHtml(getStatusLabelKo(primary?.status ?? "todo"))}
        </span>
        <span class="chip ${approvalTone[primary?.approval.state ?? "pending"]}">
          ${escapeHtml(getApprovalLabelKo(primary?.approval.state ?? "pending"))}
        </span>
        <span class="chip chip--risk">
          ${escapeHtml(`위험도 ${primary?.risk.level ?? "low"}`)}
        </span>
        <span class="chip chip--role">${escapeHtml(`직무 ${getRoleLabel(role.key)}`)}</span>
      </div>

      <div class="main-agent__arena">
        <section class="arena-card arena-card--objective">
          <p class="arena-card__label">지금 맡은 일</p>
          <strong class="arena-card__title">
            ${escapeHtml(getItemLabel(primary ?? { id: "", title: "지정된 작업 없음" }))}
          </strong>
          <p class="arena-card__body">
            ${escapeHtml(
              primary
                ? `${getRoleLabel(role.key)}가 ${getStatusLabelKo(primary.status)} 상태의 작업을 진행 중입니다.`
                : "이 에이전트는 다음 작업을 기다리는 중입니다.",
            )}
          </p>
          <p class="arena-card__fineprint">
            ${escapeHtml(primary ? getItemDetailKo(primary) : "")}
          </p>
        </section>

        <section class="arena-card">
          <p class="arena-card__label">막힘</p>
          <p class="arena-card__body">
            ${escapeHtml(primary?.blocker ? getBlockerLabelKo(primary.blocker) : "막힘 없음")}
          </p>
        </section>

        <section class="arena-card">
          <p class="arena-card__label">승인</p>
          <p class="arena-card__body">
            ${escapeHtml(primary?.approval.reason ? getApprovalReasonKo(primary.approval.reason) : "승인 신호를 기다리는 중")}
          </p>
          <p class="arena-card__fineprint">
            ${escapeHtml(`검토 담당: ${getRoleLabel(primary?.approval.byRole ?? "") || "미정"}`)}
          </p>
        </section>

        <section class="arena-card arena-card--outputs">
          <p class="arena-card__label">산출물</p>
          <div class="output-list">
            ${
              primary?.outputs?.length
                ? primary.outputs
                    .map(
                      (output) => `
                        <span class="output-pill">${escapeHtml(getOutputLabelKo(output))}</span>
                      `,
                    )
                    .join("")
                : '<span class="output-pill output-pill--empty">산출물 없음</span>'
            }
          </div>
        </section>
      </div>

      <div class="main-agent__footer">
        <div class="main-agent__next">
          <span class="arena-card__label">다음 이동</span>
          <p class="arena-card__body">
            ${escapeHtml(
              nextStates.length
                ? nextStates.map((state) => getStatusLabelKo(state)).join(" / ")
                : "이동 가능 상태 없음",
            )}
          </p>
        </div>

        <div class="main-agent__taskline">
          <span class="arena-card__label">작업 목록</span>
          <p class="arena-card__body">
            ${escapeHtml(
              items.length
                ? items.map((item) => getItemLabel(item)).join(" • ")
                : "새 작업을 기다리는 중",
            )}
          </p>
        </div>
      </div>
    </article>
  `;
}

function renderParty() {
  const party = getOtherRoles();

  partyGrid.innerHTML = party
    .map((role) => {
      return `
        <button
          class="party-card"
          type="button"
          data-role-key="${escapeHtml(role.key)}"
          aria-pressed="false"
        >
          ${renderOfficeScene(role.character, "compact", getRoleLabel(role.key))}
        </button>
      `;
    })
    .join("");
}

function attachEvents() {
  partyGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-role-key]");
    if (!trigger) {
      return;
    }

    const nextRoleKey = trigger.dataset.roleKey;
    if (!validRoleKeys.has(nextRoleKey)) {
      activeRole.key = fallbackRoleKey;
      renderAll();
      return;
    }

    activeRole.key = nextRoleKey;
    renderAll();
  });
}

function renderAll() {
  renderSummary();
  renderMainAgent();
  renderParty();
}

function init() {
  getActiveRole();
  renderAll();
  attachEvents();
}

init();
