import React, { useMemo, useState } from "react";

const roles = [
  {
    key: "cto",
    label: "CTO / Coordinator",
    file: "/assets/characters/cto.png",
    concept: "Broad-shouldered lead with a headset, calm stance, and a raised command hand.",
    tone: "Leadership",
    frame: "from-slate-100 via-[#e6ebf7] to-[#f5ede6]",
  },
  {
    key: "pm",
    label: "Planner / PM",
    file: "/assets/characters/pm.png",
    concept: "Busy organizer with a planner pad, shoulder strap, and quick step posture.",
    tone: "Scheduling",
    frame: "from-[#eef1de] via-[#f4ecd9] to-[#f7e2d6]",
  },
  {
    key: "frontend",
    label: "Frontend Engineer",
    file: "/assets/characters/frontend.png",
    concept: "Hoodie-wearing UI builder with a bright handheld screen and springy pose.",
    tone: "Interface",
    frame: "from-[#e4f5ff] via-[#f2efff] to-[#fff0f5]",
  },
  {
    key: "backend",
    label: "Backend Engineer",
    file: "/assets/characters/backend.png",
    concept: "Grounded systems dev with a chunky laptop rig, server badge, and steady stance.",
    tone: "Systems",
    frame: "from-[#e4e9f2] via-[#e7eef0] to-[#f4ede5]",
  },
  {
    key: "qa",
    label: "QA Engineer",
    file: "/assets/characters/qa.png",
    concept: "Precise checker silhouette with a clipboard, magnifier, and alert side glance.",
    tone: "Testing",
    frame: "from-[#f6e8f1] via-[#f3eefc] to-[#f9ece3]",
  },
  {
    key: "designer",
    label: "Designer",
    file: "/assets/characters/designer.png",
    concept: "Asymmetrical stylist with a palette, pen, and the boldest fashion silhouette.",
    tone: "Creative",
    frame: "from-[#ffe7de] via-[#fdebf2] to-[#fff0db]",
  },
];

const scaleOptions = [
  { label: "1x", value: 1 },
  { label: "2x", value: 2 },
  { label: "4x", value: 4 },
];

const backgroundOptions = [
  { label: "Cream", value: "bg-cream" },
  { label: "Mist", value: "bg-[#f6f0e6]" },
  { label: "Night", value: "bg-[#2b2420] text-white" },
];

const officeStats = [
  { label: "Agents", value: "6" },
  { label: "Tasks", value: "12" },
  { label: "Reviews", value: "3" },
  { label: "Blocked", value: "1" },
];

const officeStyles = {
  cto: {
    wall: "#f8f1e6",
    floor: "#f2dcc8",
    desk: "#e4b185",
    monitor: "#ccd8f0",
    accent: "#b28a5f",
    chair: "#5a5d78",
    wallDeco: "command",
    monitorView: "overview",
    propPrimary: "tablet",
    propSecondary: "notebook",
  },
  pm: {
    wall: "#f7efe8",
    floor: "#f0d8c6",
    desk: "#e0a97c",
    monitor: "#d7e6c4",
    accent: "#f2c377",
    chair: "#c9a07d",
    wallDeco: "planning",
    monitorView: "timeline",
    propPrimary: "notes",
    propSecondary: "calendar",
  },
  frontend: {
    wall: "#f6f0f4",
    floor: "#e9d6e2",
    desk: "#e1a1b6",
    monitor: "#cde8f6",
    accent: "#f2b6d0",
    chair: "#e2a1c4",
    wallDeco: "grid",
    monitorView: "ui",
    propPrimary: "components",
    propSecondary: "palette",
  },
  backend: {
    wall: "#efeef3",
    floor: "#d8d4e6",
    desk: "#9ba1c7",
    monitor: "#bcd0e6",
    accent: "#7580b8",
    chair: "#7e86a8",
    wallDeco: "infrastructure",
    monitorView: "terminal",
    propPrimary: "server",
    propSecondary: "cables",
  },
  qa: {
    wall: "#f5f2ea",
    floor: "#e7dbc8",
    desk: "#d2a56c",
    monitor: "#d6e8d3",
    accent: "#d7a05c",
    chair: "#c79a69",
    wallDeco: "checklist",
    monitorView: "bugs",
    propPrimary: "check",
    propSecondary: "warning",
  },
  designer: {
    wall: "#f7efe9",
    floor: "#edd8cf",
    desk: "#caa07a",
    monitor: "#f0d7e5",
    accent: "#e7b98c",
    chair: "#c08a6c",
    wallDeco: "moodboard",
    monitorView: "canvas",
    propPrimary: "pen",
    propSecondary: "swatches",
  },
};

