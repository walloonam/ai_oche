import React, { useMemo, useState } from "react";

const roles = [
  { key: "cto", label: "CTO / Coordinator", file: "/assets/characters/cto.png" },
  { key: "pm", label: "Planner / PM", file: "/assets/characters/pm.png" },
  { key: "frontend", label: "Frontend Engineer", file: "/assets/characters/frontend.png" },
  { key: "backend", label: "Backend Engineer", file: "/assets/characters/backend.png" },
  { key: "qa", label: "QA Engineer", file: "/assets/characters/qa.png" },
  { key: "designer", label: "Designer", file: "/assets/characters/designer.png" },
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
    monitor: "#c7d5f2",
    accent: "#d49b6f",
    chair: "#b7a2c7",
    wallDeco: "command",
    monitorView: "overview",
    propPrimary: "tablet",
    propSecondary: "badge",
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
          <div className="office-monitor office-monitor-secondary">
            <span className="office-screen-glow" />
            <span className="office-cursor" />
            <span className="office-monitor-content" data-monitor="overview" />
          </div>
          <div className="office-monitor office-monitor-wide">
            <span className="office-screen-glow" />
            <span className="office-monitor-content" data-monitor="flow" />
          </div>
          <div className="office-lamp" />
          <div className="office-console" />
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

  const spriteSize = useMemo(() => 64 * scale, [scale]);
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
              <h2 className="font-display text-2xl text-cocoa">Team Selection</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                  <div
                    key={role.key}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-cocoa/10 bg-white/80 p-4"
                  >
                    <div
                      className="pixel rounded-xl bg-white/80 p-3 shadow-sm"
                      style={{ width: spriteSize, height: spriteSize }}
                    >
                      <img
                        src={role.file}
                        alt={role.label}
                        className="pixel h-full w-full"
                      />
                    </div>
                    <p className="text-sm font-semibold text-cocoa">{role.label}</p>
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
