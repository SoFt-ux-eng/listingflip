import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
   Base:     #080B14  (near-black)
   Surface:  #0F1420  (card bg)
   Raised:   #161D2E  (elevated surface)
   Border:   #1E2A42  (borders)
   Accent:   #4F8EF7  (electric blue)
   Amber:    #F7A24F  (CTA / warm)
   Muted:    #5A6A85  (secondary text)
   Text:     #C8D6F0  (primary text)
   Mono:     DM Mono  (output / logo)
   UI:       Inter    (chrome)
   Signature: Terminal-output aesthetic on results panel
═══════════════════════════════════════════════════════════════ */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --base:      #080B14;
  --surface:   #0F1420;
  --raised:    #161D2E;
  --border:    #1E2A42;
  --border2:   #263550;
  --blue:      #4F8EF7;
  --blue-dim:  rgba(79,142,247,0.12);
  --blue-glow: rgba(79,142,247,0.25);
  --amber:     #F7A24F;
  --amber-dim: rgba(247,162,79,0.12);
  --muted:     #5A6A85;
  --text:      #C8D6F0;
  --text2:     #8FA3C4;
  --success:   #3DD68C;
  --danger:    #F75C5C;
  --shopify:   #6DB33F;
  --amazon:    #FF9900;
  --tiktok:    #EE1D52;
  --ebay:      #0064D2;
  --mono:      'DM Mono', monospace;
  --ui:        'Inter', sans-serif;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--ui);
  background: var(--base);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

::selection { background: var(--blue-dim); color: var(--blue); }

::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--muted); }

/* ─── AUTH ─────────────────────────────────────────────────── */

.auth-wrap {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

.auth-left {
  background: var(--base);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 48px;
  position: relative;
  border-right: 1px solid var(--border);
}

.auth-left-grid {
  position: absolute; inset: 0; pointer-events: none; overflow: hidden;
}
.auth-left-grid::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.4;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
}

.auth-hero { position: relative; z-index: 1; max-width: 400px; text-align: center; }

.auth-logo-mark {
  display: inline-flex; align-items: center; gap: 10px;
  margin-bottom: 40px;
}
.auth-logo-sq {
  width: 42px; height: 42px;
  background: var(--raised);
  border: 1px solid var(--border2);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono);
  font-size: 18px; font-weight: 500;
  color: var(--blue);
  letter-spacing: -1px;
}
.auth-logo-name {
  font-family: var(--mono);
  font-size: 20px; font-weight: 500;
  color: var(--text);
  letter-spacing: -0.5px;
}
.auth-logo-name em { color: var(--blue); font-style: normal; }

.auth-tagline {
  font-size: 32px; font-weight: 700; line-height: 1.25;
  color: var(--text); margin-bottom: 16px; letter-spacing: -0.5px;
}
.auth-tagline span { color: var(--blue); }
.auth-sub {
  font-size: 15px; color: var(--muted); line-height: 1.6; margin-bottom: 36px;
}

.auth-platform-row {
  display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;
}
.auth-platform-chip {
  padding: 6px 14px;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 20px; font-size: 12px; font-weight: 500; color: var(--muted);
}

.auth-right {
  background: var(--surface);
  display: flex; align-items: center; justify-content: center;
  padding: 60px 48px;
}

.auth-form-card {
  width: 100%; max-width: 400px;
}

.auth-form-title { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
.auth-form-sub { font-size: 14px; color: var(--muted); margin-bottom: 32px; }

.auth-tabs {
  display: flex; gap: 0;
  background: var(--raised); border: 1px solid var(--border);
  border-radius: 10px; padding: 4px; margin-bottom: 28px;
}
.auth-tab {
  flex: 1; padding: 9px 12px; border: none; background: transparent;
  font-family: var(--ui); font-size: 13px; font-weight: 600;
  color: var(--muted); cursor: pointer; border-radius: 8px; transition: all 0.18s;
}
.auth-tab.active { background: var(--border2); color: var(--text); }

.field { margin-bottom: 18px; }
.field-label {
  display: block; font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.8px; color: var(--muted); margin-bottom: 8px;
}
.field-input {
  width: 100%; padding: 11px 14px;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 9px; color: var(--text); font-size: 14px;
  font-family: var(--ui); outline: none; transition: border-color 0.18s;
}
.field-input:focus { border-color: var(--blue); }
.field-input::placeholder { color: var(--muted); }

.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px 20px; border: none; border-radius: 9px; cursor: pointer;
  font-family: var(--ui); font-size: 14px; font-weight: 600;
  transition: all 0.18s; letter-spacing: 0.2px;
}
.btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
.btn-primary {
  background: var(--blue); color: #fff; width: 100%;
}
.btn-primary:hover:not(:disabled) { background: #6B9FF8; transform: translateY(-1px); box-shadow: 0 6px 20px var(--blue-glow); }
.btn-ghost {
  background: var(--raised); border: 1px solid var(--border2); color: var(--text2); width: 100%;
}
.btn-ghost:hover:not(:disabled) { border-color: var(--muted); color: var(--text); }

.auth-divider {
  display: flex; align-items: center; gap: 12px;
  margin: 18px 0; font-size: 12px; color: var(--muted);
}
.auth-divider::before, .auth-divider::after {
  content: ''; flex: 1; height: 1px; background: var(--border);
}

.auth-notice { font-size: 11px; color: var(--muted); text-align: center; margin-top: 20px; line-height: 1.5; }

.err-msg { font-size: 12px; color: var(--danger); margin-bottom: 14px; padding: 9px 12px; background: rgba(247,92,92,0.08); border: 1px solid rgba(247,92,92,0.2); border-radius: 7px; }

/* ─── MAIN SHELL ────────────────────────────────────────────── */

.shell { min-height: 100vh; display: flex; flex-direction: column; }

/* ─── TOPBAR ─────────────────────────────────────────────────── */

.topbar {
  height: 56px; display: flex; align-items: center; padding: 0 20px;
  border-bottom: 1px solid var(--border);
  background: rgba(8,11,20,0.92); backdrop-filter: blur(12px);
  position: sticky; top: 0; z-index: 90;
  gap: 16px;
}

.topbar-logo {
  display: flex; align-items: center; gap: 9px;
  font-family: var(--mono); font-size: 17px; font-weight: 500; color: var(--text);
  letter-spacing: -0.5px; text-decoration: none;
}
.topbar-logo-sq {
  width: 30px; height: 30px;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; color: var(--blue);
}
.topbar-logo em { color: var(--blue); font-style: normal; }

.topbar-nav { display: flex; gap: 2px; }
.topbar-nav-btn {
  padding: 6px 14px; border: none; background: transparent;
  font-family: var(--ui); font-size: 13px; font-weight: 500;
  color: var(--muted); cursor: pointer; border-radius: 7px; transition: all 0.15s;
}
.topbar-nav-btn:hover { color: var(--text); background: var(--raised); }
.topbar-nav-btn.active { color: var(--text); background: var(--raised); }

.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }

