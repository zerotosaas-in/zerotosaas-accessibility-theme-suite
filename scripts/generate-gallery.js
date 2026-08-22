// Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.join(__dirname, '..', 'themes');
const OUTPUT_HTML = path.join(__dirname, '..', 'docs', 'previews', 'gallery.html');

// Read all 10 theme JSONs
const themeFiles = [
  { id: 'default', file: 'zerotosaas-light.json', name: 'ZeroToSaaS Light (Default)', icon: '💡', swatch: '#0B4F9C', systems: ['all', 'oklch', 'colorbrewer', 'fm100'] },
  { id: 'green', file: 'zerotosaas-green.json', name: 'Forest Calm (Green)', icon: '🌲', swatch: '#096032', systems: ['all', 'oklch', 'colorbrewer', 'fm100'] },
  { id: 'yellow', file: 'zerotosaas-yellow.json', name: 'Golden Sand (Yellow)', icon: '☀️', swatch: '#6E4E00', systems: ['all', 'oklch', 'colorbrewer'] },
  { id: 'orange', file: 'zerotosaas-orange.json', name: 'Terracotta (Orange)', icon: '🔥', swatch: '#943800', systems: ['all', 'oklch'] },
  { id: 'brown', file: 'zerotosaas-brown.json', name: 'Warm Sepia (Brown)', icon: '☕', swatch: '#5C2C06', systems: ['all', 'oklch', 'fm100'] },
  { id: 'purple', file: 'zerotosaas-purple.json', name: 'Royal Plum (Purple)', icon: '🔮', swatch: '#6B21A8', systems: ['all', 'oklch'] },
  { id: 'blue', file: 'zerotosaas-blue.json', name: 'Oceanic Steel (Blue)', icon: '🌊', swatch: '#0E5A8A', systems: ['all', 'oklch', 'fm100'] },
  { id: 'deuteranopia', file: 'zerotosaas-deuteranopia.json', name: 'Deuteranopia Safe (Blue/Amber)', icon: '🌐', swatch: '#0043A4', systems: ['all', 'paultol'] },
  { id: 'protanopia', file: 'zerotosaas-protanopia.json', name: 'Protanopia Safe (Magenta/Teal)', icon: '🌐', swatch: '#8C0064', systems: ['all', 'paultol'] },
  { id: 'high-contrast', file: 'zerotosaas-high-contrast.json', name: 'High Contrast (ISO 9241-303)', icon: '⚡', swatch: '#002D80', systems: ['all', 'colorbrewer'] }
];