const portraitThemes = {
  cto: {
    hair: "#392b26",
    accent: "#f1b867",
  },
  pm: {
    hair: "#6d5144",
    accent: "#f29c6b",
  },
  frontend: {
    hair: "#7d5339",
    accent: "#f6c453",
  },
  backend: {
    hair: "#2d2f35",
    accent: "#53d1c5",
  },
  qa: {
    hair: "#5f4a72",
    accent: "#f06793",
  },
  designer: {
    hair: "#cb7481",
    accent: "#f5c06d",
  },
};

function PixelRolePortrait({ role, size }) {
  const theme = portraitThemes[role.key] ?? portraitThemes.cto;
  const accessory = {
    cto: (
      <>
        <div className="absolute left-[31%] top-[26%] h-[8%] w-[7%] rounded-full bg-[#4e5673]" />
        <div className="absolute right-[31%] top-[26%] h-[8%] w-[7%] rounded-full bg-[#4e5673]" />
        <div className="absolute left-[31%] right-[31%] top-[23%] h-[4%] rounded-full border-[3px] border-b-0 border-[#4e5673]" />
        <div className="absolute right-[27%] top-[35%] h-[10%] w-[4%] rounded-full bg-[#f1b867]" />
      </>
    ),
    pm: (
      <>
        <div className="absolute right-[30%] top-[24%] h-[7%] w-[12%] rounded-full bg-[#f29c6b]" />
        <div className="absolute right-[33%] top-[26%] h-[3%] w-[6%] rounded-full bg-[#fff5ec]" />
      </>
    ),
    frontend: (
      <>
        <div className="absolute left-[28%] right-[28%] top-[21%] h-[10%] rounded-[999px_999px_12px_12px] border-[3px] border-b-0 border-[#46b8df]" />
        <div className="absolute right-[24%] top-[27%] h-[6%] w-[6%] rounded-full bg-[#f6c453]" />
      </>
    ),
    backend: (
      <>
        <div className="absolute left-[29%] right-[29%] top-[22%] h-[9%] rounded-[12px_12px_6px_6px] bg-[#2d2f35]" />
        <div className="absolute right-[25%] top-[34%] h-[7%] w-[7%] rounded-md bg-[#53d1c5]" />
      </>
    ),
    qa: (
      <>
        <div className="absolute left-[28%] right-[28%] top-[24%] h-[5%] rounded-full bg-[#f06793]" />
        <div className="absolute right-[25%] top-[30%] h-[7%] w-[7%] rounded-full border-[3px] border-[#baa6d1]" />
      </>
    ),
    designer: (
      <>
        <div className="absolute left-[26%] top-[19%] h-[15%] w-[18%] rounded-[14px_12px_18px_8px] bg-[#cb7481]" />
        <div className="absolute right-[26%] top-[24%] h-[6%] w-[10%] rounded-full bg-[#f5c06d]" />
      </>
    ),
  }[role.key];

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-b ${role.frame} shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_20px_35px_-26px_rgba(110,80,60,0.45)]`}
      style={{ width: size, height: size + 28 }}
    >
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-[#f8efe3] to-[#ecddca]" />
      <div className="absolute inset-x-[14%] bottom-[10%] h-[10%] rounded-full bg-[#c79669]/30 blur-md" />
      <div className="absolute right-[12%] top-[10%] h-[18%] w-[26%] rounded-2xl border border-white/70 bg-white/35 shadow-[inset_0_0_0_1px_rgba(160,130,110,0.08)]" />
      <div className="absolute inset-x-[10%] bottom-[2%] top-[18%]">
        <img src={role.file} alt={role.label} className="pixel h-full w-full object-contain" />
        <div
          className="absolute left-[24%] right-[24%] top-[18%] h-[10%] rounded-[16px_16px_8px_8px] opacity-80"
          style={{ background: theme.hair }}
        />
        {accessory}
      </div>
    </div>
  );
}

function OfficeScene({ role, size = "sm" }) {
  const style = officeStyles[role.key] ?? officeStyles.cto;
  return (
    <div
      className={`office-scene ${size === "lg" ? "office-scene-lg" : "office-scene-sm"}`}
      data-role={role.key}
      style={{
        "--scene-wall": style.wall,
        "--scene-floor": style.floor,
        "--scene-desk": style.desk,
        "--scene-monitor": style.monitor,
        "--scene-accent": style.accent,
        "--scene-chair": style.chair,
      }}
    >
      <div className="office-wall" />
      <div className="office-wall-deco" data-wall={style.wallDeco} />
      <div className="office-floor" />
      <div className="office-shadow" />
      <div className="office-desk">
        <div className="office-desk-edge" />
        <div className="office-desk-surface" />
        <div className="office-desk-handle" />
        <div className="office-keyboard" />
      </div>
      <div className="office-chair" />
      <div className="office-monitor">
        <span className="office-screen-glow" />
        <span className="office-cursor" />
        <span className="office-monitor-content" data-monitor={style.monitorView} />
      </div>
      {role.key === "cto" ? (
        <>
          <div className="office-cto-arm" />
          <div className="office-cto-arm office-cto-arm-secondary" />
        </>
      ) : null}
      {role.key === "pm" ? (
        <>
          <div className="office-planner-board" />
          <div className="office-notebook" />
          <div className="office-pen" />
          <div className="office-doc-stack" />
        </>
      ) : null}
      {role.key === "frontend" ? (
        <>
          <div className="office-monitor office-monitor-secondary">
            <span className="office-screen-glow" />
            <span className="office-monitor-content" data-monitor="ui" />
          </div>
          <div className="office-ui-board" />
          <div className="office-ui-cards" />
          <div className="office-ui-chip" />
          <div className="office-browser-bar" />
        </>
      ) : null}
      {role.key === "backend" ? (
        <>
          <div className="office-server-tower" />
          <div className="office-log-panel" />
          <div className="office-api-chip" />
        </>
      ) : null}
      {role.key === "qa" ? (
        <>
          <div className="office-qa-board" />
          <div className="office-qa-clipboard" />
          <div className="office-qa-magnifier" />
          <div className="office-qa-badge" />
        </>
      ) : null}
      {role.key === "designer" ? (
        <>
          <div className="office-designer-board" />
          <div className="office-tablet" />
          <div className="office-stylus" />
          <div className="office-swatch-strip" />
        </>
      ) : null}
      <div className="office-prop office-prop-primary" data-prop={style.propPrimary} />
      <div className="office-prop office-prop-secondary" data-prop={style.propSecondary} />
      <div className="office-mug" />
      <div className="office-character">
        <img src={role.file} alt={role.label} className="pixel" />
      </div>
    </div>
  );
}

export default function App() {
  const [scale, setScale] = useState(2);
  const [bg, setBg] = useState(backgroundOptions[0]);
  const [view, setView] = useState("office");

  const spriteSize = useMemo(() => 72 + scale * 18, [scale]);
  const activeRole = roles.find((role) => role.key === "cto") ?? roles[0];
  const subRoles = roles.filter((role) => role.key !== "cto");

  return (
    <div className={`min-h-screen ${bg.value}`}>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.35em] text-cocoa/70">
              AI Agent Office
            </p>
            <h1 className="font-display text-4xl text-cocoa">Cozy Office Board</h1>
            <p className="mt-2 max-w-2xl text-sm text-cocoa/70">
              Office dashboard with the new 6-character pixel set layered on top.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-cocoa/15 bg-white/70 px-4 py-3 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-cocoa/60">View</p>
              <div className="mt-2 flex gap-2">
                {[
                  { key: "office", label: "Office UI" },
                  { key: "lab", label: "Character Lab" },
                ].map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      view === option.key
                        ? "bg-cocoa text-cream"
                        : "bg-white text-cocoa shadow-sm"
                    }`}
                    onClick={() => setView(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-cocoa/15 bg-white/70 px-4 py-3 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-cocoa/60">Scale</p>
              <div className="mt-2 flex gap-2">
                {scaleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      scale === option.value
                        ? "bg-cocoa text-cream"
                        : "bg-white text-cocoa shadow-sm"
                    }`}
                    onClick={() => setScale(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-cocoa/15 bg-white/70 px-4 py-3 shadow-soft">
              <p className="text-xs uppercase tracking-[0.3em] text-cocoa/60">Background</p>
              <div className="mt-2 flex gap-2">
                {backgroundOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      bg.label === option.label
                        ? "bg-cocoa text-cream"
                        : "bg-white text-cocoa shadow-sm"
                    }`}
                    onClick={() => setBg(option)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {view === "office" ? (
          <main className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <section className="grid gap-6">
              <div className="rounded-3xl border border-cocoa/10 bg-white/70 p-6 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-display text-2xl text-cocoa">Main Agent</h2>
                  <div className="flex flex-wrap gap-2">
                    {officeStats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-cocoa/10 bg-white/80 px-3 py-2 text-xs"
                      >
                        <p className="text-cocoa/60">{stat.label}</p>
                        <p className="font-semibold text-cocoa">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
                  <div className="w-full md:max-w-[320px]">
                    <OfficeScene role={activeRole} size="lg" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cocoa/60">
                      Main Agent (Codex)
                    </p>
                    <h3 className="mt-2 font-display text-3xl text-cocoa">
                      {activeRole.label}
                    </h3>
                    <p className="mt-2 text-sm text-cocoa/70">
                      {activeRole.label} is coordinating the current sprint flow.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-cocoa/10 bg-white/70 p-6 shadow-soft">
                <h3 className="font-display text-2xl text-cocoa">Main Agent Chat</h3>
                <p className="mt-2 text-sm text-cocoa/70">
                  Send instructions to the main Codex agent here.
                </p>
                <div className="mt-4 rounded-2xl border border-cocoa/10 bg-white/80 p-4">
                  <div className="h-40 overflow-y-auto text-sm text-cocoa/70">
                    <p className="font-semibold text-cocoa">System</p>
                    <p>CTO is locked as main. Subagents are on the right.</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <input
                      className="w-full rounded-xl border border-cocoa/10 bg-white px-3 py-2 text-sm text-cocoa"
                      placeholder="Type an instruction for Codex..."
                    />
                    <button className="rounded-xl bg-cocoa px-4 py-2 text-sm font-semibold text-cream">
                      Send
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-cocoa/10 bg-white/70 p-6 shadow-soft">
                <h3 className="font-display text-2xl text-cocoa">Work Board</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {[
                    "Ops board refresh",
                    "Design QA sync",
                    "Sprint alignment",
                    "Release checklist",
                  ].map((item) => (
                    <div key={item} className="rounded-2xl border border-cocoa/10 bg-white/80 px-4 py-3">
                      <p className="text-sm font-semibold text-cocoa">{item}</p>
                      <p className="mt-2 text-xs text-cocoa/60">In progress</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="grid gap-6">
              <div className="rounded-3xl border border-cocoa/10 bg-white/70 p-6 shadow-soft">
                <h3 className="font-display text-2xl text-cocoa">Sub Agents</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {subRoles.map((role) => (
                    <div
                      key={role.key}
                      className="rounded-2xl border border-cocoa/10 bg-white/80 p-3 text-left"
                    >
                      <OfficeScene role={role} />
                      <p className="mt-2 text-xs font-semibold text-cocoa">{role.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </main>
        ) : (
          <main className="mt-10 grid gap-8 xl:grid-cols-[2fr_1fr]">
            <section className="grid gap-6 rounded-3xl border border-cocoa/10 bg-white/70 p-6 shadow-soft">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="font-display text-2xl text-cocoa">Team Selection</h2>
                  <p className="mt-2 max-w-2xl text-sm text-cocoa/70">
                    Pick between six clearly different teammates designed to feel collectible,
                    role-first, and readable at a glance.
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.28em] text-cocoa/45">
                  Silhouette First
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                  <div
                    key={role.key}
                    className="flex flex-col rounded-[28px] border border-cocoa/10 bg-white/85 p-4 shadow-[0_18px_32px_-28px_rgba(96,70,55,0.5)]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-cocoa/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-cocoa/55">
                        {role.tone}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.28em] text-cocoa/35">
                        #{role.key}
                      </span>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <PixelRolePortrait role={role} size={spriteSize} />
                    </div>
                    <div className="mt-4">
                      <p className="text-base font-semibold text-cocoa">{role.label}</p>
                      <p className="mt-2 text-sm leading-6 text-cocoa/65">{role.concept}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="flex flex-col gap-6">
              <div className="rounded-3xl border border-cocoa/10 bg-white/70 p-6 shadow-soft">
                <h3 className="font-display text-xl text-cocoa">Exports</h3>
                <p className="mt-2 text-sm text-cocoa/70">
                  Download individual sprites, the combined sheet, or palette JSON.
                </p>
                <div className="mt-4 grid gap-2 text-sm">
                  {roles.map((role) => (
                    <a
                      key={role.key}
                      href={role.file}
                      download
                      className="rounded-xl border border-cocoa/10 bg-white/80 px-3 py-2 text-cocoa"
                    >
                      {role.label} PNG
                    </a>
                  ))}
                  <a
                    href="/assets/spritesheet/agents-sheet.png"
                    download
                    className="rounded-xl border border-cocoa/10 bg-white/80 px-3 py-2 text-cocoa"
                  >
                    Sprite Sheet
                  </a>
                  <a
                    href="/assets/palettes/palettes.json"
                    download
                    className="rounded-xl border border-cocoa/10 bg-white/80 px-3 py-2 text-cocoa"
                  >
                    Palette JSON
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-cocoa/10 bg-white/70 p-6 shadow-soft">
                <h3 className="font-display text-xl text-cocoa">Notes</h3>
                <ul className="mt-3 space-y-2 text-sm text-cocoa/70">
                  <li>64x64 canvas, chibi proportions, thick outline.</li>
                  <li>Top-left lighting + limited palette per role.</li>
                  <li>Props are single-purpose to preserve readability.</li>
                </ul>
              </div>
            </aside>
          </main>
        )}
      </div>
    </div>
  );
}