.gen-badge {
  padding: 4px 12px; border-radius: 20px;
  background: var(--raised); border: 1px solid var(--border2);
  font-family: var(--mono); font-size: 12px; color: var(--text2);
}
.gen-badge strong { color: var(--amber); }

.user-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 12px 5px 6px;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 20px; font-size: 13px; color: var(--text2);
}
.user-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue), #7C3AED);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: white;
  font-family: var(--mono);
}

.topbar-sign-out {
  padding: 6px 13px; background: none; border: 1px solid var(--border);
  border-radius: 7px; font-family: var(--ui); font-size: 12px;
  color: var(--muted); cursor: pointer; transition: all 0.15s;
}
.topbar-sign-out:hover { color: var(--danger); border-color: rgba(247,92,92,0.3); }

/* ─── CONTENT ────────────────────────────────────────────────── */

.content { flex: 1; padding: 24px 20px 40px; max-width: 1440px; margin: 0 auto; width: 100%; }

/* ─── GENERATOR ──────────────────────────────────────────────── */

.gen-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 20px;
}
.gen-title { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
.gen-title span { color: var(--blue); }

.workspace {
  display: grid; grid-template-columns: 1fr 1fr;
  border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
  background: var(--surface);
  box-shadow: 0 0 0 1px var(--border), 0 20px 60px rgba(0,0,0,0.4);
  min-height: 580px;
  position: relative;
}
.workspace::after {
  content: '';
  position: absolute; top: 0; bottom: 0; left: 50%; width: 1px;
  background: linear-gradient(to bottom, transparent, var(--border2) 20%, var(--blue-glow) 50%, var(--border2) 80%, transparent);
  pointer-events: none;
}

/* Input side */
.input-side {
  display: flex; flex-direction: column;
  padding: 24px;
  border-right: 1px solid var(--border);
}

.input-side-header {
  display: flex; align-items: center; gap: 8px; margin-bottom: 20px;
}
.side-eyebrow {
  font-family: var(--mono); font-size: 11px; color: var(--muted);
  text-transform: uppercase; letter-spacing: 1px;
}
.side-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); }

.input-row { margin-bottom: 16px; }
.input-label {
  display: block; font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.7px; color: var(--muted); margin-bottom: 7px;
}

.inp {
  width: 100%; padding: 10px 13px;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 8px; color: var(--text); font-size: 13px;
  font-family: var(--ui); outline: none; transition: border-color 0.18s;
}
.inp:focus { border-color: var(--blue); }
.inp::placeholder { color: var(--muted); }

.inp-select {
  width: 100%; padding: 10px 13px;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 8px; color: var(--text); font-size: 13px;
  font-family: var(--ui); outline: none; cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%235A6A85'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;
  transition: border-color 0.18s;
}
.inp-select:focus { border-color: var(--blue); }

.inp-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }

.textarea-wrap { flex: 1; display: flex; flex-direction: column; margin-bottom: 16px; }
.inp-textarea {
  flex: 1; min-height: 180px;
  width: 100%; padding: 12px 13px;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 8px; color: var(--text); font-size: 13px;
  font-family: var(--ui); outline: none; resize: none;
  transition: border-color 0.18s; line-height: 1.65;
}
.inp-textarea:focus { border-color: var(--blue); }
.inp-textarea::placeholder { color: var(--muted); }
.char-bar {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: 6px;
}
.char-count { font-family: var(--mono); font-size: 11px; color: var(--muted); }

.gen-btn {
  width: 100%; padding: 14px;
  background: linear-gradient(135deg, #3A7BD5 0%, var(--blue) 60%, #6B9FF8 100%);
  border: none; border-radius: 10px; color: #fff;
  font-family: var(--ui); font-size: 14px; font-weight: 700;
  cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  position: relative; overflow: hidden;
}
.gen-btn::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), transparent);
  pointer-events: none;
}
.gen-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(79,142,247,0.4); }
.gen-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

.upgrade-nudge {
  display: flex; align-items: center; gap: 8px;
  margin-top: 10px; padding: 9px 13px;
  background: var(--amber-dim); border: 1px solid rgba(247,162,79,0.25);
  border-radius: 8px; font-size: 12px; color: #F7C87A;
}
.nudge-link { color: var(--amber); cursor: pointer; text-decoration: underline; background: none; border: none; font-size: 12px; font-family: var(--ui); }

/* Results side */
.result-side { display: flex; flex-direction: column; }