const themesData = {};
themeFiles.forEach(t => {
  const filePath = path.join(THEMES_DIR, t.file);
  if (fs.existsSync(filePath)) {
    themesData[t.id] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
});

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZeroToSaaS Accessibility Theme Suite — Interactive Showcase & Live Playground</title>
  <style>
    :root {
      --font-mono: 'Geist Mono', 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background: #F8FAFC;
      color: #0F172A;
      padding: 1.5rem 2rem;
      line-height: 1.5;
    }
    .container {
      max-width: 1440px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 1.25rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #E2E8F0;
    }
    .header h1 {
      font-size: 1.75rem;
      color: #075985;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .header p { color: #475569; font-size: 0.95rem; margin-top: 0.25rem; }
    .header-links {
      display: flex;
      gap: 0.75rem;
    }
    .link-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      background: #FFFFFF;
      color: #0369A1;
      border: 1px solid #BAE6FD;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
      transition: all 0.15s ease;
    }
    .link-btn:hover {
      background: #E0F2FE;
      border-color: #7DD3FC;
    }

    /* Control Panel Cards */
    .controls-panel {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }
    .control-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .control-row:last-child { margin-bottom: 0; }
    .control-label {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .keyboard-hint {
      font-size: 0.75rem;
      font-weight: normal;
      color: #94A3B8;
      text-transform: none;
      margin-left: auto;
    }
    kbd {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      border-radius: 3px;
      padding: 1px 5px;
      font-family: var(--font-mono);
      font-size: 11px;
    }

    /* Segmented Radio Tabs */
    .segmented-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid #E2E8F0;
      background: #F8FAFC;
      color: #334155;
      transition: all 0.15s ease;
      user-select: none;
    }
    .tab-btn:hover {
      background: #F1F5F9;
      border-color: #CBD5E1;
      color: #0F172A;
    }
    .tab-btn.active {
      background: #0284C7;
      color: #FFFFFF;
      border-color: #0284C7;
      box-shadow: 0 2px 4px rgba(2,132,199,0.25);
    }
    .swatch-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.85);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
      display: inline-block;
    }

    /* Sub Row: Language & Feature Toggles */
    .sub-controls {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid #F1F5F9;
    }
    .lang-tabs { display: flex; gap: 0.35rem; flex-wrap: wrap; }
    .lang-btn {
      padding: 0.3rem 0.65rem;
      border-radius: 5px;
      font-size: 0.8rem;
      font-weight: 600;
      border: 1px solid #E2E8F0;
      background: #FFFFFF;
      color: #475569;
      cursor: pointer;
      font-family: var(--font-mono);
    }
    .lang-btn.active {
      background: #0F172A;
      color: #FFFFFF;
      border-color: #0F172A;
    }
    .toggles-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.82rem;
      color: #334155;
    }
    .toggle-label {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      font-weight: 500;
    }

    /* Telemetry Bar */
    .telemetry-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: center;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 0.6rem 1rem;
      margin-bottom: 1rem;
      font-size: 0.82rem;
      font-family: var(--font-mono);
      color: #334155;
    }
    .telemetry-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #F1F5F9;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #E2E8F0;
    }
    .telemetry-chip strong { color: #0369A1; }

    /* IDE Editor Mockup */
    .editor-card {
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
      border: 1px solid #CBD5E1;
      font-family: var(--font-mono);
      font-size: 13.5px;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .editor-topbar {
      padding: 0.6rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      font-size: 12px;
      font-weight: 600;
    }
    .window-dots {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .dot-red { background: #FF5F56; }
    .dot-yellow { background: #FFBD2E; }
    .dot-green { background: #27C93F; }

    .editor-body {
      padding: 1.25rem;
      white-space: pre;
      overflow-x: auto;
      line-height: 1.65;
    }

    .line { display: flex; align-items: baseline; }
    .ln {
      width: 2.75rem;
      user-select: none;
      opacity: 0.45;
      text-align: right;
      padding-right: 1.25rem;
    }
    .code { flex: 1; }

    /* Indent Shading */
    .indent-odd { background-color: rgba(0,0,0,0.035); display: inline-block; }
    .indent-even { background-color: transparent; display: inline-block; }
    .no-indent .indent-odd { background-color: transparent; }

    /* Status Badges */
    .status-tag {
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 11px;
      display: inline-block;
    }
    .status-safe { background: #EBF8EE; color: #0B6229; border: 1px solid #B4E6C3; }
    .status-caution { background: #FEF9EE; color: #784A00; border: 1px solid #FDE4A3; }
    .status-warning { background: #FFF6EE; color: #8C3800; border: 1px solid #FDCBA6; }
    .status-panic { background: #FFF2F2; color: #990014; border: 1px solid #FCA5A5; font-weight: bold; }

    /* Error lens inline */
    .error-lens {
      font-style: italic;
      font-size: 0.9em;
      margin-left: 1rem;
      opacity: 0.9;
    }
    .error-lens-err { color: #990014; }
    .error-lens-warn { color: #8C3800; }
    .no-error-lens .error-lens { display: none; }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <div>
        <h1>🔬 ZeroToSaaS Quad-System Interactive Theme Showcase</h1>
        <p>Test all 10 accessible themes across OkLCH, Paul Tol CVD-Safe, ColorBrewer IA, and Farnsworth-Munsell 100-Hue systems with <strong>1 click</strong>.</p>
      </div>
      <div class="header-links">
        <a href="../Validation.md" class="link-btn">📊 Validation Report</a>
        <a href="../Guidelines.md" class="link-btn">🏥 Medical Guidelines</a>
        <a href="../../README.md" class="link-btn">🏠 README</a>
      </div>
    </div>

    <!-- Control Panel -->
    <div class="controls-panel">
      <!-- 1. System Filter -->
      <div class="control-row">
        <div class="control-label">
          <span>🏛️ 1. Select Color Science Framework:</span>
        </div>
        <div class="segmented-group" id="system-filters">
          <button class="tab-btn active" data-system="all">✨ All Systems (10 Themes)</button>
          <button class="tab-btn" data-system="oklch">📐 OkLCH Lightness Invariant</button>
          <button class="tab-btn" data-system="paultol">🧪 Paul Tol CVD-Safe (SRON)</button>
          <button class="tab-btn" data-system="colorbrewer">🎨 ColorBrewer IA Scales</button>
          <button class="tab-btn" data-system="fm100">👁️ FM 100-Hue (Clinical)</button>
        </div>
      </div>

      <!-- 2. Theme Selector -->
      <div class="control-row">
        <div class="control-label">
          <span>🎨 2. Select Theme Variation:</span>
          <span class="keyboard-hint">Keyboard: Press keys <kbd>1</kbd>–<kbd>9</kbd> or <kbd>←</kbd> <kbd>→</kbd></span>
        </div>
        <div class="segmented-group" id="theme-tabs">
          <!-- Dynamically populated / filtered -->
        </div>
      </div>

      <!-- 3. Language & Feature Toggles -->
      <div class="sub-controls">
        <div class="lang-tabs" id="lang-tabs">
          <button class="lang-btn active" data-lang="python">Python</button>
          <button class="lang-btn" data-lang="typescript">TypeScript React</button>
          <button class="lang-btn" data-lang="rust">Rust</button>
          <button class="lang-btn" data-lang="sql">SQL</button>
          <button class="lang-btn" data-lang="audit">Audit Logs</button>
          <button class="lang-btn" data-lang="config">Cargo.toml</button>
        </div>
        <div class="toggles-group">
          <label class="toggle-label"><input type="checkbox" id="toggle-error-lens" checked> Error Lens Badges</label>
          <label class="toggle-label"><input type="checkbox" id="toggle-indent" checked> Alternating Indent Shading</label>
          <label class="toggle-label"><input type="checkbox" id="toggle-firewall" checked> Human Firewall Trapping</label>
        </div>
      </div>
    </div>

    <!-- Live Telemetry Inspector Bar -->
    <div class="telemetry-bar" id="telemetry-bar">
      <span class="telemetry-chip">Canvas: <strong id="tel-canvas">#FCFCFD</strong> [OkLCH: <strong id="tel-oklch">L=98.9% C=0.003 h=264°</strong>]</span>
      <span class="telemetry-chip">Base Contrast: <strong id="tel-contrast">17.30:1 (WCAG AAA)</strong></span>
      <span class="telemetry-chip">Paul Tol Separation: <strong id="tel-paultol">ΔE ≥ 0.18</strong></span>
      <span class="telemetry-chip">Active System Compatibility: <strong id="tel-systems">OkLCH • ColorBrewer • FM 100-Hue</strong></span>
    </div>

    <!-- Live IDE Editor Card -->
    <div class="editor-card" id="editor-card">
      <div class="editor-topbar" id="editor-topbar">
        <div class="window-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
          <span id="editor-filename" style="margin-left: 0.75rem;">data_pipeline.py — ZeroToSaaS Light (Default)</span>
        </div>
        <span id="editor-badge" class="status-tag status-safe">100% WCAG AAA Compliant</span>
      </div>
      <div class="editor-body" id="editor-body">
        <!-- Rendered Code Content -->
      </div>
    </div>
  </div>

  <script>
    const themeMetadata = ${JSON.stringify(themeFiles)};
    
    // Code samples database
    const codeSamples = {
      python: {
        filename: 'data_pipeline.py',
        code: (t) => \`
<div class="line"><span class="ln">1</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">import</span> <span style="color:\${t.fg};">os</span>, <span style="color:\${t.fg};">sys</span>, <span style="color:\${t.fg};">hashlib</span></span></div>
<div class="line"><span class="ln">2</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">from</span> <span style="color:\${t.fg};">dataclasses</span> <span style="color:\${t.keyword}; font-weight:bold;">import</span> <span style="color:\${t.type}; font-weight:bold;">dataclass</span></span></div>
<div class="line"><span class="ln">3</span><span class="code"></span></div>
<div class="line"><span class="ln">4</span><span class="code"><span style="color:\${t.type}; font-weight:bold;">@dataclass</span></span></div>
<div class="line"><span class="ln">5</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">class</span> <span style="color:\${t.type}; font-weight:bold;">PipelineTelemetry</span>:</span></div>
<div class="line"><span class="ln">6</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.fg};">cluster_id</span>: <span style="color:\${t.type};">str</span></span></div>
<div class="line"><span class="ln">7</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.fg};">worker_count</span>: <span style="color:\${t.type};">int</span> = <span style="color:\${t.constant}; font-weight:bold;">128</span></span></div>
<div class="line"><span class="ln">8</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.fg};">api_key</span>: <span style="color:\${t.type};">str</span> = <span class="status-panic" style="background:\${t.panicBg}; color:\${t.panicFg};">"AIzaSyD9x82kL90aXyZ1..."</span> <span class="error-lens error-lens-err">🔴 [Panic] Secret Key Hardcoded in Source</span></span></div>
<div class="line"><span class="ln">9</span><span class="code"></span></div>
<div class="line"><span class="ln">10</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">def</span> <span style="color:\${t.func}; font-weight:bold;">process_telemetry_batch</span>(<span style="color:\${t.param};">records</span>: <span style="color:\${t.type};">list</span>) -> <span style="color:\${t.type};">bool</span>:</span></div>
<div class="line"><span class="ln">11</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.comment};"># Validated against Cynthia Brewer diverging scale</span></span></div>
<div class="line"><span class="ln">12</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="status-tag status-safe">Safe (🟢)</span> <span style="color:\${t.type}; font-weight:bold;">Strict Contract Verified</span></span></div>
<div class="line"><span class="ln">13</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.keyword}; font-weight:bold;">if not</span> <span style="color:\${t.param};">records</span>:</span></div>
<div class="line"><span class="ln">14</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.keyword}; font-weight:bold;">return</span> <span style="color:\${t.constant}; font-weight:bold;">False</span></span></div>
<div class="line"><span class="ln">15</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.keyword}; font-weight:bold;">return</span> <span style="color:\${t.constant}; font-weight:bold;">True</span></span></div>\`
      },
      typescript: {
        filename: 'DashboardWidget.tsx',
        code: (t) => \`
<div class="line"><span class="ln">1</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">import</span> <span style="color:\${t.fg};">React</span>, { <span style="color:\${t.func};">useState</span>, <span style="color:\${t.func};">useEffect</span> } <span style="color:\${t.keyword}; font-weight:bold;">from</span> <span style="color:\${t.string};">"react"</span>;</span></div>
<div class="line"><span class="ln">2</span><span class="code"></span></div>
<div class="line"><span class="ln">3</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">interface</span> <span style="color:\${t.type}; font-weight:bold;">SessionProps</span> {</span></div>
<div class="line"><span class="ln">4</span><span class="code">    <span style="color:\${t.fg};">sessionId</span>: <span style="color:\${t.type};">string</span>;</span></div>
<div class="line"><span class="ln">5</span><span class="code">    <span style="color:\${t.fg};">activeTenants</span>: <span style="color:\${t.type};">number</span>;</span></div>
<div class="line"><span class="ln">6</span><span class="code">}</span></div>
<div class="line"><span class="ln">7</span><span class="code"></span></div>
<div class="line"><span class="ln">8</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">export const</span> <span style="color:\${t.func}; font-weight:bold;">DashboardWidget</span> = ({ <span style="color:\${t.param};">sessionId</span>, <span style="color:\${t.param};">activeTenants</span> }: <span style="color:\${t.type};">SessionProps</span>) => {</span></div>
<div class="line"><span class="ln">9</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.keyword}; font-weight:bold;">const</span> [<span style="color:\${t.fg};">status</span>, <span style="color:\${t.func};">setStatus</span>] = <span style="color:\${t.func};">useState</span>(<span style="color:\${t.string};">"IDLE"</span>);</span></div>
<div class="line"><span class="ln">10</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.keyword}; font-weight:bold;">return</span> (</span></div>
<div class="line"><span class="ln">11</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;<span style="color:\${t.type}; font-weight:bold;">div</span> <span style="color:\${t.func};">className</span>=<span style="color:\${t.string};">"dashboard-container"</span>&gt;</span></div>
<div class="line"><span class="ln">12</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;<span style="color:\${t.type}; font-weight:bold;">h2</span>&gt;ZeroToSaaS Telemetry: {<span style="color:\${t.param};">sessionId</span>}&lt;/<span style="color:\${t.type}; font-weight:bold;">h2</span>&gt;</span></div>
<div class="line"><span class="ln">13</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;/<span style="color:\${t.type}; font-weight:bold;">div</span>&gt;</span></div>
<div class="line"><span class="ln">14</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span>);</span></div>
<div class="line"><span class="ln">15</span><span class="code">};</span></div>\`
      },
      rust: {
        filename: 'engine.rs',
        code: (t) => \`
<div class="line"><span class="ln">1</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">pub struct</span> <span style="color:\${t.type}; font-weight:bold;">ExecutionEngine</span> {</span></div>
<div class="line"><span class="ln">2</span><span class="code">    <span style="color:\${t.fg};">cluster_uuid</span>: <span style="color:\${t.type};">Uuid</span>,</span></div>
<div class="line"><span class="ln">3</span><span class="code">    <span style="color:\${t.fg};">worker_threads</span>: <span style="color:\${t.type};">usize</span>,</span></div>
<div class="line"><span class="ln">4</span><span class="code">}</span></div>
<div class="line"><span class="ln">5</span><span class="code"></span></div>
<div class="line"><span class="ln">6</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">impl</span> <span style="color:\${t.type}; font-weight:bold;">ExecutionEngine</span> {</span></div>
<div class="line"><span class="ln">7</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.keyword}; font-weight:bold;">pub fn</span> <span style="color:\${t.func}; font-weight:bold;">new</span>(<span style="color:\${t.param};">threads</span>: <span style="color:\${t.type};">usize</span>) -> <span style="color:\${t.type};">Result</span>&lt;<span style="color:\${t.type};">Self</span>, <span style="color:\${t.type};">EngineError</span>&gt; {</span></div>
<div class="line"><span class="ln">8</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.type};">Ok</span>(<span style="color:\${t.type};">Self</span> {</span></div>
<div class="line"><span class="ln">9</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.fg};">cluster_uuid</span>: <span style="color:\${t.func};">Uuid::new_v4</span>(),</span></div>
<div class="line"><span class="ln">10</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:\${t.fg};">worker_threads</span>: <span style="color:\${t.param};">threads</span>,</span></div>
<div class="line"><span class="ln">11</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>})</span></div>
<div class="line"><span class="ln">12</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span>}</span></div>
<div class="line"><span class="ln">13</span><span class="code">}</span></div>\`
      },
      sql: {
        filename: 'database.sql',
        code: (t) => \`
<div class="line"><span class="ln">1</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">SELECT</span> <span style="color:\${t.type};">u.id</span>, <span style="color:\${t.type};">u.email</span>, <span style="color:\${t.type};">u.created_at</span>, <span style="color:\${t.type};">o.total_amount</span></span></div>
<div class="line"><span class="ln">2</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">FROM</span> <span style="color:\${t.fg}; font-weight:bold;">users</span> <span style="color:\${t.fg};">u</span></span></div>
<div class="line"><span class="ln">3</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">JOIN</span> <span style="color:\${t.fg}; font-weight:bold;">orders</span> <span style="color:\${t.fg};">o</span> <span style="color:\${t.keyword}; font-weight:bold;">ON</span> <span style="color:\${t.type};">o.user_id</span> = <span style="color:\${t.type};">u.id</span></span></div>
<div class="line"><span class="ln">4</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">WHERE</span> <span style="color:\${t.type};">u.is_active</span> = <span style="color:\${t.constant}; font-weight:bold;">TRUE</span></span></div>
<div class="line"><span class="ln">5</span><span class="code"><span style="color:\${t.keyword}; font-weight:bold;">ORDER BY</span> <span style="color:\${t.type};">u.created_at</span> <span style="color:\${t.keyword}; font-weight:bold;">DESC</span>;</span></div>
<div class="line"><span class="ln">6</span><span class="code"></span></div>
<div class="line"><span class="ln">7</span><span class="code"><span style="color:\${t.comment};">-- 100% WCAG AAA Verified Query Plan</span></span></div>\`
      },
      audit: {
        filename: 'audit_events.log',
        code: (t) => \`
<div class="line"><span class="ln">1</span><span class="code"><span style="color:\${t.comment};">2026-08-22 17:30:00.104</span> <span class="status-tag status-safe">[INFO]</span> <span style="color:\${t.type};">Cluster initialization successful</span></span></div>
<div class="line"><span class="ln">2</span><span class="code"><span style="color:\${t.comment};">2026-08-22 17:30:01.442</span> <span class="status-tag status-caution">[WARN]</span> <span style="color:\${t.string};">Re-trying network handshake</span></span></div>
<div class="line"><span class="ln">3</span><span class="code"><span style="color:\${t.comment};">2026-08-22 17:30:02.910</span> <span class="status-tag status-panic">[ERROR]</span> <span style="color:\${t.panicFg}; font-weight:bold;">Connection reset on socket 0xCAFEBABE</span></span></div>\`
      },
      config: {
        filename: 'Cargo.toml',
        code: (t) => \`
<div class="line"><span class="ln">1</span><span class="code"><span style="color:\${t.type}; font-weight:bold;">[package]</span></span></div>
<div class="line"><span class="ln">2</span><span class="code"><span style="color:\${t.fg};">name</span> = <span style="color:\${t.string};">"zerotosaas-engine"</span></span></div>
<div class="line"><span class="ln">3</span><span class="code"><span style="color:\${t.fg};">version</span> = <span style="color:\${t.string};">"0.1.0"</span></span></div>
<div class="line"><span class="ln">4</span><span class="code"><span style="color:\${t.fg};">license</span> = <span style="color:\${t.string};">"AGPL-3.0"</span></span></div>
<div class="line"><span class="ln">5</span><span class="code"></span></div>
<div class="line"><span class="ln">6</span><span class="code"><span style="color:\${t.type}; font-weight:bold;">[dependencies]</span></span></div>
<div class="line"><span class="ln">7</span><span class="code"><span style="color:\${t.fg};">tokio</span> = { <span style="color:\${t.fg};">version</span> = <span style="color:\${t.string};">"1.0"</span>, <span style="color:\${t.fg};">features</span> = [<span style="color:\${t.string};">"full"</span>] }</span></div>\`
      }
    };

    // Extract theme color tokens
    const themesPalette = {
      default: { bg: '#FCFCFD', fg: '#111827', headerBg: '#F3F6FA', keyword: '#0B4F9C', func: '#4F2683', type: '#005D6B', constant: '#6E4E00', param: '#543D00', string: '#734400', comment: '#485260', panicFg: '#990014', panicBg: '#FFF2F2', contrast: '17.30:1', oklch: 'L=98.9% C=0.003 h=264°', paultol: 'ΔE ≥ 0.18', systems: 'OkLCH • ColorBrewer • FM 100-Hue' },
      green: { bg: '#F8FCF9', fg: '#0A2014', headerBg: '#E8F2EB', keyword: '#0A6233', func: '#0A5C4A', type: '#06522B', constant: '#145524', param: '#2E5918', string: '#1F5A14', comment: '#32583E', panicFg: '#960C1B', panicBg: '#FEF1F2', contrast: '16.91:1', oklch: 'L=98.5% C=0.009 h=146°', paultol: 'ΔE ≥ 0.16', systems: 'OkLCH • ColorBrewer • FM 100-Hue' },
      yellow: { bg: '#FCFAF4', fg: '#221B03', headerBg: '#F2EDDC', keyword: '#6E4E00', func: '#5C4100', type: '#2C5814', constant: '#684B00', param: '#6A4D00', string: '#734400', comment: '#5D522B', panicFg: '#8E1200', panicBg: '#FEF1EE', contrast: '16.41:1', oklch: 'L=98.5% C=0.008 h=91°', paultol: 'ΔE ≥ 0.15', systems: 'OkLCH • ColorBrewer' },
      orange: { bg: '#FCF8F5', fg: '#22140D', headerBg: '#F7EDE6', keyword: '#913600', func: '#7A2B06', type: '#1A5A28', constant: '#8C3800', param: '#7D3004', string: '#8C3800', comment: '#624A3E', panicFg: '#960010', panicBg: '#FEF0EE', contrast: '16.14:1', oklch: 'L=98.7% C=0.007 h=46°', paultol: 'ΔE ≥ 0.14', systems: 'OkLCH' },
      brown: { bg: '#FAF7F2', fg: '#20160B', headerBg: '#F0E9DF', keyword: '#5C2C06', func: '#4A2207', type: '#22581A', constant: '#6C3406', param: '#542805', string: '#6C3406', comment: '#594B3C', panicFg: '#900C18', panicBg: '#FEF1F1', contrast: '16.29:1', oklch: 'L=98.4% C=0.009 h=74°', paultol: 'ΔE ≥ 0.17', systems: 'OkLCH • FM 100-Hue' },
      purple: { bg: '#FAF8FC', fg: '#1B0E2A', headerBg: '#EFE7F6', keyword: '#6B21A8', func: '#581C87', type: '#005D6B', constant: '#6E4E00', param: '#5B1F8E', string: '#701A75', comment: '#544662', panicFg: '#990014', panicBg: '#FEF0F4', contrast: '17.15:1', oklch: 'L=98.7% C=0.007 h=312°', paultol: 'ΔE ≥ 0.15', systems: 'OkLCH' },
      blue: { bg: '#F6FAFD', fg: '#0B1C2D', headerBg: '#E4F0F9', keyword: '#0E5A8A', func: '#0B476D', type: '#065A38', constant: '#704800', param: '#0D4E75', string: '#145A6E', comment: '#3D5466', panicFg: '#990014', panicBg: '#FEF1F4', contrast: '16.82:1', oklch: 'L=98.3% C=0.009 h=228°', paultol: 'ΔE ≥ 0.19', systems: 'OkLCH • FM 100-Hue' },
      deuteranopia: { bg: '#FAFCFE', fg: '#0A1B38', headerBg: '#EFF4FA', keyword: '#0043A4', func: '#1E3A8A', type: '#0043A4', constant: '#733500', param: '#733500', string: '#7D3800', comment: '#3E4F6D', panicFg: '#990014', panicBg: '#FEF2F4', contrast: '17.18:1', oklch: 'L=98.8% C=0.006 h=228°', paultol: 'ΔE ≥ 0.182 (Pass)', systems: 'Paul Tol CVD-Safe (470nm/600nm)' },
      protanopia: { bg: '#FCFAFC', fg: '#1E0E22', headerBg: '#F4EEF5', keyword: '#0A4BA0', func: '#8C0064', type: '#015D53', constant: '#703700', param: '#703700', string: '#7D3800', comment: '#524056', panicFg: '#8C0064', panicBg: '#FEF0F6', contrast: '16.32:1', oklch: 'L=98.7% C=0.006 h=328°', paultol: 'ΔE ≥ 0.165 (Pass)', systems: 'Paul Tol CVD-Safe (Magenta/Teal)' },
      'high-contrast': { bg: '#FFFFFF', fg: '#000000', headerBg: '#FAFAFA', keyword: '#002D80', func: '#400080', type: '#00591E', constant: '#5E3800', param: '#5E3800', string: '#5E3800', comment: '#444444', panicFg: '#990000', panicBg: '#FFF0F0', contrast: '18.25:1', oklch: 'L=100% C=0.000 h=0°', paultol: 'ISO 9241-303', systems: 'ColorBrewer • ISO 9241-303' }
    };

    let activeSystem = 'all';
    let activeThemeId = 'default';
    let activeLang = 'python';

    function renderThemeTabs() {
      const tabsContainer = document.getElementById('theme-tabs');
      tabsContainer.innerHTML = '';
      
      const filtered = themeMetadata.filter(t => activeSystem === 'all' || t.systems.includes(activeSystem));
      
      filtered.forEach((t, idx) => {
        const btn = document.createElement('button');
        btn.className = 'tab-btn' + (t.id === activeThemeId ? ' active' : '');
        btn.innerHTML = \`<span class="swatch-dot" style="background:\${t.swatch}"></span> \${t.name}\`;
        btn.onclick = () => selectTheme(t.id);
        tabsContainer.appendChild(btn);
      });

      // If active theme is not in filtered list, auto-select first
      if (!filtered.some(t => t.id === activeThemeId) && filtered.length > 0) {
        selectTheme(filtered[0].id);
      }
    }

    function selectTheme(themeId) {
      activeThemeId = themeId;
      renderThemeTabs();
      updateEditor();
    }

    function selectSystem(system) {
      activeSystem = system;
      document.querySelectorAll('#system-filters .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.system === system);
      });
      renderThemeTabs();
    }

    function selectLang(lang) {
      activeLang = lang;
      document.querySelectorAll('#lang-tabs .lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
      });
      updateEditor();
    }

    function updateEditor() {
      const palette = themesPalette[activeThemeId] || themesPalette.default;
      const themeObj = themeMetadata.find(t => t.id === activeThemeId);
      const sample = codeSamples[activeLang] || codeSamples.python;

      // Update Card Styling
      const card = document.getElementById('editor-card');
      card.style.backgroundColor = palette.bg;
      card.style.color = palette.fg;

      const topbar = document.getElementById('editor-topbar');
      topbar.style.backgroundColor = palette.headerBg;
      topbar.style.color = palette.keyword;

      document.getElementById('editor-filename').textContent = \`\${sample.filename} — \${themeObj.name}\`;

      // Update Telemetry
      document.getElementById('tel-canvas').textContent = palette.bg;
      document.getElementById('tel-oklch').textContent = palette.oklch;
      document.getElementById('tel-contrast').textContent = palette.contrast;
      document.getElementById('tel-paultol').textContent = palette.paultol;
      document.getElementById('tel-systems').textContent = palette.systems;

      // Render Code
      const body = document.getElementById('editor-body');
      body.innerHTML = sample.code(palette);
    }

    // Initialize System Filter Listeners
    document.querySelectorAll('#system-filters .tab-btn').forEach(btn => {
      btn.onclick = () => selectSystem(btn.dataset.system);
    });

    // Initialize Language Listeners
    document.querySelectorAll('#lang-tabs .lang-btn').forEach(btn => {
      btn.onclick = () => selectLang(btn.dataset.lang);
    });

    // Toggle Listeners
    document.getElementById('toggle-error-lens').onchange = (e) => {
      document.getElementById('editor-card').classList.toggle('no-error-lens', !e.target.checked);
    };
    document.getElementById('toggle-indent').onchange = (e) => {
      document.getElementById('editor-card').classList.toggle('no-indent', !e.target.checked);
    };

    // Keyboard navigation shortcuts
    window.addEventListener('keydown', (e) => {
      const filtered = themeMetadata.filter(t => activeSystem === 'all' || t.systems.includes(activeSystem));
      const currentIndex = filtered.findIndex(t => t.id === activeThemeId);

      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10) - 1;
        if (num < filtered.length) selectTheme(filtered[num].id);
      } else if (e.key === '0' && filtered.length >= 10) {
        selectTheme(filtered[9].id);
      } else if (e.key === 'ArrowRight') {
        const next = (currentIndex + 1) % filtered.length;
        selectTheme(filtered[next].id);
      } else if (e.key === 'ArrowLeft') {
        const prev = (currentIndex - 1 + filtered.length) % filtered.length;
        selectTheme(filtered[prev].id);
      }
    });

    // Initial Render
    renderThemeTabs();
    updateEditor();
  </script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, htmlContent, 'utf8');
console.log('✅ Generated Interactive Theme Showcase Gallery at docs/previews/gallery.html');
