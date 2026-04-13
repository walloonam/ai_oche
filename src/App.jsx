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

const labStyles = {
  cto: {
    frame: "from-[#f7f3ff] to-[#eef3ff]",
    glow: "#dce4ff",
    jacket: "#24346c",
    shirt: "#f8fbff",
    hair: "#2c2349",
    accessory: "#2f78d9",
    accent: "#7e93d8",
  },
  pm: {
    frame: "from-[#f7f2e8] to-[#eef5e5]",
    glow: "#dce7c9",
    jacket: "#6d8e48",
    shirt: "#d9efb0",
    hair: "#6f4b35",
    accessory: "#9b6a45",
    accent: "#9cb765",
  },
  frontend: {
    frame: "from-[#ecf8ff] to-[#ebf4ff]",
    glow: "#cfeeff",
    jacket: "#29b8f3",
    shirt: "#def9ff",
    hair: "#704b38",
    accessory: "#0f2d5b",
    accent: "#65d4ff",
  },
  backend: {
    frame: "from-[#edf2fb] to-[#eef6f6]",
    glow: "#d1dce8",
    jacket: "#145c7f",
    shirt: "#6fd0db",
    hair: "#273055",
    accessory: "#1f3c69",
    accent: "#52b2c6",
  },
  qa: {
    frame: "from-[#f6efff] to-[#fff1f8]",
    glow: "#e6d4ff",
    jacket: "#b955d8",
    shirt: "#d889f5",
    hair: "#7a49bf",
    accessory: "#9ac9ff",
    accent: "#ff86c2",
  },
  designer: {
    frame: "from-[#fff0ec] to-[#fff6ea]",
    glow: "#ffd7cf",
    jacket: "#ff7b8f",
    shirt: "#ff9d7d",
    hair: "#f05f8e",
    accessory: "#f4c057",
    accent: "#ff9a73",
  },
};