.platform-tabs-bar {
  display: flex; border-bottom: 1px solid var(--border); overflow-x: auto;
}
.platform-tab {
  padding: 14px 16px; border: none; background: transparent;
  font-family: var(--ui); font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.18s; white-space: nowrap;
  color: var(--muted); border-bottom: 2px solid transparent;
  display: flex; align-items: center; gap: 6px; margin-bottom: -1px;
  flex-shrink: 0;
}
.platform-tab:hover { color: var(--text2); }
.platform-tab.p-active { color: var(--text); }
.platform-tab.p-active[data-p="shopify"] { border-bottom-color: var(--shopify); color: var(--shopify); }
.platform-tab.p-active[data-p="amazon"]  { border-bottom-color: var(--amazon);  color: var(--amazon); }
.platform-tab.p-active[data-p="tiktok"]  { border-bottom-color: var(--tiktok);  color: var(--tiktok); }
.platform-tab.p-active[data-p="ebay"]    { border-bottom-color: var(--ebay);    color: var(--ebay); }

.tab-dot { width: 6px; height: 6px; border-radius: 50%; }
.tab-dot[data-p="shopify"] { background: var(--shopify); }
.tab-dot[data-p="amazon"]  { background: var(--amazon); }
.tab-dot[data-p="tiktok"]  { background: var(--tiktok); }
.tab-dot[data-p="ebay"]    { background: var(--ebay); }

.tab-ready {
  width: 5px; height: 5px; border-radius: 50%; background: var(--success); margin-left: 4px;
  animation: pop 0.3s ease;
}
@keyframes pop { 0% { transform: scale(0); } 60% { transform: scale(1.4); } 100% { transform: scale(1); } }

.result-body { flex: 1; padding: 22px; overflow-y: auto; }

/* Empty state */
.result-empty {
  height: 100%; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; gap: 12px; color: var(--muted);
  padding: 40px;
}
.empty-mono { font-family: var(--mono); font-size: 28px; color: var(--border2); margin-bottom: 8px; }
.empty-text { font-size: 13px; line-height: 1.6; max-width: 240px; }

/* Shimmer */
.shimmer-block {
  background: linear-gradient(90deg, var(--raised) 25%, var(--border2) 50%, var(--raised) 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shim 1.3s ease-in-out infinite;
}
@keyframes shim { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
.shim-h1 { height: 22px; width: 68%; margin-bottom: 14px; }
.shim-h2 { height: 14px; margin-bottom: 8px; }
.shim-p  { height: 13px; margin-bottom: 7px; }
.shim-sm { height: 13px; width: 80%; margin-bottom: 7px; }
.shim-tag { height: 26px; width: 72px; border-radius: 14px; display: inline-block; margin-right: 8px; }

/* Terminal output */
.term-output {
  display: flex; flex-direction: column; gap: 20px;
}

.term-platform-badge {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 4px 12px; border-radius: 4px; font-family: var(--mono);
  font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;
  width: fit-content; margin-bottom: 4px;
}
.badge-shopify { background: rgba(109,179,63,0.1); color: var(--shopify); border: 1px solid rgba(109,179,63,0.2); }
.badge-amazon  { background: rgba(255,153,0,0.1);  color: var(--amazon);  border: 1px solid rgba(255,153,0,0.2); }
.badge-tiktok  { background: rgba(238,29,82,0.1);  color: var(--tiktok);  border: 1px solid rgba(238,29,82,0.2); }
.badge-ebay    { background: rgba(0,100,210,0.12); color: #5AADF7;        border: 1px solid rgba(0,100,210,0.2); }

.term-title {
  font-family: var(--mono); font-size: 18px; font-weight: 500;
  color: var(--text); line-height: 1.3; letter-spacing: -0.3px;
  margin-bottom: 4px;
}
.term-tagline {
  font-family: var(--mono); font-size: 13px; color: var(--blue);
  font-style: italic; margin-bottom: 0;
}

.term-divider { height: 1px; background: var(--border); }

.term-section-label {
  font-family: var(--mono); font-size: 10px; text-transform: uppercase;
  letter-spacing: 1.2px; color: var(--muted); margin-bottom: 10px;
}
.term-desc {
  font-size: 13px; line-height: 1.7; color: var(--text2);
}

.term-bullets { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.term-bullet {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 13px; color: var(--text2); line-height: 1.5;
}
.bullet-chevron { color: var(--blue); font-family: var(--mono); font-size: 13px; flex-shrink: 0; margin-top: 0px; }

.term-tags { display: flex; flex-wrap: wrap; gap: 7px; }
.term-tag {
  padding: 4px 10px;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 4px; font-family: var(--mono); font-size: 11px; color: var(--muted);
}

.copy-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 8px; font-family: var(--ui); font-size: 12px; font-weight: 600;
  color: var(--text2); cursor: pointer; transition: all 0.18s;
}
.copy-btn:hover { border-color: var(--blue); color: var(--blue); }
.copy-btn.copied { background: rgba(61,214,140,0.08); border-color: rgba(61,214,140,0.3); color: var(--success); }

/* ─── HISTORY ─────────────────────────────────────────────────── */

.history-page { max-width: 720px; }
.page-heading { font-size: 22px; font-weight: 700; margin-bottom: 6px; letter-spacing: -0.3px; }
.page-sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; }
.history-list { display: flex; flex-direction: column; gap: 10px; }
.history-card {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 18px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; cursor: pointer; transition: all 0.18s; gap: 12px;
}
.history-card:hover { border-color: var(--border2); background: var(--raised); }
.history-card-name { font-size: 14px; font-weight: 600; margin-bottom: 5px; }
.history-card-meta { display: flex; gap: 12px; align-items: center; font-size: 12px; color: var(--muted); }
.history-tone-chip {
  padding: 3px 9px; background: var(--blue-dim); border: 1px solid rgba(79,142,247,0.2);
  border-radius: 4px; font-family: var(--mono); font-size: 10px; color: var(--blue);
  letter-spacing: 0.5px;
}
.history-arrow { color: var(--muted); font-size: 16px; flex-shrink: 0; }
.history-empty { padding: 60px 20px; text-align: center; color: var(--muted); font-size: 14px; }

/* ─── PRICING ─────────────────────────────────────────────────── */

.pricing-section { padding: 48px 0 60px; }
.pricing-top { text-align: center; margin-bottom: 44px; }
.pricing-kicker {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 14px; border-radius: 4px;
  background: var(--blue-dim); border: 1px solid rgba(79,142,247,0.2);
  font-family: var(--mono); font-size: 11px; color: var(--blue);
  text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 16px;
}
.pricing-headline { font-size: 36px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 12px; }
.pricing-headline span { color: var(--blue); }
.pricing-cap { font-size: 15px; color: var(--muted); }

.plans-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px; max-width: 960px; margin: 0 auto;
}

.plan-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 28px 24px; position: relative;
  transition: all 0.25s;
  display: flex; flex-direction: column;
}
.plan-card:hover { border-color: var(--border2); transform: translateY(-2px); }
.plan-card.featured {
  border-color: var(--blue);
  background: linear-gradient(160deg, rgba(79,142,247,0.06) 0%, var(--surface) 100%);
  box-shadow: 0 0 40px rgba(79,142,247,0.12), 0 0 0 1px rgba(79,142,247,0.15);
}