function LabRolePortrait({ role, spriteSize }) {
  const style = labStyles[role.key] ?? labStyles.cto;
  const sceneHeight = Math.round(spriteSize * 1.95);
  const wrapperStyle = {
    width: spriteSize + 42,
    height: sceneHeight,
    background: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.96), ${style.glow} 74%)`,
  };

  const face = {
    position: "absolute",
    left: "50%",
    top: "28%",
    width: 46,
    height: 46,
    transform: "translateX(-50%)",
    background: "#f7d8b7",
    boxShadow: "0 0 0 4px #2f2547",
  };

  const eye = (left) => ({
    position: "absolute",
    top: 16,
    left,
    width: 6,
    height: 16,
    background: "#2b2443",
  });

  const common = (
    <>
      <div className="absolute bottom-3 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-cocoa/10 blur-[1px]" />
      <div style={face}>
        <div style={eye(11)} />
        <div style={eye(29)} />
        <div className="absolute left-1/2 top-[31px] h-[4px] w-[8px] -translate-x-1/2 bg-[#ee9b88]" />
      </div>
    </>
  );

  if (role.key === "cto") {
    return (
      <div
        className={`relative overflow-hidden rounded-[28px] border border-cocoa/10 bg-gradient-to-b ${style.frame} shadow-[0_18px_40px_rgba(120,96,78,0.14)]`}
        style={wrapperStyle}
      >
        <div className="absolute inset-x-5 bottom-4 h-14 rounded-[20px] bg-white/35" />
        {common}
        <div className="absolute left-1/2 top-[23%] h-[18px] w-[62px] -translate-x-1/2 bg-[#2b2248]" />
        <div className="absolute left-[calc(50%-31px)] top-[25%] h-[28px] w-[14px] bg-[#332753]" />
        <div className="absolute left-[calc(50%+17px)] top-[25%] h-[28px] w-[14px] bg-[#332753]" />
        <div className="absolute left-[calc(50%-43px)] top-[31%] h-[31px] w-[18px] bg-[#2f78d9]" />
        <div className="absolute left-[calc(50%-45px)] top-[39%] h-[4px] w-[12px] bg-[#192349]" />
        <div className="absolute left-[calc(50%-28px)] top-[42%] h-[3px] w-[10px] bg-[#192349]" />
        <div className="absolute left-[calc(50%-26px)] top-[50%] h-[38px] w-[52px] bg-[#24346c]" />
        <div className="absolute left-[calc(50%-8px)] top-[50%] h-[38px] w-[16px] bg-[#f8fbff]" />
        <div className="absolute left-[calc(50%-40px)] top-[54%] h-[15px] w-[19px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%-44px)] top-[56%] h-[10px] w-[6px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%-49px)] top-[51%] h-[10px] w-[6px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%+22px)] top-[53%] h-[16px] w-[14px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%+33px)] top-[48%] h-[36px] w-[24px] bg-[#2f78d9]" />
        <div className="absolute left-[calc(50%+36px)] top-[51%] h-[26px] w-[18px] bg-white/20" />
        <div className="absolute left-[calc(50%-20px)] top-[84px] h-[18px] w-[14px] bg-[#24346c]" />
        <div className="absolute left-[calc(50%+6px)] top-[84px] h-[18px] w-[14px] bg-[#24346c]" />
        <div className="absolute left-[calc(50%-24px)] top-[102px] h-[34px] w-[16px] bg-[#24346c]" />
        <div className="absolute left-[calc(50%+8px)] top-[102px] h-[34px] w-[16px] bg-[#24346c]" />
        <div className="absolute left-[calc(50%-28px)] top-[136px] h-[10px] w-[20px] bg-[#1d2550]" />
        <div className="absolute left-[calc(50%+4px)] top-[136px] h-[10px] w-[20px] bg-[#1d2550]" />
      </div>
    );
  }

  if (role.key === "pm") {
    return (
      <div
        className={`relative overflow-hidden rounded-[28px] border border-cocoa/10 bg-gradient-to-b ${style.frame} shadow-[0_18px_40px_rgba(120,96,78,0.14)]`}
        style={wrapperStyle}
      >
        <div className="absolute inset-x-5 bottom-4 h-14 rounded-[20px] bg-white/35" />
        {common}
        <div className="absolute left-1/2 top-[24%] h-[16px] w-[58px] -translate-x-1/2 bg-[#6f4b35]" />
        <div className="absolute left-[calc(50%-29px)] top-[27%] h-[14px] w-[16px] bg-[#7f593f]" />
        <div className="absolute left-[calc(50%+14px)] top-[27%] h-[26px] w-[12px] bg-[#6f4b35]" />
        <div className="absolute left-[calc(50%-25px)] top-[50%] h-[38px] w-[50px] bg-[#6d8e48]" />
        <div className="absolute left-[calc(50%-9px)] top-[51%] h-[12px] w-[18px] bg-[#d9efb0]" />
        <div className="absolute left-[calc(50%-18px)] top-[54%] h-[28px] w-[5px] rotate-[38deg] bg-[#9b6a45]" />
        <div className="absolute left-[calc(50%+4px)] top-[53%] h-[28px] w-[5px] rotate-[38deg] bg-[#9b6a45]" />
        <div className="absolute left-[calc(50%-43px)] top-[58%] h-[32px] w-[26px] bg-[#9b6a45]" />
        <div className="absolute left-[calc(50%-39px)] top-[61%] h-[24px] w-[18px] bg-[#c9a27d]" />
        <div className="absolute left-[calc(50%-35px)] top-[64%] h-[4px] w-[10px] bg-[#7ab47f]" />
        <div className="absolute left-[calc(50%-44px)] top-[53%] h-[16px] w-[16px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%+28px)] top-[53%] h-[16px] w-[16px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%+18px)] top-[50%] h-[30px] w-[24px] bg-[#d7d9df]" />
        <div className="absolute left-[calc(50%+21px)] top-[54%] h-[20px] w-[18px] bg-white/30" />
        <div className="absolute left-[calc(50%-23px)] top-[88px] h-[18px] w-[13px] bg-[#6d8e48]" />
        <div className="absolute left-[calc(50%+7px)] top-[88px] h-[18px] w-[13px] bg-[#6d8e48]" />
        <div className="absolute left-[calc(50%-24px)] top-[106px] h-[34px] w-[15px] bg-[#6d8e48]" />
        <div className="absolute left-[calc(50%+8px)] top-[106px] h-[34px] w-[15px] bg-[#6d8e48]" />
        <div className="absolute left-[calc(50%-27px)] top-[140px] h-[10px] w-[18px] bg-[#5b4332]" />
        <div className="absolute left-[calc(50%+5px)] top-[140px] h-[10px] w-[18px] bg-[#5b4332]" />
      </div>
    );
  }

  if (role.key === "frontend") {
    return (
      <div
        className={`relative overflow-hidden rounded-[28px] border border-cocoa/10 bg-gradient-to-b ${style.frame} shadow-[0_18px_40px_rgba(120,96,78,0.14)]`}
        style={wrapperStyle}
      >
        <div className="absolute inset-x-5 bottom-4 h-14 rounded-[20px] bg-white/35" />
        {common}
        <div className="absolute left-1/2 top-[24%] h-[16px] w-[58px] -translate-x-1/2 bg-[#704b38]" />
        <div className="absolute left-[calc(50%-28px)] top-[28%] h-[12px] w-[16px] bg-[#563626]" />
        <div className="absolute left-[calc(50%-40px)] top-[46%] h-[38px] w-[24px] rounded-t-[8px] bg-[#23a7ea]" />
        <div className="absolute left-[calc(50%+16px)] top-[46%] h-[38px] w-[24px] rounded-t-[8px] bg-[#23a7ea]" />
        <div className="absolute left-[calc(50%-25px)] top-[50%] h-[38px] w-[50px] bg-[#29b8f3]" />
        <div className="absolute left-[calc(50%-10px)] top-[50%] h-[10px] w-[20px] bg-[#def9ff]" />
        <div className="absolute left-[calc(50%-8px)] top-[56%] h-[16px] w-[4px] bg-[#def9ff]" />
        <div className="absolute left-[calc(50%+4px)] top-[56%] h-[16px] w-[4px] bg-[#def9ff]" />
        <div className="absolute left-[calc(50%-44px)] top-[58%] h-[16px] w-[16px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%-54px)] top-[55%] h-[22px] w-[18px] bg-[#0f2d5b]" />
        <div className="absolute left-[calc(50%-50px)] top-[58%] h-[12px] w-[10px] bg-[#fbddb3]" />
        <div className="absolute left-[calc(50%+28px)] top-[53%] h-[18px] w-[18px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%+16px)] top-[49%] h-[32px] w-[42px] bg-[#17264d]" />
        <div className="absolute left-[calc(50%+20px)] top-[53%] h-[22px] w-[34px] bg-[#8be6ff]" />
        <div className="absolute left-[calc(50%+23px)] top-[56%] h-[4px] w-[28px] bg-white/60" />
        <div className="absolute left-[calc(50%+22px)] top-[62%] h-[8px] w-[5px] bg-[#ff8ea6]" />
        <div className="absolute left-[calc(50%+31px)] top-[62%] h-[8px] w-[7px] bg-[#ffd067]" />
        <div className="absolute left-[calc(50%+42px)] top-[62%] h-[8px] w-[10px] bg-[#bdf0ff]" />
        <div className="absolute left-[calc(50%-20px)] top-[88px] h-[18px] w-[14px] bg-[#2950a5]" />
        <div className="absolute left-[calc(50%+6px)] top-[88px] h-[18px] w-[14px] bg-[#2950a5]" />
        <div className="absolute left-[calc(50%-21px)] top-[106px] h-[34px] w-[15px] bg-[#2950a5]" />
        <div className="absolute left-[calc(50%+7px)] top-[106px] h-[34px] w-[15px] bg-[#2950a5]" />
        <div className="absolute left-[calc(50%-24px)] top-[140px] h-[10px] w-[18px] bg-[#4cbefe]" />
        <div className="absolute left-[calc(50%+4px)] top-[140px] h-[10px] w-[18px] bg-[#4cbefe]" />
      </div>
    );
  }

  if (role.key === "backend") {
    return (
      <div
        className={`relative overflow-hidden rounded-[28px] border border-cocoa/10 bg-gradient-to-b ${style.frame} shadow-[0_18px_40px_rgba(120,96,78,0.14)]`}
        style={wrapperStyle}
      >
        <div className="absolute inset-x-5 bottom-4 h-14 rounded-[20px] bg-white/35" />
        {common}
        <div className="absolute left-1/2 top-[24%] h-[18px] w-[60px] -translate-x-1/2 bg-[#273055]" />
        <div className="absolute left-[calc(50%-30px)] top-[28%] h-[14px] w-[18px] bg-[#1f2545]" />
        <div className="absolute left-[calc(50%-17px)] top-[39%] h-[6px] w-[16px] bg-[#101722]" />
        <div className="absolute left-[calc(50%+1px)] top-[39%] h-[6px] w-[16px] bg-[#101722]" />
        <div className="absolute left-[calc(50%-26px)] top-[50%] h-[40px] w-[52px] bg-[#145c7f]" />
        <div className="absolute left-[calc(50%-10px)] top-[52%] h-[10px] w-[20px] bg-[#6fd0db]" />
        <div className="absolute left-[calc(50%-50px)] top-[54%] h-[16px] w-[16px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%-60px)] top-[50%] h-[34px] w-[18px] bg-[#4a925f]" />
        <div className="absolute left-[calc(50%-56px)] top-[54%] h-[22px] w-[10px] bg-[#f5d780]" />
        <div className="absolute left-[calc(50%+26px)] top-[54%] h-[16px] w-[16px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%+12px)] top-[50%] h-[34px] w-[42px] bg-[#243a67]" />
        <div className="absolute left-[calc(50%+16px)] top-[54%] h-[22px] w-[34px] bg-[#334c84]" />
        <div className="absolute left-[calc(50%+19px)] top-[57%] h-[4px] w-[16px] bg-white/50" />
        <div className="absolute left-[calc(50%-20px)] top-[90px] h-[18px] w-[14px] bg-[#233a7a]" />
        <div className="absolute left-[calc(50%+6px)] top-[90px] h-[18px] w-[14px] bg-[#233a7a]" />
        <div className="absolute left-[calc(50%-21px)] top-[108px] h-[34px] w-[15px] bg-[#233a7a]" />
        <div className="absolute left-[calc(50%+7px)] top-[108px] h-[34px] w-[15px] bg-[#233a7a]" />
        <div className="absolute left-[calc(50%-24px)] top-[142px] h-[10px] w-[18px] bg-[#5fd0d1]" />
        <div className="absolute left-[calc(50%+4px)] top-[142px] h-[10px] w-[18px] bg-[#5fd0d1]" />
      </div>
    );
  }

  if (role.key === "qa") {
    return (
      <div
        className={`relative overflow-hidden rounded-[28px] border border-cocoa/10 bg-gradient-to-b ${style.frame} shadow-[0_18px_40px_rgba(120,96,78,0.14)]`}
        style={wrapperStyle}
      >
        <div className="absolute inset-x-5 bottom-4 h-14 rounded-[20px] bg-white/35" />
        {common}
        <div className="absolute left-1/2 top-[23%] h-[16px] w-[58px] -translate-x-1/2 bg-[#7a49bf]" />
        <div className="absolute left-[calc(50%-29px)] top-[27%] h-[32px] w-[12px] bg-[#7a49bf]" />
        <div className="absolute left-[calc(50%+11px)] top-[27%] h-[34px] w-[14px] bg-[#9155dd]" />
        <div className="absolute left-[calc(50%-25px)] top-[50%] h-[40px] w-[50px] bg-[#b955d8]" />
        <div className="absolute left-[calc(50%-24px)] top-[59%] h-[4px] w-[48px] bg-[#d889f5]" />
        <div className="absolute left-[calc(50%-24px)] top-[66%] h-[4px] w-[48px] bg-[#d889f5]" />
        <div className="absolute left-[calc(50%-42px)] top-[53%] h-[16px] w-[16px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%-56px)] top-[48%] h-[42px] w-[24px] bg-white" />
        <div className="absolute left-[calc(50%-50px)] top-[50%] h-[8px] w-[12px] bg-[#26376f]" />
        <div className="absolute left-[calc(50%-51px)] top-[60%] h-[4px] w-[16px] bg-[#ff8ea6]" />
        <div className="absolute left-[calc(50%-51px)] top-[66%] h-[4px] w-[16px] bg-[#71b0ff]" />
        <div className="absolute left-[calc(50%-51px)] top-[72%] h-[4px] w-[12px] bg-[#81cc7f]" />
        <div className="absolute left-[calc(50%+28px)] top-[54%] h-[16px] w-[16px] bg-[#f7d8b7]" />
        <div className="absolute left-[calc(50%+40px)] top-[50%] h-[18px] w-[18px] rounded-full border-[4px] border-[#9ac9ff]" />
        <div className="absolute left-[calc(50%+32px)] top-[67%] h-[5px] w-[14px] rotate-[42deg] bg-[#9ac9ff]" />
        <div className="absolute left-[calc(50%-20px)] top-[92px] h-[18px] w-[14px] bg-[#5d4f95]" />
        <div className="absolute left-[calc(50%+6px)] top-[92px] h-[18px] w-[14px] bg-[#5d4f95]" />
        <div className="absolute left-[calc(50%-21px)] top-[110px] h-[34px] w-[15px] bg-[#5d4f95]" />
        <div className="absolute left-[calc(50%+7px)] top-[110px] h-[34px] w-[15px] bg-[#5d4f95]" />
        <div className="absolute left-[calc(50%-24px)] top-[144px] h-[10px] w-[18px] bg-[#ff86c2]" />
        <div className="absolute left-[calc(50%+4px)] top-[144px] h-[10px] w-[18px] bg-[#ff86c2]" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-cocoa/10 bg-gradient-to-b ${style.frame} shadow-[0_18px_40px_rgba(120,96,78,0.14)]`}
      style={wrapperStyle}
    >
      <div className="absolute inset-x-5 bottom-4 h-14 rounded-[20px] bg-white/35" />
      {common}
      <div className="absolute left-1/2 top-[23%] h-[16px] w-[58px] -translate-x-1/2 bg-[#f05f8e]" />
      <div className="absolute left-[calc(50%-27px)] top-[27%] h-[14px] w-[16px] bg-[#da4f7c]" />
      <div className="absolute left-[calc(50%+10px)] top-[27%] h-[30px] w-[18px] bg-[#f05f8e]" />
      <div className="absolute left-[calc(50%-24px)] top-[50%] h-[38px] w-[48px] bg-[#ff7b8f]" />
      <div className="absolute left-[calc(50%-20px)] top-[59%] h-[4px] w-[40px] bg-[#ff9d7d]" />
      <div className="absolute left-[calc(50%-20px)] top-[66%] h-[4px] w-[40px] bg-[#ff9d7d]" />
      <div className="absolute left-[calc(50%-42px)] top-[54%] h-[16px] w-[16px] bg-[#f7d8b7]" />
      <div className="absolute left-[calc(50%-57px)] top-[52%] h-[20px] w-[20px] rounded-full bg-[#f4c057]" />
      <div className="absolute left-[calc(50%-55px)] top-[54%] h-[16px] w-[16px] rounded-full bg-white/70" />
      <div className="absolute left-[calc(50%-58px)] top-[57%] h-[10px] w-[6px] rounded-full bg-[#ff935c]" />
      <div className="absolute left-[calc(50%-49px)] top-[54%] h-[6px] w-[6px] rounded-full bg-[#6fd0ff]" />
      <div className="absolute left-[calc(50%-47px)] top-[64%] h-[6px] w-[8px] rounded-full bg-[#7bc97a]" />
      <div className="absolute left-[calc(50%+28px)] top-[54%] h-[16px] w-[16px] bg-[#f7d8b7]" />
      <div className="absolute left-[calc(50%+45px)] top-[52%] h-[24px] w-[6px] bg-[#3d4255]" />
      <div className="absolute left-[calc(50%+40px)] top-[50%] h-[12px] w-[16px] bg-[#3d4255]" />
      <div className="absolute left-[calc(50%-18px)] top-[88px] h-[18px] w-[12px] bg-[#ff7b8f]" />
      <div className="absolute left-[calc(50%+6px)] top-[88px] h-[18px] w-[12px] bg-[#ff7b8f]" />
      <div className="absolute left-[calc(50%-20px)] top-[106px] h-[34px] w-[14px] bg-[#ff7b8f]" />
      <div className="absolute left-[calc(50%+8px)] top-[106px] h-[34px] w-[14px] bg-[#ff7b8f]" />
      <div className="absolute left-[calc(50%-22px)] top-[140px] h-[10px] w-[16px] bg-[#6a4035]" />
      <div className="absolute left-[calc(50%+8px)] top-[140px] h-[10px] w-[16px] bg-[#6a4035]" />
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
                    className="flex flex-col items-center gap-4 rounded-[26px] border border-cocoa/10 bg-white/85 p-5 shadow-[0_10px_28px_rgba(120,96,78,0.08)]"
                  >
                    <LabRolePortrait role={role} spriteSize={spriteSize} />
                    <p className="text-center text-sm font-semibold text-cocoa">{role.label}</p>
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