.plan-popular {
  position: absolute; top: -11px; left: 50%; transform: translateX(-50%);
  padding: 3px 14px; background: var(--blue); border-radius: 4px;
  font-family: var(--mono); font-size: 10px; font-weight: 500; color: white;
  text-transform: uppercase; letter-spacing: 0.8px; white-space: nowrap;
}

.plan-tier { font-family: var(--mono); font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; }

.plan-price-row { margin-bottom: 4px; }
.plan-amount { font-family: var(--mono); font-size: 42px; font-weight: 500; color: var(--text); letter-spacing: -1px; }
.plan-per { font-size: 13px; color: var(--muted); }
.plan-gens { font-family: var(--mono); font-size: 12px; color: var(--blue); margin-bottom: 24px; }

.plan-features { list-style: none; display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; flex: 1; }
.plan-feature { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; color: var(--text2); }
.feat-check { color: var(--success); font-size: 13px; flex-shrink: 0; margin-top: 1px; }

.plan-btn {
  width: 100%; padding: 13px 16px;
  border: none; border-radius: 9px;
  font-family: var(--ui); font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.plan-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
.plan-btn-free { background: var(--raised); border: 1px solid var(--border2); color: var(--text2); }
.plan-btn-free:hover:not(:disabled) { border-color: var(--muted); color: var(--text); }
.plan-btn-growth { background: var(--blue); color: #fff; }
.plan-btn-growth:hover:not(:disabled) { background: #6B9FF8; transform: translateY(-1px); box-shadow: 0 6px 20px var(--blue-glow); }
.plan-btn-pro { background: var(--amber); color: #0C0E17; }
.plan-btn-pro:hover:not(:disabled) { background: #F8B56A; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(247,162,79,0.35); }

/* ─── PAYMENT MODAL ──────────────────────────────────────────── */

.modal-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(8,11,20,0.8); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  animation: fadeIn 0.18s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.modal-card {
  width: 380px; max-width: 94vw;
  background: var(--raised); border: 1px solid var(--border2);
  border-radius: 18px; padding: 38px 32px; text-align: center;
  animation: slideUp 0.2s ease;
}
@keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.modal-icon-ring {
  width: 60px; height: 60px; border-radius: 50%;
  background: var(--blue-dim); border: 1px solid rgba(79,142,247,0.25);
  margin: 0 auto 20px;
  display: flex; align-items: center; justify-content: center; font-size: 26px;
}
.modal-title { font-size: 19px; font-weight: 700; margin-bottom: 8px; }
.modal-body { font-size: 13px; color: var(--muted); line-height: 1.65; margin-bottom: 24px; }

.modal-progress { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; margin-bottom: 20px; }
.modal-bar {
  height: 100%; background: linear-gradient(90deg, var(--blue), var(--amber));
  border-radius: 2px; animation: fill 1.5s ease-out forwards;
}
@keyframes fill { from { width: 0; } to { width: 100%; } }

.modal-cancel {
  background: none; border: none; color: var(--muted); font-size: 12px;
  cursor: pointer; text-decoration: underline; font-family: var(--ui);
}
.modal-cancel:hover { color: var(--text2); }

/* ─── CHAT FAB ───────────────────────────────────────────────── */

.chat-fab {
  position: fixed; bottom: 24px; right: 24px; z-index: 150;
  width: 52px; height: 52px; border-radius: 50%;
  background: var(--raised); border: 1px solid var(--border2);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  font-size: 20px; transition: all 0.2s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}
.chat-fab:hover { border-color: var(--blue); box-shadow: 0 6px 24px rgba(79,142,247,0.25); transform: translateY(-2px); }

.chat-popup {
  position: fixed; bottom: 86px; right: 24px; z-index: 150;
  width: 240px; background: var(--raised); border: 1px solid var(--border2);
  border-radius: 12px; padding: 16px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  animation: slideUp 0.18s ease;
}
.chat-popup-header { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.chat-popup-sub { font-size: 12px; color: var(--muted); line-height: 1.5; margin-bottom: 12px; }
.chat-popup-btn {
  width: 100%; padding: 9px; background: var(--blue); border: none;
  border-radius: 8px; font-family: var(--ui); font-size: 12px; font-weight: 600;
  color: white; cursor: pointer; transition: all 0.15s;
}
.chat-popup-btn:hover { background: #6B9FF8; }

/* ─── SPINNER ─────────────────────────────────────────────────── */
.spin {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.85);
  border-radius: 50%;
  animation: rotate 0.65s linear infinite; flex-shrink: 0;
}
.spin-blue {
  width: 14px; height: 14px;
  border: 2px solid var(--blue-dim);
  border-top-color: var(--blue);
  border-radius: 50%;
  animation: rotate 0.65s linear infinite; flex-shrink: 0;
}
@keyframes rotate { to { transform: rotate(360deg); } }

/* ─── FOOTER ─────────────────────────────────────────────────── */

.footer {
  border-top: 1px solid var(--border);
  padding: 24px 20px;
  text-align: center; font-family: var(--mono);
  font-size: 11px; color: var(--muted); letter-spacing: 0.3px;
  max-width: 1440px; margin: 0 auto; width: 100%;
}

/* ─── RESPONSIVE ─────────────────────────────────────────────── */

@media (max-width: 900px) {
  .auth-wrap { grid-template-columns: 1fr; }
  .auth-left { display: none; }
  .auth-right { padding: 40px 24px; }
  .workspace { grid-template-columns: 1fr; }
  .workspace::after { display: none; }
  .input-side { border-right: none; border-bottom: 1px solid var(--border); }
  .plans-grid { grid-template-columns: 1fr; max-width: 380px; }
  .pricing-headline { font-size: 26px; }
  .topbar-nav { display: none; }
}

@media (max-width: 600px) {
  .content { padding: 16px 14px 32px; }
  .topbar { padding: 0 14px; }
  .gen-badge { display: none; }
  .inp-two-col { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; }
}
`;

// ─── DATA ──────────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "shopify", label: "Shopify",    emoji: "🛍️" },
  { id: "amazon",  label: "Amazon",     emoji: "📦" },
  { id: "tiktok",  label: "TikTok Shop",emoji: "🎵" },
  { id: "ebay",    label: "eBay",       emoji: "🔖" },
];

const TONES = ["Professional", "Casual", "Aggressive Sales"];

const SEED_HISTORY = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", tone: "Professional",     platforms: 4, date: "Jun 17, 2026" },
  { id: 2, name: "Organic Matcha Powder 500g",           tone: "Casual",           platforms: 4, date: "Jun 15, 2026" },
  { id: 3, name: "Portable Standing Desk Converter",     tone: "Aggressive Sales", platforms: 4, date: "Jun 12, 2026" },
];

// ─── API ───────────────────────────────────────────────────────────────────────

async function callAPI(productName, description, tone, platform) {
  const GUIDES = {
    shopify: "Write for a Shopify product page. Provide: (1) a compelling SEO product title under 70 chars, (2) a short punchy tagline under 12 words, (3) a 2–3 sentence description that builds desire and trust, (4) exactly 5 feature bullets starting with a strong verb, (5) 6 SEO keywords.",
    amazon:  "Write for an Amazon listing. Provide: (1) a keyword-rich product title under 200 chars including brand/material/size, (2) a brief tagline, (3) a backend description paragraph under 2000 chars highlighting use cases, (4) exactly 5 feature bullets starting in caps, (5) 6 backend search keywords.",
    tiktok:  "Write for TikTok Shop. Provide: (1) a viral hook title under 50 chars, (2) a single-line viral hook tagline starting with a strong action word or question, (3) a 2–3 sentence conversational description with energy, (4) exactly 5 'why you need this' bullets written like TikTok captions, (5) 8 trending hashtags including #TikTokMadeMeBuyIt.",
    ebay:    "Write for an eBay listing. Provide: (1) a keyword-dense title under 80 chars, (2) a short value-prop tagline, (3) a factual, trust-building description paragraph covering condition, specs, and use case, (4) exactly 5 item-specifics bullets with key details, (5) 6 eBay search keywords.",
  };
  const TONE_GUIDES = {
    "Professional":      "formal, authoritative, benefit-led, trust-building language. Avoid hype.",
    "Casual":            "friendly, approachable, conversational tone. Feel like a recommendation from a friend.",
    "Aggressive Sales":  "high-energy, FOMO-driven, bold claims, urgency phrases. Create excitement and desire.",
  };

  const prompt = `You are a world-class e-commerce copywriter. ${GUIDES[platform]}

Product Name: ${productName}
Original Description: ${description}
Tone: ${tone} — Use ${TONE_GUIDES[tone] || "professional"} tone throughout.

Respond ONLY with a valid JSON object (no markdown, no backticks, no explanation). Use exactly these keys:
{
  "title": "product title string",
  "tagline": "short tagline or hook string",
  "description": "main paragraph string",
  "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5", "kw6"]
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${err}`);
  }

  const data = await res.json();
  const raw = (data.content || []).map(b => b.text || "").join("").trim();
  const clean = raw.replace(/^```(?:json)?|```$/gm, "").trim();
  return JSON.parse(clean);
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function Spinner({ blue }) {
  return <div className={blue ? "spin-blue" : "spin"} />;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handle}>
      {copied ? "✓ Copied!" : "⎘ Copy to Clipboard"}
    </button>
  );
}

function ShimmerResult() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div className="shimmer-block shim-h1" />
        <div className="shimmer-block shim-h2" style={{ width: "45%" }} />
      </div>
      <div style={{ height: 1, background: "var(--border)" }} />
      <div>
        {[1,2,3].map(i => <div key={i} className="shimmer-block shim-p" style={{ width: `${85 - i*7}%` }} />)}
      </div>
      <div>
        {[1,2,3,4,5].map(i => <div key={i} className="shimmer-block shim-sm" />)}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {[1,2,3,4].map(i => <div key={i} className="shimmer-block shim-tag" />)}
      </div>
    </div>
  );
}

function TerminalResult({ platform, result }) {
  const copyText = [
    result.title,
    result.tagline && `"${result.tagline}"`,
    "",
    result.description,
    "",
    result.bullets.map(b => `• ${b}`).join("\n"),
    "",
    "Keywords: " + result.keywords.join(", "),
  ].filter(l => l !== undefined).join("\n");

  return (
    <div className="term-output">
      <div>
        <div className={`term-platform-badge badge-${platform}`}>
          {PLATFORMS.find(p => p.id === platform)?.emoji}&nbsp;
          {PLATFORMS.find(p => p.id === platform)?.label} Listing
        </div>
        <div className="term-title">{result.title}</div>
        {result.tagline && <div className="term-tagline">// {result.tagline}</div>}
      </div>

      <div className="term-divider" />

      <div>
        <div className="term-section-label">Description</div>
        <div className="term-desc">{result.description}</div>
      </div>

      <div>
        <div className="term-section-label">Key Features</div>
        <ul className="term-bullets">
          {result.bullets.map((b, i) => (
            <li key={i} className="term-bullet">
              <span className="bullet-chevron">›</span>
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="term-section-label">Keywords / Tags</div>
        <div className="term-tags">
          {result.keywords.map((k, i) => <span key={i} className="term-tag">{k}</span>)}
        </div>
      </div>

      <div className="term-divider" />
      <CopyButton text={copyText} />
    </div>
  );
}

// ── Payment Modal ──────────────────────────────────────────────

function PaymentModal({ planName, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="modal-overlay" onClick={onDone}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-icon-ring">🔐</div>
        <div className="modal-title">Connecting to Paystack</div>
        <div className="modal-body">
          Securely redirecting you to complete your <strong>{planName}</strong> subscription. Opening payment gateway in a new tab…
        </div>
        <div className="modal-progress"><div className="modal-bar" /></div>
        <button className="modal-cancel" onClick={onDone}>Cancel</button>
      </div>
    </div>
  );
}

// ── Pricing Section ────────────────────────────────────────────

function PricingSection({ onNavigate }) {
  const [loadingTier, setLoadingTier] = useState(null);
  const [modal, setModal] = useState(null);

  const handleGrowthUpgrade = () => {
    setLoadingTier("growth");
    setModal({ name: "Growth — $14/mo", url: "https://paystack.shop/pay/listingflip-growth" });
    setTimeout(() => {
      window.open("https://paystack.shop/pay/listingflip-growth", "_blank");
      setLoadingTier(null);
      setTimeout(() => setModal(null), 400);
    }, 1500);
  };

  const handleProUpgrade = () => {
    setLoadingTier("pro");
    setModal({ name: "Pro — $29/mo", url: "https://paystack.shop/pay/listingflip-pro" });
    setTimeout(() => {
      window.open("https://paystack.shop/pay/listingflip-pro", "_blank");
      setLoadingTier(null);
      setTimeout(() => setModal(null), 400);
    }, 1500);
  };

  const FREE_FEATURES    = ["3 listing generations/month", "All 4 platforms", "Copy to clipboard", "Email support"];
  const GROWTH_FEATURES  = ["50 listing generations/month", "All 4 platforms", "History & saved projects", "Tone customisation", "Priority email support"];
  const PRO_FEATURES     = ["Unlimited generations", "All 4 platforms", "History & saved projects", "Bulk processing (up to 10/batch)", "API access", "Dedicated support"];

  return (
    <section className="pricing-section" id="pricing">
      {modal && (
        <PaymentModal planName={modal.name} onDone={() => { setModal(null); setLoadingTier(null); }} />
      )}

      <div className="pricing-top">
        <div className="pricing-kicker">⚡ pricing</div>
        <h2 className="pricing-headline">Scale your listings,<br /><span>not your overhead</span></h2>
        <p className="pricing-cap">Start free. Upgrade when the results convince you.</p>
      </div>

      <div className="plans-grid">
        {/* Free */}
        <div className="plan-card">
          <div className="plan-tier">free</div>
          <div className="plan-price-row">
            <span className="plan-amount">$0</span>
            <span className="plan-per"> / forever</span>
          </div>
          <div className="plan-gens">3 generations / month</div>
          <ul className="plan-features">
            {FREE_FEATURES.map(f => <li key={f} className="plan-feature"><span className="feat-check">✓</span>{f}</li>)}
          </ul>
          <button className="plan-btn plan-btn-free">Current Plan</button>
        </div>

        {/* Growth */}
        <div className="plan-card featured">
          <div className="plan-popular">most popular</div>
          <div className="plan-tier">growth</div>
          <div className="plan-price-row">
            <span className="plan-amount">$14</span>
            <span className="plan-per"> / month</span>
          </div>
          <div className="plan-gens">50 generations / month</div>
          <ul className="plan-features">
            {GROWTH_FEATURES.map(f => <li key={f} className="plan-feature"><span className="feat-check">✓</span>{f}</li>)}
          </ul>
          <button
            className="plan-btn plan-btn-growth"
            disabled={loadingTier === "growth"}
            onClick={handleGrowthUpgrade}
          >
            {loadingTier === "growth"
              ? <><Spinner />&nbsp;Connecting to payment gateway…</>
              : "Upgrade Now — $14"}
          </button>
        </div>

        {/* Pro */}
        <div className="plan-card">
          <div className="plan-tier">pro</div>
          <div className="plan-price-row">
            <span className="plan-amount">$29</span>
            <span className="plan-per"> / month</span>
          </div>
          <div className="plan-gens">Unlimited generations</div>
          <ul className="plan-features">
            {PRO_FEATURES.map(f => <li key={f} className="plan-feature"><span className="feat-check">✓</span>{f}</li>)}
          </ul>
          <button
            className="plan-btn plan-btn-pro"
            disabled={loadingTier === "pro"}
            onClick={handleProUpgrade}
          >
            {loadingTier === "pro"
              ? <><Spinner />&nbsp;Connecting to payment gateway…</>
              : "Upgrade Now — $29"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Auth Screen ────────────────────────────────────────────────

function AuthScreen({ onLogin }) {
  const [tab, setTab]       = useState("login");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const submit = () => {
    if (!email.trim()) { setError("Email is required."); return; }
    if (!pass.trim())  { setError("Password is required."); return; }
    if (tab === "signup" && !name.trim()) { setError("Name is required."); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      onLogin({ name: name.trim() || email.split("@")[0], email: email.trim(), plan: "free", gens: 3 });
      setLoading(false);
    }, 1100);
  };

  const demoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({ name: "Demo User", email: "demo@listingflip.com", plan: "free", gens: 3 });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="auth-wrap">
      {/* Left panel */}
      <div className="auth-left">
        <div className="auth-left-grid" />
        <div className="auth-hero">
          <div className="auth-logo-mark">
            <div className="auth-logo-sq">LF</div>
            <span className="auth-logo-name">Listing<em>Flip</em></span>
          </div>
          <h1 className="auth-tagline">
            One product.<br />
            <span>Four platforms.</span><br />
            Zero rewriting.
          </h1>
          <p className="auth-sub">
            Paste your product description once. Get platform-optimised listings for Shopify, Amazon, TikTok Shop, and eBay — tuned to your audience tone.
          </p>
          <div className="auth-platform-row">
            {["🛍️ Shopify", "📦 Amazon", "🎵 TikTok Shop", "🔖 eBay"].map(p => (
              <span key={p} className="auth-platform-chip">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right">
        <div className="auth-form-card">
          <h2 className="auth-form-title">
            {tab === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="auth-form-sub">
            {tab === "login"
              ? "Sign in to your ListingFlip workspace"
              : "Start generating platform-ready listings today"}
          </p>

          <div className="auth-tabs">
            <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
            <button className={`auth-tab ${tab === "signup" ? "active" : ""}`} onClick={() => { setTab("signup"); setError(""); }}>Sign Up</button>
          </div>

          {tab === "signup" && (
            <div className="field">
              <label className="field-label">Full Name</label>
              <input className="field-input" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="field">
            <label className="field-label">Email Address</label>
            <input className="field-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Password</label>
            <input className="field-input" type="password" placeholder="••••••••" value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()} />
          </div>

          {error && <div className="err-msg">⚠ {error}</div>}

          <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ marginBottom: 12 }}>
            {loading ? <><Spinner /> Authenticating…</> : tab === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div className="auth-divider">or</div>

          <button className="btn btn-ghost" onClick={demoLogin} disabled={loading}>
            {loading ? <><Spinner blue /> Loading…</> : "🎮 Continue as Guest (Demo)"}
          </button>

          <p className="auth-notice">By continuing you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}

// ── Generator Page ─────────────────────────────────────────────

function GeneratorPage({ gens, onGenerated, onNeedUpgrade }) {
  const [productName, setProductName]   = useState("");
  const [description, setDescription]  = useState("");
  const [tone, setTone]                 = useState("Professional");
  const [activePlatform, setActivePlatform] = useState("shopify");
  const [results, setResults]           = useState({});
  const [loadingMap, setLoadingMap]     = useState({});
  const [generating, setGenerating]     = useState(false);
  const [apiError, setApiError]         = useState("");

  const handleGenerate = async () => {
    if (!productName.trim() || !description.trim()) return;
    if (gens <= 0) { onNeedUpgrade(); return; }

    setGenerating(true);
    setResults({});
    setLoadingMap({ shopify: true, amazon: true, tiktok: true, ebay: true });
    setApiError("");
    const newResults = {};

    for (const p of PLATFORMS) {
      try {
        const r = await callAPI(productName, description, tone, p.id);
        newResults[p.id] = r;
      } catch (err) {
        console.error("API error for", p.id, err);
        newResults[p.id] = {
          title: productName,
          tagline: `Optimised for ${p.label}`,
          description: "Generation encountered an issue — please check your network and try again.",
          bullets: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
          keywords: ["product", "quality", "value", "buy", "deal", "best"],
        };
        if (!apiError) setApiError("API key not configured — showing placeholder output. Add your key to enable real generation.");
      }
      setResults({ ...newResults });
      setLoadingMap(m => { const n = { ...m }; delete n[p.id]; return n; });
    }

    setGenerating(false);
    onGenerated(productName, tone);
  };

  const isTabLoading = loadingMap[activePlatform];
  const currentResult = results[activePlatform];

  return (
    <div>
      <div className="gen-header">
        <div className="gen-title">
          <span>Listing</span>Flip Generator
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          {gens} generation{gens !== 1 ? "s" : ""} remaining
        </div>
      </div>

      {apiError && (
        <div style={{ marginBottom: 16, padding: "10px 14px", background: "rgba(247,162,79,0.08)", border: "1px solid rgba(247,162,79,0.2)", borderRadius: 8, fontSize: 12, color: "#F7C87A" }}>
          ⚠ {apiError}
        </div>
      )}

      <div className="workspace">
        {/* Input Side */}
        <div className="input-side">
          <div className="input-side-header">
            <div className="side-dot" style={{ background: "var(--blue)" }} />
            <span className="side-eyebrow">Input</span>
          </div>

          <div className="inp-two-col">
            <div className="input-row">
              <label className="input-label">Product Name</label>
              <input className="inp" placeholder="e.g. Wireless Headphones Pro"
                value={productName} onChange={e => setProductName(e.target.value)} />
            </div>
            <div className="input-row">
              <label className="input-label">Audience Tone</label>
              <select className="inp-select" value={tone} onChange={e => setTone(e.target.value)}>
                {TONES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="textarea-wrap">
            <label className="input-label">Original Description</label>
            <textarea
              className="inp-textarea"
              placeholder="Paste your original product description here. Include key features, materials, dimensions, compatibility, use cases — the richer the input, the better the output across all four platforms…"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <div className="char-bar">
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Tip: 80+ words yields the best results</span>
              <span className="char-count">{description.length} chars</span>
            </div>
          </div>

          <button
            className="gen-btn"
            onClick={handleGenerate}
            disabled={generating || !productName.trim() || !description.trim()}
          >
            {generating
              ? <><Spinner /> Generating for {PLATFORMS.find(p => loadingMap[p.id])?.label || "all platforms"}…</>
              : "⚡ Generate All Platform Listings"}
          </button>

          {gens === 0 && (
            <div className="upgrade-nudge">
              ⚠ No generations left.{" "}
              <button className="nudge-link" onClick={onNeedUpgrade}>Upgrade your plan →</button>
            </div>
          )}
        </div>

        {/* Results Side */}
        <div className="result-side">
          <div className="platform-tabs-bar">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                data-p={p.id}
                className={`platform-tab ${activePlatform === p.id ? "p-active" : ""}`}
                onClick={() => setActivePlatform(p.id)}
              >
                <span className="tab-dot" data-p={p.id} />
                {p.emoji} {p.label}
                {results[p.id] && <span className="tab-ready" />}
              </button>
            ))}
          </div>

          <div className="result-body">
            {isTabLoading ? (
              <ShimmerResult />
            ) : currentResult ? (
              <TerminalResult platform={activePlatform} result={currentResult} />
            ) : (
              <div className="result-empty">
                <div className="empty-mono">{ generating ? "..." : "{ }"}</div>
                <div className="empty-text">
                  {generating
                    ? `Waiting for ${PLATFORMS.find(p => p.id === activePlatform)?.label} listing…`
                    : "Fill in your product details on the left and click Generate to see platform-optimised listings here."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── History Page ───────────────────────────────────────────────

function HistoryPage({ history, onRestore }) {
  return (
    <div className="history-page">
      <h2 className="page-heading">Saved Projects</h2>
      <p className="page-sub">Your previously generated listings. Click any row to reload it into the generator.</p>
      {history.length === 0 ? (
        <div className="history-empty">No history yet — generate your first listing to see it here.</div>
      ) : (
        <div className="history-list">
          {history.map(item => (
            <div key={item.id} className="history-card" onClick={() => onRestore(item)}>
              <div>
                <div className="history-card-name">{item.name}</div>
                <div className="history-card-meta">
                  <span className="history-tone-chip">{item.tone}</span>
                  <span>{item.platforms} platforms</span>
                  <span>{item.date}</span>
                </div>
              </div>
              <span className="history-arrow">→</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Dashboard (logged-in shell) ────────────────────────────────

function Dashboard({ user, onLogout }) {
  const [page, setPage]                 = useState("generator");
  const [gens, setGens]                 = useState(3);
  const [history, setHistory]           = useState(SEED_HISTORY);
  const [showChat, setShowChat]         = useState(false);
  const [restoredProduct, setRestoredProduct] = useState(null);

  const handleGenerated = useCallback((name, tone) => {
    setGens(g => Math.max(0, g - 1));
    setHistory(h => [{
      id: Date.now(), name, tone,
      platforms: 4,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }, ...h]);
  }, []);

  const handleRestore = (item) => {
    setPage("generator");
  };

  return (
    <div className="shell">
      {/* Topbar */}
      <nav className="topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-sq">LF</div>
          Listing<em style={{ color: "var(--blue)", fontStyle: "normal" }}>Flip</em>
        </div>

        <div className="topbar-nav">
          {[["generator","⚡ Generator"],["history","🕘 History"],["pricing","💳 Plans"]].map(([id, label]) => (
            <button key={id}
              className={`topbar-nav-btn ${page === id ? "active" : ""}`}
              onClick={() => setPage(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className="topbar-right">
          <div className="gen-badge">
            <strong>{gens}</strong> gen{gens !== 1 ? "s" : ""} left
          </div>
          <div className="user-chip">
            <div className="user-avatar">{user.name[0].toUpperCase()}</div>
            {user.name}
          </div>
          <button className="topbar-sign-out" onClick={onLogout}>Sign out</button>
        </div>
      </nav>

      {/* Mobile nav strip */}
      <div style={{ display: "none" }} className="mobile-nav-strip" />

      {/* Content */}
      <div className="content">
        {page === "generator" && (
          <>
            <GeneratorPage
              gens={gens}
              onGenerated={handleGenerated}
              onNeedUpgrade={() => setPage("pricing")}
            />
            <PricingSection onNavigate={setPage} />
          </>
        )}
        {page === "history" && (
          <HistoryPage history={history} onRestore={handleRestore} />
        )}
        {page === "pricing" && (
          <PricingSection onNavigate={setPage} />
        )}
      </div>

      <footer className="footer">
        © 2026 ListingFlip · Platform-optimised listings, instantly ·&nbsp;
        <span style={{ color: "var(--border2)" }}>Built for e-commerce sellers who ship fast</span>
      </footer>

      {/* Live Chat FAB */}
      <button className="chat-fab" onClick={() => setShowChat(s => !s)} title="Live chat">
        {showChat ? "✕" : "💬"}
      </button>
      {showChat && (
        <div className="chat-popup">
          <div className="chat-popup-header">Live Support</div>
          <div className="chat-popup-sub">Our team typically replies within a few minutes during business hours (Mon–Fri, 9am–6pm WAT).</div>
          <button className="chat-popup-btn"
            onClick={() => { alert("Live chat coming soon! Email us at support@listingflip.com"); setShowChat(false); }}>
            Start a conversation →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <style>{STYLES}</style>
      {user
        ? <Dashboard user={user} onLogout={() => setUser(null)} />
        : <AuthScreen onLogin={setUser} />
      }
    </>
  );
}
