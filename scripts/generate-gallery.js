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

// Read all 20 theme definitions (10 Light + 10 Night)
const themeFiles = [
  { id: 'default', file: 'zerotosaas-light.json', name: 'ZeroToSaaS Light (Default)', icon: '💡', swatch: '#0B4F9C', systems: ['oklch', 'colorbrewer', 'fm100'], cvd: 'standard', desc: 'Cobalt-Slate balanced core palette', mode: 'light' },
  { id: 'green', file: 'zerotosaas-green.json', name: 'Forest Calm (Green)', icon: '🌲', swatch: '#096032', systems: ['oklch', 'colorbrewer', 'fm100'], cvd: 'standard', desc: 'Restful botanical green palette', mode: 'light' },
  { id: 'yellow', file: 'zerotosaas-yellow.json', name: 'Golden Sand (Yellow)', icon: '☀️', swatch: '#6E4E00', systems: ['oklch', 'colorbrewer'], cvd: 'standard', desc: 'High-acuity warm amber-gold', mode: 'light' },
  { id: 'orange', file: 'zerotosaas-orange.json', name: 'Terracotta (Orange)', icon: '🔥', swatch: '#943800', systems: ['oklch'], cvd: 'standard', desc: 'Warm earth terracotta tone', mode: 'light' },
  { id: 'brown', file: 'zerotosaas-brown.json', name: 'Warm Sepia (Brown)', icon: '☕', swatch: '#5C2C06', systems: ['oklch', 'fm100'], cvd: 'standard', desc: 'Earthy sepia low-strain palette', mode: 'light' },
  { id: 'purple', file: 'zerotosaas-purple.json', name: 'Royal Plum (Purple)', icon: '🔮', swatch: '#6B21A8', systems: ['oklch'], cvd: 'standard', desc: 'Deep royal plum chromatic balance', mode: 'light' },
  { id: 'deuteranopia', file: 'zerotosaas-deuteranopia.json', name: 'Deuteranopia Safe (Blue/Amber)', icon: '🌐', swatch: '#0043A4', systems: ['paultol'], cvd: 'deuteranopia', desc: 'SRON 470nm/600nm isolated axes', mode: 'light' },
  { id: 'protanopia', file: 'zerotosaas-protanopia.json', name: 'Protanopia Safe (Magenta/Teal)', icon: '🌐', swatch: '#8C0064', systems: ['paultol'], cvd: 'protanopia', desc: 'SRON Magenta/Teal photoreceptor isolation', mode: 'light' },
  { id: 'tritanopia', file: 'zerotosaas-tritanopia.json', name: 'Tritanopia Safe (Crimson/Cyan)', icon: '🌐', swatch: '#A00028', systems: ['paultol'], cvd: 'tritanopia', desc: 'Crimson/Cyan photoreceptor isolation', mode: 'light' },
  { id: 'high-contrast', file: 'zerotosaas-high-contrast.json', name: 'High Contrast (ISO 9241-303)', icon: '⚡', swatch: '#002D80', systems: ['colorbrewer'], cvd: 'high-contrast', desc: 'Maximum 18.25:1 text acuity', mode: 'light' },
  { id: 'default-night', file: 'zerotosaas-light-night.json', name: 'ZeroToSaaS Light Night (Default)', icon: '�', swatch: '#63A3DE', systems: ['oklch', 'colorbrewer', 'fm100'], cvd: 'standard', desc: 'Dark cobalt-slate, glare-free night coding', mode: 'dark' },
  { id: 'green-night', file: 'zerotosaas-green-night.json', name: 'Forest Calm Night (Green)', icon: '🌲', swatch: '#6DB885', systems: ['oklch', 'colorbrewer', 'fm100'], cvd: 'standard', desc: 'Dark cypress & cedar tones', mode: 'dark' },
  { id: 'yellow-night', file: 'zerotosaas-yellow-night.json', name: 'Golden Sand Night (Yellow)', icon: '☀️', swatch: '#C19F61', systems: ['oklch', 'colorbrewer'], cvd: 'standard', desc: 'Dark amber bronze & sandstone', mode: 'dark' },
  { id: 'orange-night', file: 'zerotosaas-orange-night.json', name: 'Terracotta Night (Orange)', icon: '🔥', swatch: '#E9875D', systems: ['oklch'], cvd: 'standard', desc: 'Dark burnt orange & rich bronze', mode: 'dark' },
  { id: 'brown-night', file: 'zerotosaas-brown-night.json', name: 'Warm Sepia Night (Brown)', icon: '☕', swatch: '#CF9673', systems: ['oklch', 'fm100'], cvd: 'standard', desc: 'Dark warm espresso & walnut tones', mode: 'dark' },
  { id: 'purple-night', file: 'zerotosaas-purple-night.json', name: 'Royal Plum Night (Purple)', icon: '🔮', swatch: '#BD87F4', systems: ['oklch'], cvd: 'standard', desc: 'Dark iris & midnight-plum tones', mode: 'dark' },
  { id: 'deuteranopia-night', file: 'zerotosaas-deuteranopia-night.json', name: 'Deuteranopia Night (Blue/Amber)', icon: '🌐', swatch: '#55A5F2', systems: ['paultol'], cvd: 'deuteranopia', desc: 'Dark SRON 470nm/600nm isolated axes', mode: 'dark' },
  { id: 'protanopia-night', file: 'zerotosaas-protanopia-night.json', name: 'Protanopia Night (Magenta/Teal)', icon: '🌐', swatch: '#ED75B5', systems: ['paultol'], cvd: 'protanopia', desc: 'Dark SRON Magenta/Teal isolation', mode: 'dark' },
  { id: 'tritanopia-night', file: 'zerotosaas-tritanopia-night.json', name: 'Tritanopia Night (Crimson/Cyan)', icon: '🌐', swatch: '#FC7291', systems: ['paultol'], cvd: 'tritanopia', desc: 'Dark Crimson/Cyan photoreceptor isolation', mode: 'dark' },
  { id: 'high-contrast-night', file: 'zerotosaas-high-contrast-night.json', name: 'High Contrast Night (ISO 9241-303)', icon: '⚡', swatch: '#5B9BD6', systems: ['colorbrewer'], cvd: 'high-contrast', desc: 'Dark ultra-clear contrast, white borders', mode: 'dark' }
];

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZeroToSaaS Accessibility Theme Suite — Interactive Gallery & Playground</title>
  <style>
    :root {
      --theme-bg: #FCFCFD;
      --theme-fg: #111827;
      --theme-header-bg: #F3F6FA;
      --theme-card-bg: #FFFFFF;
      --theme-card-border: #E2E8F0;
      --theme-primary: #0B4F9C;
      --theme-func: #4F2683;
      --theme-type: #0B6229;
      --theme-constant: #784A00;
      --theme-comment: #485260;
      --theme-subtle-bg: rgba(11, 79, 156, 0.04);
      --font-mono: 'Geist Mono', 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background: var(--theme-bg);
      color: var(--theme-fg);
      padding: 1.25rem 1.5rem;
      line-height: 1.45;
      transition: background 0.2s ease, color 0.2s ease;
    }
    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.85rem;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--theme-card-border);
      transition: border-color 0.2s ease;
    }
    .top-header h1 {
      font-size: 1.5rem;
      color: var(--theme-primary);
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.2s ease;
    }
    .header-links { display: flex; gap: 0.5rem; }
    .link-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      background: var(--theme-card-bg);
      color: var(--theme-primary);
      border: 1px solid var(--theme-card-border);
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      transition: all 0.2s ease;
    }
    .link-btn:hover { background: var(--theme-header-bg); }

    /* Mobile: header links wrap to next row below heading */
    @media (max-width: 720px) {
      .top-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.65rem;
      }
      .header-links {
        width: 100%;
        flex-wrap: wrap;
      }
    }

    /* Collapsible dropdown groups (sidebar) */
    .dropdown-group {
      margin-bottom: 0.5rem;
    }
    .dropdown-group:last-child { margin-bottom: 0; }
    .dropdown-header {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--theme-primary);
      display: flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      padding: 0.5rem 0.65rem;
      border: 1px solid var(--theme-card-border);
      border-radius: 6px;
      background: var(--theme-card-bg);
      transition: all 0.15s ease;
      user-select: none;
    }
    .dropdown-header:hover { background: var(--theme-header-bg); }
    .dropdown-arrow {
      margin-left: auto;
      font-size: 0.7rem;
      transition: transform 0.2s ease;
    }
    .dropdown-group.open .dropdown-arrow { transform: rotate(90deg); }
    .dropdown-body {
      display: none;
      padding: 0.5rem 0.65rem 0.65rem;
    }
    .dropdown-group.open .dropdown-body { display: block; }

    /* 2-Column Responsive Grid Layout */
    .app-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 1.25rem;
      align-items: start;
    }
    @media (max-width: 1080px) {
      .app-layout { grid-template-columns: 1fr; }
    }

    /* Left Sidebar: Controls & System Filters */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .panel-card {
      background: var(--theme-card-bg);
      border: 1px solid var(--theme-card-border);
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
      transition: all 0.2s ease;
    }
    .panel-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--theme-primary);
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      border-bottom: 1px solid var(--theme-card-border);
      padding-bottom: 0.4rem;
      transition: all 0.2s ease;
    }

    /* System Tabs & Theme Buttons */
    .system-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 0.85rem;
    }
    .system-group:last-child { margin-bottom: 0; }
    .system-title {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--theme-primary);
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: color 0.2s ease;
    }
    .theme-chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }
    .theme-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid var(--theme-card-border);
      background: var(--theme-card-bg);
      color: var(--theme-fg);
      transition: all 0.15s ease;
      user-select: none;
      text-align: left;
    }
    .theme-chip:hover {
      background: var(--theme-header-bg);
    }
    .theme-chip.active {
      background: var(--theme-primary);
      color: #FFFFFF;
      border-color: var(--theme-primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    .swatch-circle {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.85);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.15);
      display: inline-block;
      flex-shrink: 0;
    }

    /* CVD Selection Cards */
    .cvd-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .cvd-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.65rem;
      border: 1px solid var(--theme-card-border);
      border-radius: 6px;
      background: var(--theme-card-bg);
      cursor: pointer;
      font-size: 0.82rem;
      color: var(--theme-fg);
      transition: all 0.15s ease;
    }
    .cvd-item:hover { background: var(--theme-header-bg); }
    .cvd-item.active {
      background: var(--theme-subtle-bg);
      border-color: var(--theme-primary);
      color: var(--theme-primary);
      font-weight: 600;
    }
    .cvd-info { display: flex; flex-direction: column; }
    .cvd-name { font-weight: 600; }
    .cvd-sub { font-size: 0.72rem; color: var(--theme-comment); }

    /* Live Telemetry Card */
    .telemetry-card {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      background: var(--theme-card-bg);
      border: 1px solid var(--theme-card-border);
      border-radius: 6px;
      padding: 0.65rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      color: var(--theme-fg);
      transition: all 0.2s ease;
    }
    .tel-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .tel-label { color: var(--theme-comment); }
    .tel-val { font-weight: 700; color: var(--theme-primary); }

    /* Right Column: Viewport & Tabbed Interface */
    .viewport {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .view-tabs-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--theme-card-bg);
      border: 1px solid var(--theme-card-border);
      border-radius: 8px;
      padding: 0.4rem 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .main-tabs { display: flex; gap: 0.4rem; }
    .main-tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 1rem;
      border-radius: 6px;
      font-size: 0.88rem;
      font-weight: 600;
      border: 1px solid transparent;
      background: transparent;
      color: var(--theme-fg);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .main-tab-btn:hover { background: var(--theme-header-bg); }
    .main-tab-btn.active {
      background: var(--theme-primary);
      color: #FFFFFF;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }

    /* Sub-bar for Code Editor: Languages & Toggles */
    .code-subbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.65rem;
      background: var(--theme-card-bg);
      border: 1px solid var(--theme-card-border);
      border-radius: 8px;
      padding: 0.45rem 0.75rem;
      color: var(--theme-fg);
      transition: all 0.2s ease;
    }
    .lang-chips { display: flex; flex-wrap: wrap; gap: 0.3rem; }
    .lang-chip {
      padding: 0.25rem 0.55rem;
      border-radius: 5px;
      font-size: 0.78rem;
      font-weight: 600;
      border: 1px solid var(--theme-card-border);
      background: var(--theme-card-bg);
      color: var(--theme-fg);
      cursor: pointer;
      font-family: var(--font-mono);
      transition: all 0.15s ease;
    }
    .lang-chip:hover { background: var(--theme-header-bg); }
    .lang-chip.active {
      background: var(--theme-primary);
      color: #FFFFFF;
      border-color: var(--theme-primary);
    }
    .toggles-group {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      font-size: 0.78rem;
      color: var(--theme-fg);
    }
    .toggle-label {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      cursor: pointer;
      font-weight: 500;
      user-select: none;
    }

    /* TAB 1: LIVE SAMPLE DASHBOARD */
    .dashboard-container {
      background: var(--theme-card-bg);
      border: 1px solid var(--theme-card-border);
      border-radius: 10px;
      padding: 1.25rem;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      color: var(--theme-fg);
      transition: all 0.2s ease;
    }
    .dash-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 0.85rem;
    }
    .metric-card {
      border: 1px solid var(--theme-card-border);
      border-radius: 8px;
      padding: 0.85rem 1rem;
      background: var(--theme-subtle-bg);
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      transition: all 0.2s ease;
    }
    .metric-label { font-size: 0.78rem; font-weight: 600; color: var(--theme-comment); }
    .metric-val { font-size: 1.45rem; font-weight: 700; color: var(--theme-fg); font-family: var(--font-mono); }
    .metric-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 4px;
      align-self: flex-start;
    }

    /* Data Table */
    .dash-table-wrap {
      border: 1px solid var(--theme-card-border);
      border-radius: 8px;
      overflow: hidden;
      transition: border-color 0.2s ease;
    }
    .dash-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      text-align: left;
    }
    .dash-table th {
      background: var(--theme-header-bg);
      padding: 0.5rem 0.75rem;
      font-weight: 700;
      color: var(--theme-primary);
      border-bottom: 1px solid var(--theme-card-border);
      font-size: 0.75rem;
      transition: all 0.2s ease;
    }
    .dash-table td {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid var(--theme-card-border);
      color: var(--theme-fg);
      transition: all 0.2s ease;
    }
    .dash-table tr:last-child td { border-bottom: none; }
    .table-mono { font-family: var(--font-mono); font-size: 0.78rem; }

    /* Dashboard Chart Card */
    .dash-chart-card {
      border: 1px solid var(--theme-card-border);
      border-radius: 8px;
      padding: 1rem 1.15rem;
      background: var(--theme-card-bg);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: all 0.2s ease;
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .chart-title { font-size: 0.92rem; font-weight: 700; color: var(--theme-primary); }
    .chart-sub { font-size: 0.78rem; color: var(--theme-comment); margin-top: 0.15rem; }
    .chart-legend {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--theme-comment);
    }
    .legend-item { display: inline-flex; align-items: center; gap: 0.35rem; }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
    .chart-svg-wrap {
      width: 100%;
      height: 125px;
      overflow: hidden;
    }
    .chart-svg { width: 100%; height: 100%; display: block; }
    .chart-x-axis {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      font-family: var(--font-mono);
      color: var(--theme-comment);
      padding-top: 0.25rem;
      border-top: 1px solid var(--theme-card-border);
    }

    /* Dashboard Signup Card */
    .dash-signup-card {
      border: 1px solid var(--theme-card-border);
      border-radius: 8px;
      padding: 1.15rem;
      background: var(--theme-card-bg);
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      transition: all 0.2s ease;
    }
    .signup-header {
      border-bottom: 1px solid var(--theme-card-border);
      padding-bottom: 0.5rem;
    }
    .signup-title { font-size: 0.95rem; font-weight: 700; color: var(--theme-primary); }
    .signup-sub { font-size: 0.78rem; color: var(--theme-comment); margin-top: 0.15rem; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.85rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .form-label { font-size: 0.78rem; font-weight: 600; color: var(--theme-fg); }
    .form-input, .form-select {
      padding: 0.42rem 0.65rem;
      border-radius: 6px;
      border: 1px solid var(--theme-card-border);
      font-size: 0.82rem;
      font-family: var(--font-sans);
      outline: none;
      background: var(--theme-card-bg);
      color: var(--theme-fg);
      transition: border-color 0.15s ease;
    }
    .form-input:focus, .form-select:focus {
      border-color: var(--theme-primary);
      box-shadow: 0 0 0 2px var(--theme-subtle-bg);
    }
    .form-hint { font-size: 0.72rem; color: var(--theme-comment); }
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding-top: 0.15rem;
    }
    .radio-label, .checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      cursor: pointer;
      font-size: 0.78rem;
      color: var(--theme-fg);
      font-weight: 500;
    }
    .form-checkbox-row {
      padding-top: 0.25rem;
    }
    .form-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-top: 0.65rem;
      border-top: 1px solid var(--theme-card-border);
    }

    /* Interactive Elements in Dashboard */
    .dash-actions-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--theme-card-border);
    }
    .dash-btn-group { display: flex; gap: 0.5rem; }
    .btn {
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
    }
    .btn-primary { background: var(--theme-primary); color: #FFFFFF; }
    .btn-secondary { background: var(--theme-header-bg); color: var(--theme-fg); border-color: var(--theme-card-border); }
    .dash-search-input {
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      border: 1px solid var(--theme-card-border);
      font-size: 0.82rem;
      font-family: var(--font-sans);
      outline: none;
      width: 220px;
      background: var(--theme-card-bg);
      color: var(--theme-fg);
    }

    /* =========================================================================
       TAB 2: LIVE CODE IDE EDITOR (Single-Line Compact Row Spacing)
       ========================================================================= */
    .editor-card {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      border: 1px solid #CBD5E1;
      font-family: var(--font-mono);
      font-size: 12.5px;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .editor-topbar {
      padding: 0.45rem 0.85rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      font-size: 11.5px;
      font-weight: 600;
    }
    .window-dots { display: flex; gap: 5px; align-items: center; }
    .dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; }
    .dot-red { background: #FF5F56; }
    .dot-yellow { background: #FFBD2E; }
    .dot-green { background: #27C93F; }

    /* Single-Line Compact Spacing: No white-space: pre on body */
    .editor-body {
      padding: 0.75rem 1rem;
      overflow-x: auto;
      line-height: 1.35;
      font-size: 12.5px;
    }
    .line {
      display: flex;
      align-items: baseline;
      min-height: 19px;
      line-height: 1.35;
      margin: 0;
      padding: 1px 0;
    }
    .ln {
      width: 2.25rem;
      user-select: none;
      opacity: 0.45;
      text-align: right;
      padding-right: 0.75rem;
      font-size: 11.5px;
      flex-shrink: 0;
      font-family: var(--font-mono);
    }
    .code {
      flex: 1;
      white-space: pre;
      font-family: var(--font-mono);
    }

    /* Alternating Indent Guides */
    .indent-odd { background-color: rgba(11, 79, 156, 0.05); display: inline-block; }
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
      font-size: 0.88em;
      margin-left: 0.85rem;
      opacity: 0.9;
    }
    .error-lens-err { color: #990014; }
    .error-lens-warn { color: #8C3800; }
    .no-error-lens .error-lens { display: none; }
    .no-firewall .status-panic { background: transparent !important; border: none !important; color: inherit !important; }
  </style>
</head>
<body>

  <div class="top-header">
    <div>
      <h1>🔬 Zerotosaas Quad-System Interactive Gallery</h1>
      <p style="font-size:0.85rem; color:#64748B;">Explore all 10 themes across Oklch, Paul Tol Cvd, Colorbrewer, and Fm 100-Hue systems.</p>
    </div>
    <div class="header-links">
      <a href="../Validation.md" class="link-btn">📊 Validation Report</a>
      <a href="../Guidelines.md" class="link-btn">🏥 Medical Guidelines</a>
      <a href="../../README.md" class="link-btn">🏠 Readme</a>
    </div>
  </div>

  <!-- 2-Column App Layout -->
  <div class="app-layout">
    
    <!-- LEFT COLUMN: System & Theme Selectors -->
    <aside class="sidebar">

      <!-- Merged dropdown: Color Science Systems + CVD Calibration -->
      <div class="panel-card">
        <div class="panel-title">
          <span>🎨 Color Science & Calibration</span>
        </div>

        <div class="dropdown-group open">
          <div class="dropdown-header">
            <span>📐 OkLCH (Oklab Uniform Lightness)</span>
            <span class="dropdown-arrow">▶</span>
          </div>
          <div class="dropdown-body">
            <div class="theme-chip-list">
              <button class="theme-chip active" data-theme="default"><span class="swatch-circle" style="background:#0B4F9C"></span> Default</button>
              <button class="theme-chip" data-theme="green"><span class="swatch-circle" style="background:#096032"></span> Forest</button>
              <button class="theme-chip" data-theme="yellow"><span class="swatch-circle" style="background:#6E4E00"></span> Gold</button>
              <button class="theme-chip" data-theme="orange"><span class="swatch-circle" style="background:#943800"></span> Terracotta</button>
              <button class="theme-chip" data-theme="brown"><span class="swatch-circle" style="background:#5C2C06"></span> Sepia</button>
              <button class="theme-chip" data-theme="purple"><span class="swatch-circle" style="background:#6B21A8"></span> Plum</button>
              <button class="theme-chip" data-theme="default-night"><span class="swatch-circle" style="background:#63A3DE"></span> Light Night</button>
            </div>
          </div>
        </div>

        <div class="dropdown-group">
          <div class="dropdown-header">
            <span>🧪 Paul Tol's CVD-Safe (SRON)</span>
            <span class="dropdown-arrow">▶</span>
          </div>
          <div class="dropdown-body">
            <div class="theme-chip-list">
              <button class="theme-chip" data-theme="deuteranopia"><span class="swatch-circle" style="background:#0043A4"></span> Deuteranopia (Blue/Amber)</button>
              <button class="theme-chip" data-theme="protanopia"><span class="swatch-circle" style="background:#8C0064"></span> Protanopia (Magenta/Teal)</button>
              <button class="theme-chip" data-theme="tritanopia"><span class="swatch-circle" style="background:#A00028"></span> Tritanopia (Crimson/Cyan)</button>
            </div>
          </div>
        </div>

        <div class="dropdown-group">
          <div class="dropdown-header">
            <span>🎨 ColorBrewer Framework (IA Scales)</span>
            <span class="dropdown-arrow">▶</span>
          </div>
          <div class="dropdown-body">
            <div class="theme-chip-list">
              <button class="theme-chip" data-theme="default"><span class="swatch-circle" style="background:#0B4F9C"></span> Light</button>
              <button class="theme-chip" data-theme="high-contrast"><span class="swatch-circle" style="background:#002D80"></span> High Contrast</button>
              <button class="theme-chip" data-theme="green"><span class="swatch-circle" style="background:#096032"></span> Forest</button>
              <button class="theme-chip" data-theme="yellow"><span class="swatch-circle" style="background:#6E4E00"></span> Gold</button>
            </div>
          </div>
        </div>

        <div class="dropdown-group">
          <div class="dropdown-header">
            <span>👁️ Farnsworth-Munsell 100-Hue (Clinical)</span>
            <span class="dropdown-arrow">▶</span>
          </div>
          <div class="dropdown-body">
            <div class="theme-chip-list">
              <button class="theme-chip" data-theme="default"><span class="swatch-circle" style="background:#0B4F9C"></span> Default</button>
              <button class="theme-chip" data-theme="green"><span class="swatch-circle" style="background:#096032"></span> Forest</button>
              <button class="theme-chip" data-theme="brown"><span class="swatch-circle" style="background:#5C2C06"></span> Sepia</button>
              <button class="theme-chip" data-theme="tritanopia"><span class="swatch-circle" style="background:#A00028"></span> Tritanopia</button>
            </div>
          </div>
        </div>

        <div class="dropdown-group">
          <div class="dropdown-header">
            <span>👁️ Color Blindness & Calibration</span>
            <span class="dropdown-arrow">▶</span>
          </div>
          <div class="dropdown-body">
            <div class="cvd-list">
              <div class="cvd-item active" data-theme="default">
                <span class="swatch-circle" style="background:#0B4F9C"></span>
                <div class="cvd-info">
                  <span class="cvd-name">Standard Trichromatic</span>
                  <span class="cvd-sub">Normal vision • 100% WCAG AAA</span>
                </div>
              </div>
              <div class="cvd-item" data-theme="deuteranopia">
                <span class="swatch-circle" style="background:#0043A4"></span>
                <div class="cvd-info">
                  <span class="cvd-name">Deuteranopia (Green-Weak)</span>
                  <span class="cvd-sub">~6% of males • Blue/Amber 470nm/600nm</span>
                </div>
              </div>
              <div class="cvd-item" data-theme="protanopia">
                <span class="swatch-circle" style="background:#8C0064"></span>
                <div class="cvd-info">
                  <span class="cvd-name">Protanopia (Red-Weak)</span>
                  <span class="cvd-sub">~2% of males • Magenta/Teal isolation</span>
                </div>
              </div>
              <div class="cvd-item" data-theme="tritanopia">
                <span class="swatch-circle" style="background:#A00028"></span>
                <div class="cvd-info">
                  <span class="cvd-name">Tritanopia (Blue-Weak)</span>
                  <span class="cvd-sub">~0.01% • Crimson/Cyan isolation</span>
                </div>
              </div>
              <div class="cvd-item" data-theme="high-contrast">
                <span class="swatch-circle" style="background:#002D80"></span>
                <div class="cvd-info">
                  <span class="cvd-name">High Contrast (ISO 9241-303)</span>
                  <span class="cvd-sub">Low vision • Maximum 18.25:1 contrast</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Telemetry Card -->
      <div class="telemetry-card">
        <div class="tel-row">
          <span class="tel-label">Canvas Color:</span>
          <span class="tel-val" id="tel-canvas">#FCFCFD</span>
        </div>
        <div class="tel-row">
          <span class="tel-label">OkLCH Uniformity:</span>
          <span class="tel-val" id="tel-oklch">L=98.9% C=0.003</span>
        </div>
        <div class="tel-row">
          <span class="tel-label">Base Contrast:</span>
          <span class="tel-val" id="tel-contrast">17.30:1 (AAA)</span>
        </div>
        <div class="tel-row">
          <span class="tel-label">Paul Tol Distance:</span>
          <span class="tel-val" id="tel-paultol">ΔE ≥ 0.18</span>
        </div>
      </div>
    </aside>

    <!-- RIGHT COLUMN: Interactive Viewport -->
    <main class="viewport">
      
      <!-- View Switcher Tabs Header -->
      <div class="view-tabs-header">
        <div class="main-tabs">
          <button class="main-tab-btn" id="btn-tab-dash">📊 1. Sample Dashboard</button>
          <button class="main-tab-btn active" id="btn-tab-code">💻 2. IDE Code Editor</button>
        </div>
        <span style="font-size:0.75rem; color:#64748B;">Keyboard: <kbd>1</kbd>–<kbd>9</kbd> switch themes</span>
      </div>

      <!-- VIEW 1: SAMPLE DASHBOARD PREVIEW -->
      <div class="dashboard-container" id="view-dashboard" style="display:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #E2E8F0; padding-bottom:0.75rem;">
          <div>
            <h2 id="dash-title" style="font-size:1.15rem; font-weight:700;">ZeroToSaaS Enterprise Telemetry Dashboard</h2>
            <p style="font-size:0.8rem; color:#64748B;">Real-time infrastructure health, cognitive status logs, and contract validation.</p>
          </div>
          <span id="dash-badge" class="status-tag status-safe">100% Wcag Aaa Compliant</span>
        </div>

        <!-- Metrics Cards -->
        <div class="dash-metrics-grid">
          <div class="metric-card" id="m-card-1">
            <span class="metric-label">Cluster Nodes</span>
            <span class="metric-val" id="m-val-1">128 / 128</span>
            <span class="metric-badge status-safe">Safe (🟢) 100% Online</span>
          </div>
          <div class="metric-card" id="m-card-2">
            <span class="metric-label">Memory Utilization</span>
            <span class="metric-val" id="m-val-2">42.8 GB</span>
            <span class="metric-badge status-caution">Caution (🟡) 78% Peak</span>
          </div>
          <div class="metric-card" id="m-card-3">
            <span class="metric-label">Pending Ingestion</span>
            <span class="metric-val" id="m-val-3">1,492 / sec</span>
            <span class="metric-badge status-warning">Warning (🟠) Rate Limit</span>
          </div>
          <div class="metric-card" id="m-card-4">
            <span class="metric-label">Security Alerts</span>
            <span class="metric-val" id="m-val-4">0 Critical</span>
            <span class="metric-badge status-panic">Panic (🔴) Trapped</span>
          </div>
        </div>

        <!-- 24-Hour Telemetry Stream Chart -->
        <div class="dash-chart-card" id="chart-card">
          <div class="chart-header">
            <div>
              <h3 class="chart-title">24-Hour Telemetry Throughput & Threat Intercepts</h3>
              <p class="chart-sub">Perceptually calibrated time-series stream across 128 cluster nodes</p>
            </div>
            <div class="chart-legend">
              <span class="legend-item"><span class="legend-dot" style="background:#0B6229;"></span> Safe Ops</span>
              <span class="legend-item"><span class="legend-dot" style="background:#784A00;"></span> Caution Spikes</span>
              <span class="legend-item"><span class="legend-dot" style="background:#8C3800;"></span> Warning Retries</span>
              <span class="legend-item"><span class="legend-dot" style="background:#990014;"></span> Panic Blocked</span>
            </div>
          </div>
          <div class="chart-svg-wrap">
            <svg viewBox="0 0 720 180" class="chart-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#0284C7" stop-opacity="0.25" id="grad-stop-1" />
                  <stop offset="100%" stop-color="#0284C7" stop-opacity="0.0" id="grad-stop-2" />
                </linearGradient>
              </defs>
              <line x1="0" y1="30" x2="720" y2="30" stroke="#E2E8F0" stroke-dasharray="4" />
              <line x1="0" y1="75" x2="720" y2="75" stroke="#E2E8F0" stroke-dasharray="4" />
              <line x1="0" y1="120" x2="720" y2="120" stroke="#E2E8F0" stroke-dasharray="4" />
              <line x1="0" y1="165" x2="720" y2="165" stroke="#CBD5E1" />
              <path id="chart-area" d="M 0 165 L 0 110 Q 60 70 120 95 T 240 60 T 360 85 T 480 40 T 600 70 T 720 35 L 720 165 Z" fill="url(#chartGrad)" />
              <path id="chart-line" d="M 0 110 Q 60 70 120 95 T 240 60 T 360 85 T 480 40 T 600 70 T 720 35" fill="none" stroke="#0284C7" stroke-width="2.5" />
              <circle cx="120" cy="95" r="4.5" fill="#0B6229" stroke="#FFFFFF" stroke-width="2" />
              <circle cx="240" cy="60" r="4.5" fill="#784A00" stroke="#FFFFFF" stroke-width="2" />
              <circle cx="480" cy="40" r="4.5" fill="#8C3800" stroke="#FFFFFF" stroke-width="2" />
              <circle cx="600" cy="70" r="5.5" fill="#990014" stroke="#FFFFFF" stroke-width="2" />
              <circle cx="720" cy="35" r="4.5" fill="#0B6229" stroke="#FFFFFF" stroke-width="2" />
            </svg>
          </div>
          <div class="chart-x-axis">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>Now (Live)</span>
          </div>
        </div>

        <!-- Data Table -->
        <div class="dash-table-wrap">
          <table class="dash-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Status</th>
                <th>Cluster Id</th>
                <th>Avg Latency</th>
                <th>Security Verification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>auth-pipeline-v2</strong></td>
                <td><span class="status-tag status-safe">Safe (🟢) Verified</span></td>
                <td class="table-mono">e8a1f2b4-7c9d-4e1a-8f3b-0123456789ab</td>
                <td class="table-mono">1.24 ms</td>
                <td><span style="color:#0B6229; font-weight:600;">✓ Pass</span></td>
              </tr>
              <tr>
                <td><strong>session-cache-redis</strong></td>
                <td><span class="status-tag status-caution">Caution (🟡) Elevated</span></td>
                <td class="table-mono">9b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e</td>
                <td class="table-mono">4.88 ms</td>
                <td><span style="color:#784A00; font-weight:600;">! Review</span></td>
              </tr>
              <tr>
                <td><strong>async-export-worker</strong></td>
                <td><span class="status-tag status-warning">Warning (🟠) Retrying</span></td>
                <td class="table-mono">3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d</td>
                <td class="table-mono">14.10 ms</td>
                <td><span style="color:#8C3800; font-weight:600;">⚠ Deprecated</span></td>
              </tr>
              <tr>
                <td><strong>key-vault-scanner</strong></td>
                <td><span class="status-tag status-panic">Panic (🔴) Blocked</span></td>
                <td class="table-mono">7f8a9b0c-1d2e-3f4a-5b6c-7d8e9f0a1b2c</td>
                <td class="table-mono">0.12 ms</td>
                <td><span style="color:#990014; font-weight:bold;">⛔ Key Trapped</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SaaS Workspace Signup Form -->
        <div class="dash-signup-card" id="signup-card">
          <div class="signup-header">
            <h3 class="signup-title">Provision New SaaS Workspace</h3>
            <p class="signup-sub">Configure enterprise telemetry, authentication scopes, and Human Firewall intercept policies.</p>
          </div>
          
          <form id="dash-signup-form" onsubmit="event.preventDefault(); handleSignupSubmit();">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="org-name">Organization / Workspace Name</label>
                <input type="text" id="org-name" class="form-input" placeholder="e.g. Acme Cloud Systems" value="Acme Enterprise Technologies" required>
                <span class="form-hint">Used for cluster routing and tenant isolation.</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="admin-email">Admin Work Email</label>
                <input type="email" id="admin-email" class="form-input" placeholder="admin@enterprise.io" value="lead.architect@enterprise.io" required>
                <span class="form-hint">Enforces SSO and cryptographic hardware token MFA.</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="cloud-region">Primary Telemetry Region</label>
                <select id="cloud-region" class="form-select">
                  <option value="us-east-1">us-east-1 (N. Virginia — Primary Fabric)</option>
                  <option value="eu-central-1">eu-central-1 (Frankfurt — GDPR Compliant)</option>
                  <option value="ap-south-1">ap-south-1 (Mumbai — Edge Acceleration)</option>
                </select>
                <span class="form-hint">Zero-egress localized data storage.</span>
              </div>

              <div class="form-group">
                <label class="form-label">Security & Firewall Policy</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input type="radio" name="sec-mode" value="standard" checked> Standard Telemetry
                  </label>
                  <label class="radio-label">
                    <input type="radio" name="sec-mode" value="strict"> Strict Human Firewall (Secret Key Trapping)
                  </label>
                </div>
              </div>
            </div>

            <div class="form-checkbox-row">
              <label class="checkbox-label">
                <input type="checkbox" id="chk-wcag" checked> Enable real-time ISO 9241-303 and WCAG AAA compliance telemetry auditing
              </label>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" id="btn-submit-signup">Provision Workspace</button>
              <button type="reset" class="btn btn-secondary">Clear Form</button>
              <span id="signup-status" class="status-tag status-safe" style="display:none; margin-left: auto;">🎉 Workspace Created Successfully</span>
            </div>
          </form>
        </div>

        <!-- Dashboard Action Row -->
        <div class="dash-actions-row">
          <input type="text" class="dash-search-input" placeholder="Search services or UUIDs..." value="cluster-us-east-1">
          <div class="dash-btn-group">
            <button class="btn btn-secondary">Export Telemetry</button>
            <button class="btn btn-primary" id="dash-action-btn">Deploy Configuration</button>
          </div>
        </div>
      </div>

      <!-- VIEW 2: LIVE CODE IDE EDITOR -->
      <div id="view-code">
        <!-- Sub-bar: Language Combo-Radio-Tabs & Feature Toggles -->
        <div class="code-subbar">
          <div class="lang-chips" id="lang-chips">
            <button class="lang-chip active" data-lang="python">Python</button>
            <button class="lang-chip" data-lang="typescript">TypeScript React</button>
            <button class="lang-chip" data-lang="rust">Rust</button>
            <button class="lang-chip" data-lang="go">Go</button>
            <button class="lang-chip" data-lang="sql">Sql</button>
            <button class="lang-chip" data-lang="audit">Audit Log</button>
            <button class="lang-chip" data-lang="config">Cargo.toml</button>
          </div>
          <div class="toggles-group">
            <label class="toggle-label"><input type="checkbox" id="toggle-error-lens" checked> Error Lens</label>
            <label class="toggle-label"><input type="checkbox" id="toggle-indent" checked> Alternating Indents</label>
            <label class="toggle-label"><input type="checkbox" id="toggle-firewall" checked> Human Firewall</label>
          </div>
        </div>

        <!-- IDE Editor Mockup Card (Single-Line Compact Row Spacing) -->
        <div class="editor-card" id="editor-card" style="margin-top: 0.65rem;">
          <div class="editor-topbar" id="editor-topbar">
            <div class="window-dots">
              <span class="dot dot-red"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
              <span id="editor-filename" style="margin-left: 0.65rem;">data_pipeline.py — ZeroToSaaS Light</span>
            </div>
            <span id="editor-badge" class="status-tag status-safe">100% Wcag Aaa Compliant</span>
          </div>
          <div class="editor-body" id="editor-body">
            <!-- Dynamically populated with long, comprehensive single-line code blocks -->
          </div>
        </div>
      </div>

    </main>
  </div>

  <script>
    const themeMetadata = ${JSON.stringify(themeFiles)};
    
    // Large, Comprehensive Single-Line Code Samples Database
    const codeSamples = {
      python: {
        filename: 'data_pipeline.py',
        code: (t) => [
          '<div class="line"><span class="ln">1</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">import</span> <span style="color:' + t.fg + ';">os</span>, <span style="color:' + t.fg + ';">sys</span>, <span style="color:' + t.fg + ';">hashlib</span>, <span style="color:' + t.fg + ';">uuid</span>, <span style="color:' + t.fg + ';">typing</span></span></div>',
          '<div class="line"><span class="ln">2</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">from</span> <span style="color:' + t.fg + ';">dataclasses</span> <span style="color:' + t.keyword + '; font-weight:bold;">import</span> <span style="color:' + t.type + '; font-weight:bold;">dataclass</span>, <span style="color:' + t.type + '; font-weight:bold;">field</span></span></div>',
          '<div class="line"><span class="ln">3</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">from</span> <span style="color:' + t.fg + ';">datetime</span> <span style="color:' + t.keyword + '; font-weight:bold;">import</span> <span style="color:' + t.type + '; font-weight:bold;">datetime</span>, <span style="color:' + t.type + '; font-weight:bold;">timezone</span></span></div>',
          '<div class="line"><span class="ln">4</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">5</span><span class="code"><span style="color:' + t.comment + ';"># =========================================================================</span></span></div>',
          '<div class="line"><span class="ln">6</span><span class="code"><span style="color:' + t.comment + ';"># ZeroToSaaS Quad-System Python Pipeline Calibration</span></span></div>',
          '<div class="line"><span class="ln">7</span><span class="code"><span style="color:' + t.comment + ';"># =========================================================================</span></span></div>',
          '<div class="line"><span class="ln">8</span><span class="code"><span style="color:' + t.type + '; font-weight:bold;">@dataclass</span>(<span style="color:' + t.param + ';">frozen</span>=<span style="color:' + t.constant + '; font-weight:bold;">True</span>)</span></div>',
          '<div class="line"><span class="ln">9</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">class</span> <span style="color:' + t.type + '; font-weight:bold;">SecurityTelemetryRecord</span>:</span></div>',
          '<div class="line"><span class="ln">10</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.comment + ';">"""Immutable cluster node security record with cognitive status tags."""</span></span></div>',
          '<div class="line"><span class="ln">11</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">cluster_uuid</span>: <span style="color:' + t.type + ';">str</span> = <span style="color:' + t.string + ';">"e8a1f2b4-7c9d-4e1a-8f3b-0123456789ab"</span></span></div>',
          '<div class="line"><span class="ln">12</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">worker_count</span>: <span style="color:' + t.type + ';">int</span> = <span style="color:' + t.constant + '; font-weight:bold;">128</span></span></div>',
          '<div class="line"><span class="ln">13</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">is_active</span>: <span style="color:' + t.type + ';">bool</span> = <span style="color:' + t.constant + '; font-weight:bold;">True</span></span></div>',
          '<div class="line"><span class="ln">14</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">vault_api_key</span>: <span style="color:' + t.type + ';">str</span> = <span class="status-panic" style="background:' + t.panicBg + '; color:' + t.panicFg + ';">"AIzaSyD9x82kL90aXyZ1..."</span> <span class="error-lens error-lens-err">🔴 [Panic] Secret Key Exposed</span></span></div>',
          '<div class="line"><span class="ln">15</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">raw_session_jwt</span>: <span style="color:' + t.type + ';">str</span> = <span style="color:' + t.string + ';">"unverified_session_bearer_token"</span> <span class="error-lens error-lens-warn">🟠 [Warning] Unextracted Raw String</span></span></div>',
          '<div class="line"><span class="ln">16</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">17</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">async def</span> <span style="color:' + t.func + '; font-weight:bold;">process_telemetry_batch</span>(</span></div>',
          '<div class="line"><span class="ln">18</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.param + ';">records</span>: <span style="color:' + t.type + ';">list</span>[<span style="color:' + t.type + ';">SecurityTelemetryRecord</span>],</span></div>',
          '<div class="line"><span class="ln">19</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.param + ';">max_retries</span>: <span style="color:' + t.type + ';">int</span> = <span style="color:' + t.constant + '; font-weight:bold;">5</span>,</span></div>',
          '<div class="line"><span class="ln">20</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.param + ';">enforce_firewall</span>: <span style="color:' + t.type + ';">bool</span> = <span style="color:' + t.constant + '; font-weight:bold;">True</span></span></div>',
          '<div class="line"><span class="ln">21</span><span class="code">) -> <span style="color:' + t.type + ';">dict</span>[<span style="color:' + t.type + ';">str</span>, <span style="color:' + t.type + ';">typing.Any</span>]:</span></div>',
          '<div class="line"><span class="ln">22</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.comment + ';"># Indent Level 1 Shaded: Verified safe schema contract</span></span></div>',
          '<div class="line"><span class="ln">23</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="status-tag status-safe">Safe (🟢)</span> <span style="color:' + t.type + '; font-weight:bold;">VerifiedContract</span> = <span style="color:' + t.func + '; font-weight:bold;">validate_batch_contracts</span>(<span style="color:' + t.param + ';">records</span>)</span></div>',
          '<div class="line"><span class="ln">24</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">results_map</span> = {}</span></div>',
          '<div class="line"><span class="ln">25</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">for</span> <span style="color:' + t.fg + ';">rec</span> <span style="color:' + t.keyword + '; font-weight:bold;">in</span> <span style="color:' + t.param + ';">records</span>:</span></div>',
          '<div class="line"><span class="ln">26</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.comment + ';"># Indent Level 2 Transparent: Dynamic evaluation & branch check</span></span></div>',
          '<div class="line"><span class="ln">27</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="status-tag status-caution">Caution (🟡)</span> <span style="color:' + t.keyword + '; font-weight:bold;">if not</span> <span style="color:' + t.fg + ';">rec</span>.<span style="color:' + t.fg + ';">is_active</span>:</span></div>',
          '<div class="line"><span class="ln">28</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.comment + ';"># Indent Level 3 Shaded: Alert & retry logging</span></span></div>',
          '<div class="line"><span class="ln">29</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="status-tag status-warning">Warning (🟠)</span> <span style="color:' + t.func + '; font-weight:bold;">log_node_warning</span>(<span style="color:' + t.string + ';">f"Skipping inactive node: {rec.cluster_uuid}"</span>)</span></div>',
          '<div class="line"><span class="ln">30</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">continue</span></span></div>',
          '<div class="line"><span class="ln">31</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">try</span>:</span></div>',
          '<div class="line"><span class="ln">32</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">hashed_payload</span> = <span style="color:' + t.fg + ';">hashlib</span>.<span style="color:' + t.func + ';">sha256</span>(<span style="color:' + t.fg + ';">rec</span>.<span style="color:' + t.fg + ';">cluster_uuid</span>.<span style="color:' + t.func + ';">encode</span>()).<span style="color:' + t.func + ';">hexdigest</span>()</span></div>',
          '<div class="line"><span class="ln">33</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">results_map</span>[<span style="color:' + t.fg + ';">rec</span>.<span style="color:' + t.fg + ';">cluster_uuid</span>] = <span style="color:' + t.fg + ';">hashed_payload</span></span></div>',
          '<div class="line"><span class="ln">34</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">except</span> <span style="color:' + t.type + '; font-weight:bold;">Exception</span> <span style="color:' + t.keyword + '; font-weight:bold;">as</span> <span style="color:' + t.fg + ';">err</span>:</span></div>',
          '<div class="line"><span class="ln">35</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="status-tag status-panic">Panic (🔴)</span> <span style="color:' + t.func + '; font-weight:bold;">log_critical_fault</span>(<span style="color:' + t.string + ';">"Telemetry calculation crashed"</span>, <span style="color:' + t.param + ';">error</span>=<span style="color:' + t.fg + ';">err</span>)</span></div>',
          '<div class="line"><span class="ln">36</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">return</span> {<span style="color:' + t.string + ';">"status"</span>: <span style="color:' + t.string + ';">"Success"</span>, <span style="color:' + t.string + ';">"records_processed"</span>: <span style="color:' + t.func + ';">len</span>(<span style="color:' + t.fg + ';">results_map</span>)}</span></div>'
        ].join('')
      },
      typescript: {
        filename: 'DashboardWidget.tsx',
        code: (t) => [
          '<div class="line"><span class="ln">1</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">import</span> <span style="color:' + t.fg + ';">React</span>, { <span style="color:' + t.func + ';">useState</span>, <span style="color:' + t.func + ';">useEffect</span>, <span style="color:' + t.func + ';">useMemo</span>, <span style="color:' + t.func + ';">useCallback</span> } <span style="color:' + t.keyword + '; font-weight:bold;">from</span> <span style="color:' + t.string + ';">"react"</span>;</span></div>',
          '<div class="line"><span class="ln">2</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">import</span> { <span style="color:' + t.type + ';">ClusterMetrics</span>, <span style="color:' + t.type + ';">CognitiveStatus</span>, <span style="color:' + t.type + ';">TelemetryPayload</span> } <span style="color:' + t.keyword + '; font-weight:bold;">from</span> <span style="color:' + t.string + ';">"@zerotosaas/telemetry"</span>;</span></div>',
          '<div class="line"><span class="ln">3</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">4</span><span class="code"><span style="color:' + t.comment + ';">// Type-Safe Interface Contract</span></span></div>',
          '<div class="line"><span class="ln">5</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">export interface</span> <span style="color:' + t.type + '; font-weight:bold;">TelemetryProps</span> {</span></div>',
          '<div class="line"><span class="ln">6</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">clusterId</span>: <span style="color:' + t.type + ';">string</span>;</span></div>',
          '<div class="line"><span class="ln">7</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">activeNodes</span>: <span style="color:' + t.type + ';">number</span>;</span></div>',
          '<div class="line"><span class="ln">8</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">onStatusChange</span>?: (<span style="color:' + t.param + ';">status</span>: <span style="color:' + t.type + ';">CognitiveStatus</span>) => <span style="color:' + t.type + ';">void</span>;</span></div>',
          '<div class="line"><span class="ln">9</span><span class="code">}</span></div>',
          '<div class="line"><span class="ln">10</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">11</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">export const</span> <span style="color:' + t.func + '; font-weight:bold;">DashboardWidget</span>: <span style="color:' + t.type + ';">React.FC</span>&lt;<span style="color:' + t.type + ';">TelemetryProps</span>&gt; = ({</span></div>',
          '<div class="line"><span class="ln">12</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.param + ';">clusterId</span>,</span></div>',
          '<div class="line"><span class="ln">13</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.param + ';">activeNodes</span>,</span></div>',
          '<div class="line"><span class="ln">14</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.param + ';">onStatusChange</span></span></div>',
          '<div class="line"><span class="ln">15</span><span class="code">}) => {</span></div>',
          '<div class="line"><span class="ln">16</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">const</span> [<span style="color:' + t.fg + ';">healthState</span>, <span style="color:' + t.func + ';">setHealthState</span>] = <span style="color:' + t.func + ';">useState</span>&lt;<span style="color:' + t.type + ';">string</span>&gt;(<span style="color:' + t.string + ';">"Optimal"</span>);</span></div>',
          '<div class="line"><span class="ln">17</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">const</span> [<span style="color:' + t.fg + ';">records</span>, <span style="color:' + t.func + ';">setRecords</span>] = <span style="color:' + t.func + ';">useState</span>&lt;<span style="color:' + t.type + ';">TelemetryPayload</span>[]&gt;([]);</span></div>',
          '<div class="line"><span class="ln">18</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">19</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">const</span> <span style="color:' + t.func + '; font-weight:bold;">handleSync</span> = <span style="color:' + t.func + ';">useCallback</span>(<span style="color:' + t.keyword + '; font-weight:bold;">async</span> () => {</span></div>',
          '<div class="line"><span class="ln">20</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">try</span> {</span></div>',
          '<div class="line"><span class="ln">21</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">const</span> <span style="color:' + t.fg + ';">res</span> = <span style="color:' + t.keyword + '; font-weight:bold;">await</span> <span style="color:' + t.func + '; font-weight:bold;">fetch</span>(<span style="color:' + t.string + ';">"/api/v1/telemetry/" + clusterId</span>);</span></div>',
          '<div class="line"><span class="ln">22</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">const</span> <span style="color:' + t.fg + ';">data</span> = <span style="color:' + t.keyword + '; font-weight:bold;">await</span> <span style="color:' + t.fg + ';">res</span>.<span style="color:' + t.func + ';">json</span>();</span></div>',
          '<div class="line"><span class="ln">23</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.func + ';">setRecords</span>(<span style="color:' + t.fg + ';">data</span>.<span style="color:' + t.fg + ';">items</span>);</span></div>',
          '<div class="line"><span class="ln">24</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>} <span style="color:' + t.keyword + '; font-weight:bold;">catch</span> (<span style="color:' + t.fg + ';">err</span>) {</span></div>',
          '<div class="line"><span class="ln">25</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.func + ';">setHealthState</span>(<span style="color:' + t.string + ';">"Degraded"</span>);</span></div>',
          '<div class="line"><span class="ln">26</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>}</span></div>',
          '<div class="line"><span class="ln">27</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span>}, [<span style="color:' + t.param + ';">clusterId</span>]);</span></div>',
          '<div class="line"><span class="ln">28</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">29</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">return</span> (</span></div>',
          '<div class="line"><span class="ln">30</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;<span style="color:' + t.type + '; font-weight:bold;">div</span> <span style="color:' + t.func + ';">className</span>=<span style="color:' + t.string + ';">"widget-panel-root"</span>&gt;</span></div>',
          '<div class="line"><span class="ln">31</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;<span style="color:' + t.type + '; font-weight:bold;">header</span> <span style="color:' + t.func + ';">className</span>=<span style="color:' + t.string + ';">"flex justify-between items-center"</span>&gt;</span></div>',
          '<div class="line"><span class="ln">32</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;<span style="color:' + t.type + '; font-weight:bold;">h3</span>&gt;Cluster: {<span style="color:' + t.param + ';">clusterId</span>}&lt;/<span style="color:' + t.type + '; font-weight:bold;">h3</span>&gt;</span></div>',
          '<div class="line"><span class="ln">33</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>&lt;<span style="color:' + t.type + '; font-weight:bold;">span</span> <span style="color:' + t.func + ';">className</span>=<span style="color:' + t.string + ';">"status-tag status-safe"</span>&gt;Safe (🟢)&lt;/<span style="color:' + t.type + '; font-weight:bold;">span</span>&gt;</span></div>',
          '<div class="line"><span class="ln">36</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span>);</span></div>',
          '<div class="line"><span class="ln">37</span><span class="code">};</span></div>'
        ].join('')
      },
      rust: {
        filename: 'execution_engine.rs',
        code: (t) => [
          '<div class="line"><span class="ln">1</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">use</span> <span style="color:' + t.fg + ';">std</span>::<span style="color:' + t.fg + ';">sync</span>::<span style="color:' + t.type + ';">Arc</span>;</span></div>',
          '<div class="line"><span class="ln">2</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">use</span> <span style="color:' + t.fg + ';">tokio</span>::<span style="color:' + t.fg + ';">sync</span>::{<span style="color:' + t.type + ';">RwLock</span>, <span style="color:' + t.type + ';">mpsc</span>};</span></div>',
          '<div class="line"><span class="ln">3</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">use</span> <span style="color:' + t.fg + ';">uuid</span>::<span style="color:' + t.type + ';">Uuid</span>;</span></div>',
          '<div class="line"><span class="ln">4</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">use</span> <span style="color:' + t.fg + ';">serde</span>::{<span style="color:' + t.type + ';">Serialize</span>, <span style="color:' + t.type + ';">Deserialize</span>};</span></div>',
          '<div class="line"><span class="ln">5</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">6</span><span class="code"><span style="color:' + t.type + '; font-weight:bold;">#[derive(Debug, Clone, Serialize, Deserialize)]</span></span></div>',
          '<div class="line"><span class="ln">7</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">pub struct</span> <span style="color:' + t.type + '; font-weight:bold;">ExecutionEngine</span>&lt;<span style="color:' + t.param + ';">&apos;a</span>&gt; {</span></div>',
          '<div class="line"><span class="ln">8</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">pub</span> <span style="color:' + t.fg + ';">engine_uuid</span>: <span style="color:' + t.type + ';">Uuid</span>,</span></div>',
          '<div class="line"><span class="ln">9</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">pub</span> <span style="color:' + t.fg + ';">cluster_name</span>: &<span style="color:' + t.param + ';">&apos;a</span> <span style="color:' + t.type + ';">str</span>,</span></div>',
          '<div class="line"><span class="ln">10</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">pub</span> <span style="color:' + t.fg + ';">concurrency_limit</span>: <span style="color:' + t.type + ';">usize</span>,</span></div>',
          '<div class="line"><span class="ln">11</span><span class="code">}</span></div>',
          '<div class="line"><span class="ln">12</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">13</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">impl</span>&lt;<span style="color:' + t.param + ';">&apos;a</span>&gt; <span style="color:' + t.type + '; font-weight:bold;">ExecutionEngine</span>&lt;<span style="color:' + t.param + ';">&apos;a</span>&gt; {</span></div>',
          '<div class="line"><span class="ln">14</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">pub fn</span> <span style="color:' + t.func + '; font-weight:bold;">init_cluster</span>(<span style="color:' + t.param + ';">name</span>: &<span style="color:' + t.param + ';">&apos;a</span> <span style="color:' + t.type + ';">str</span>, <span style="color:' + t.param + ';">workers</span>: <span style="color:' + t.type + ';">usize</span>) -> <span style="color:' + t.type + ';">Result</span>&lt;<span style="color:' + t.type + ';">Self</span>, <span style="color:' + t.type + ';">EngineError</span>&gt; {</span></div>',
          '<div class="line"><span class="ln">15</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">if</span> <span style="color:' + t.param + ';">workers</span> == <span style="color:' + t.constant + '; font-weight:bold;">0</span> {</span></div>',
          '<div class="line"><span class="ln">16</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">return</span> <span style="color:' + t.type + ';">Err</span>(<span style="color:' + t.type + ';">EngineError</span>::<span style="color:' + t.type + ';">InvalidWorkerCount</span>);</span></div>',
          '<div class="line"><span class="ln">17</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>}</span></div>',
          '<div class="line"><span class="ln">18</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.type + ';">Ok</span>(<span style="color:' + t.type + ';">Self</span> {</span></div>',
          '<div class="line"><span class="ln">19</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">engine_uuid</span>: <span style="color:' + t.func + ';">Uuid::new_v4</span>(),</span></div>',
          '<div class="line"><span class="ln">20</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">cluster_name</span>: <span style="color:' + t.param + ';">name</span>,</span></div>',
          '<div class="line"><span class="ln">21</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">concurrency_limit</span>: <span style="color:' + t.param + ';">workers</span>,</span></div>',
          '<div class="line"><span class="ln">22</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span>})</span></div>',
          '<div class="line"><span class="ln">23</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span>}</span></div>',
          '<div class="line"><span class="ln">24</span><span class="code">}</span></div>'
        ].join('')
      },
      go: {
        filename: 'cluster_manager.go',
        code: (t) => [
          '<div class="line"><span class="ln">1</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">package</span> <span style="color:' + t.fg + ';">cluster</span></span></div>',
          '<div class="line"><span class="ln">2</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">3</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">import</span> (</span></div>',
          '<div class="line"><span class="ln">4</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.string + ';">"context"</span></span></div>',
          '<div class="line"><span class="ln">5</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.string + ';">"fmt"</span></span></div>',
          '<div class="line"><span class="ln">6</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.string + ';">"sync"</span></span></div>',
          '<div class="line"><span class="ln">7</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.string + ';">"time"</span></span></div>',
          '<div class="line"><span class="ln">8</span><span class="code">)</span></div>',
          '<div class="line"><span class="ln">9</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">10</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">type</span> <span style="color:' + t.type + '; font-weight:bold;">ClusterManager</span> <span style="color:' + t.keyword + '; font-weight:bold;">struct</span> {</span></div>',
          '<div class="line"><span class="ln">11</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">mu</span>        <span style="color:' + t.type + ';">sync.RWMutex</span></span></div>',
          '<div class="line"><span class="ln">12</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">ClusterID</span> <span style="color:' + t.type + ';">string</span></span></div>',
          '<div class="line"><span class="ln">13</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.fg + ';">IsReady</span>   <span style="color:' + t.type + ';">bool</span></span></div>',
          '<div class="line"><span class="ln">14</span><span class="code">}</span></div>',
          '<div class="line"><span class="ln">15</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">16</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">func</span> (<span style="color:' + t.param + ';">m</span> *<span style="color:' + t.type + ';">ClusterManager</span>) <span style="color:' + t.func + '; font-weight:bold;">StartHealthCheck</span>(<span style="color:' + t.param + ';">ctx</span> <span style="color:' + t.type + ';">context.Context</span>) <span style="color:' + t.type + ';">error</span> {</span></div>',
          '<div class="line"><span class="ln">17</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.param + ';">m</span>.<span style="color:' + t.fg + ';">mu</span>.<span style="color:' + t.func + ';">Lock</span>()</span></div>',
          '<div class="line"><span class="ln">18</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">defer</span> <span style="color:' + t.param + ';">m</span>.<span style="color:' + t.fg + ';">mu</span>.<span style="color:' + t.func + ';">Unlock</span>()</span></div>',
          '<div class="line"><span class="ln">19</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.func + ';">fmt.Printf</span>(<span style="color:' + t.string + ';">"ZeroToSaaS Manager active: %s\\n"</span>, <span style="color:' + t.param + ';">m</span>.<span style="color:' + t.fg + ';">ClusterID</span>)</span></div>',
          '<div class="line"><span class="ln">20</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">return</span> <span style="color:' + t.constant + '; font-weight:bold;">nil</span></span></div>',
          '<div class="line"><span class="ln">21</span><span class="code">}</span></div>'
        ].join('')
      },
      sql: {
        filename: 'database_schema.sql',
        code: (t) => [
          '<div class="line"><span class="ln">1</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">Create Table If Not Exists</span> <span style="color:' + t.fg + '; font-weight:bold;">tenant_telemetry_records</span> (</span></div>',
          '<div class="line"><span class="ln">2</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.type + ';">id</span> <span style="color:' + t.keyword + '; font-weight:bold;">Uuid Primary Key Default</span> <span style="color:' + t.func + ';">gen_random_uuid</span>(),</span></div>',
          '<div class="line"><span class="ln">3</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.type + ';">tenant_email</span> <span style="color:' + t.keyword + '; font-weight:bold;">Varchar(255) Not Null</span>,</span></div>',
          '<div class="line"><span class="ln">4</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.type + ';">cluster_region</span> <span style="color:' + t.keyword + '; font-weight:bold;">Varchar(64) Default</span> <span style="color:' + t.string + ';">&apos;us-east-1&apos;</span>,</span></div>',
          '<div class="line"><span class="ln">5</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.type + ';">status_badge</span> <span style="color:' + t.keyword + '; font-weight:bold;">Varchar(32) Default</span> <span style="color:' + t.string + ';">&apos;Safe&apos;</span>,</span></div>',
          '<div class="line"><span class="ln">6</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.type + ';">created_at</span> <span style="color:' + t.keyword + '; font-weight:bold;">Timestamptz Default Now</span>()</span></div>',
          '<div class="line"><span class="ln">7</span><span class="code">);</span></div>',
          '<div class="line"><span class="ln">8</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">9</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">With</span> <span style="color:' + t.type + ';">regional_stats</span> <span style="color:' + t.keyword + '; font-weight:bold;">As</span> (</span></div>',
          '<div class="line"><span class="ln">10</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">Select</span> <span style="color:' + t.type + ';">cluster_region</span>, <span style="color:' + t.func + ';">Count</span>(<span style="color:' + t.type + ';">id</span>) <span style="color:' + t.keyword + '; font-weight:bold;">As</span> <span style="color:' + t.fg + ';">total_nodes</span></span></div>',
          '<div class="line"><span class="ln">11</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">From</span> <span style="color:' + t.fg + ';">tenant_telemetry_records</span></span></div>',
          '<div class="line"><span class="ln">12</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">Where</span> <span style="color:' + t.type + ';">status_badge</span> = <span style="color:' + t.string + ';">&apos;Safe&apos;</span></span></div>',
          '<div class="line"><span class="ln">13</span><span class="code"><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color:' + t.keyword + '; font-weight:bold;">Group By</span> <span style="color:' + t.type + ';">cluster_region</span></span></div>',
          '<div class="line"><span class="ln">14</span><span class="code">)</span></div>',
          '<div class="line"><span class="ln">15</span><span class="code"><span style="color:' + t.keyword + '; font-weight:bold;">Select</span> * <span style="color:' + t.keyword + '; font-weight:bold;">From</span> <span style="color:' + t.type + ';">regional_stats</span> <span style="color:' + t.keyword + '; font-weight:bold;">Order By</span> <span style="color:' + t.fg + ';">total_nodes</span> <span style="color:' + t.keyword + '; font-weight:bold;">Desc</span>;</span></div>'
        ].join('')
      },
      audit: {
        filename: 'audit_events.log',
        code: (t) => [
          '<div class="line"><span class="ln">1</span><span class="code"><span style="color:' + t.comment + ';">2026-08-22 18:40:00.104</span> <span class="status-tag status-safe">[Info]</span> <span style="color:' + t.type + ';">Cluster initialization successful</span> on node <span style="color:' + t.constant + ';">node-us-east-1a</span></span></div>',
          '<div class="line"><span class="ln">2</span><span class="code"><span style="color:' + t.comment + ';">2026-08-22 18:40:01.442</span> <span class="status-tag status-caution">[Warn]</span> <span style="color:' + t.string + ';">Re-trying network handshake with peer (latency: 48ms)</span></span></div>',
          '<div class="line"><span class="ln">3</span><span class="code"><span style="color:' + t.comment + ';">2026-08-22 18:40:02.910</span> <span class="status-tag status-warning">[Warn]</span> <span style="color:' + t.string + ';">Deprecated auth provider signature detected in header</span></span></div>',
          '<div class="line"><span class="ln">4</span><span class="code"><span style="color:' + t.comment + ';">2026-08-22 18:40:03.118</span> <span class="status-tag status-panic">[Error]</span> <span style="color:' + t.panicFg + '; font-weight:bold;">Secret Key exposure attempt blocked by ZeroToSaaS Human Firewall</span></span></div>',
          '<div class="line"><span class="ln">5</span><span class="code"><span style="color:' + t.comment + ';">2026-08-22 18:40:04.550</span> <span class="status-tag status-safe">[Info]</span> <span style="color:' + t.type + ';">Verified all 420 contrast assertions across 10 themes</span></span></div>'
        ].join('')
      },
      config: {
        filename: 'Cargo.toml',
        code: (t) => [
          '<div class="line"><span class="ln">1</span><span class="code"><span style="color:' + t.type + '; font-weight:bold;">[package]</span></span></div>',
          '<div class="line"><span class="ln">2</span><span class="code"><span style="color:' + t.fg + ';">name</span> = <span style="color:' + t.string + ';">"zerotosaas-engine"</span></span></div>',
          '<div class="line"><span class="ln">3</span><span class="code"><span style="color:' + t.fg + ';">version</span> = <span style="color:' + t.string + ';">"0.1.0"</span></span></div>',
          '<div class="line"><span class="ln">4</span><span class="code"><span style="color:' + t.fg + ';">edition</span> = <span style="color:' + t.string + ';">"2024"</span></span></div>',
          '<div class="line"><span class="ln">5</span><span class="code"><span style="color:' + t.fg + ';">license</span> = <span style="color:' + t.string + ';">"AGPL-3.0"</span></span></div>',
          '<div class="line"><span class="ln">6</span><span class="code"></span></div>',
          '<div class="line"><span class="ln">7</span><span class="code"><span style="color:' + t.type + '; font-weight:bold;">[dependencies]</span></span></div>',
          '<div class="line"><span class="ln">8</span><span class="code"><span style="color:' + t.fg + ';">tokio</span> = { <span style="color:' + t.fg + ';">version</span> = <span style="color:' + t.string + ';">"1.0"</span>, <span style="color:' + t.fg + ';">features</span> = [<span style="color:' + t.string + ';">"full"</span>] }</span></div>',
          '<div class="line"><span class="ln">9</span><span class="code"><span style="color:' + t.fg + ';">uuid</span> = { <span style="color:' + t.fg + ';">version</span> = <span style="color:' + t.string + ';">"1.6"</span>, <span style="color:' + t.fg + ';">features</span> = [<span style="color:' + t.string + ';">"v4"</span>, <span style="color:' + t.string + ';">"serde"</span>] }</span></div>'
        ].join('')
      }
    };

    // Color tokens matching theme JSON definitions
    const themesPalette = {
      default: { bg: '#FCFCFD', fg: '#111827', headerBg: '#F3F6FA', keyword: '#0B4F9C', func: '#4F2683', type: '#0B6229', constant: '#784A00', param: '#784A00', string: '#8C3800', comment: '#485260', panicFg: '#990014', panicBg: '#FFF2F2', contrast: '17.30:1', oklch: 'L=98.9% C=0.003 h=264°', paultol: 'ΔE ≥ 0.18' },
      green: { bg: '#F8FCF9', fg: '#0A2014', headerBg: '#E8F2EB', keyword: '#0A6233', func: '#0A5C4A', type: '#06522B', constant: '#145524', param: '#2E5918', string: '#1F5A14', comment: '#32583E', panicFg: '#960C1B', panicBg: '#FEF1F2', contrast: '16.91:1', oklch: 'L=98.5% C=0.009 h=146°', paultol: 'ΔE ≥ 0.16' },
      yellow: { bg: '#FCFAF4', fg: '#221B03', headerBg: '#F2EDDC', keyword: '#6E4E00', func: '#5C4100', type: '#2C5814', constant: '#684B00', param: '#6A4D00', string: '#734400', comment: '#5D522B', panicFg: '#8E1200', panicBg: '#FEF1EE', contrast: '16.41:1', oklch: 'L=98.5% C=0.008 h=91°', paultol: 'ΔE ≥ 0.15' },
      orange: { bg: '#FCF8F5', fg: '#22140D', headerBg: '#F7EDE6', keyword: '#913600', func: '#7A2B06', type: '#1A5A28', constant: '#8C3800', param: '#7D3004', string: '#8C3800', comment: '#624A3E', panicFg: '#960010', panicBg: '#FEF0EE', contrast: '16.14:1', oklch: 'L=98.7% C=0.007 h=46°', paultol: 'ΔE ≥ 0.14' },
      brown: { bg: '#FAF7F2', fg: '#20160B', headerBg: '#F0E9DF', keyword: '#5C2C06', func: '#4A2207', type: '#22581A', constant: '#6C3406', param: '#542805', string: '#6C3406', comment: '#594B3C', panicFg: '#900C18', panicBg: '#FEF1F1', contrast: '16.29:1', oklch: 'L=98.4% C=0.009 h=74°', paultol: 'ΔE ≥ 0.17' },
      purple: { bg: '#FAF8FC', fg: '#1B0E2A', headerBg: '#EFE7F6', keyword: '#6B21A8', func: '#581C87', type: '#005D6B', constant: '#6E4E00', param: '#5B1F8E', string: '#701A75', comment: '#544662', panicFg: '#990014', panicBg: '#FEF0F4', contrast: '17.15:1', oklch: 'L=98.7% C=0.007 h=312°', paultol: 'ΔE ≥ 0.15' },
      deuteranopia: { bg: '#FAFCFE', fg: '#0A1B38', headerBg: '#EFF4FA', keyword: '#0043A4', func: '#1E3A8A', type: '#0043A4', constant: '#733500', param: '#733500', string: '#7D3800', comment: '#3E4F6D', panicFg: '#990014', panicBg: '#FEF2F4', contrast: '17.18:1', oklch: 'L=98.8% C=0.006 h=228°', paultol: 'ΔE ≥ 0.182 (Pass)' },
      protanopia: { bg: '#FCFAFC', fg: '#1E0E22', headerBg: '#F4EEF5', keyword: '#0A4BA0', func: '#8C0064', type: '#015D53', constant: '#703700', param: '#703700', string: '#7D3800', comment: '#524056', panicFg: '#8C0064', panicBg: '#FEF0F6', contrast: '16.32:1', oklch: 'L=98.7% C=0.006 h=328°', paultol: 'ΔE ≥ 0.165 (Pass)' },
      tritanopia: { bg: '#FAFCFC', fg: '#0F1E21', headerBg: '#EDF5F6', keyword: '#A00028', func: '#800030', type: '#005D6B', constant: '#543D00', param: '#543D00', string: '#941800', comment: '#405B60', panicFg: '#A00028', panicBg: '#FEF1F3', contrast: '16.78:1', oklch: 'L=98.8% C=0.005 h=200°', paultol: 'ΔE ≥ 0.171 (Pass)' },
      'high-contrast': { bg: '#FFFFFF', fg: '#000000', headerBg: '#FAFAFA', keyword: '#002D80', func: '#400080', type: '#00591E', constant: '#5E3800', param: '#5E3800', string: '#5E3800', comment: '#444444', panicFg: '#990000', panicBg: '#FFF0F0', contrast: '18.25:1', oklch: 'L=100% C=0.000 h=0°', paultol: 'ISO 9241-303' },
      'default-night': { bg: '#0E1116', fg: '#E8ECF1', headerBg: '#181D26', keyword: '#63A3DE', func: '#B89BE8', type: '#6BCB7A', constant: '#E8B85A', param: '#E8B85A', string: '#E89A5A', comment: '#95A0B0', panicFg: '#FF768A', panicBg: '#2A0E12', contrast: '15.34:1', oklch: 'L=15.2% C=0.003 h=264°', paultol: 'ΔE ≥ 0.18' },
      'green-night': { bg: '#0B0E0C', fg: '#E0EBE4', headerBg: '#141715', keyword: '#6DB885', func: '#6EB5A0', type: '#74B689', constant: '#77B680', param: '#77B680', string: '#D3A46E', comment: '#87B093', panicFg: '#FF7772', panicBg: '#1C1314', contrast: '14.82:1', oklch: 'L=13.8% C=0.004 h=146°', paultol: 'ΔE ≥ 0.16' },
      'yellow-night': { bg: '#0E0D09', fg: '#EBE8DD', headerBg: '#171612', keyword: '#C19F61', func: '#BEA068', type: '#84B470', constant: '#C0A062', param: '#C0A062', string: '#D7A26A', comment: '#B0A57B', panicFg: '#FA7C65', panicBg: '#1C1412', contrast: '14.91:1', oklch: 'L=14.2% C=0.005 h=91°', paultol: 'ΔE ≥ 0.15' },
      'orange-night': { bg: '#0F0D0A', fg: '#F1E5DF', headerBg: '#181513', keyword: '#E9875D', func: '#E38A69', type: '#71B87F', constant: '#E28C60', param: '#E28C60', string: '#F39166', comment: '#C29B88', panicFg: '#FF7965', panicBg: '#1C1412', contrast: '14.67:1', oklch: 'L=14.5% C=0.005 h=46°', paultol: 'ΔE ≥ 0.14' },
      'brown-night': { bg: '#0E0D0B', fg: '#F0E6DE', headerBg: '#171613', keyword: '#CF9673', func: '#CA987C', type: '#BB9F83', constant: '#CD9770', param: '#CD9770', string: '#DF9D77', comment: '#B6A08B', panicFg: '#F97C68', panicBg: '#1C1412', contrast: '14.78:1', oklch: 'L=14.0% C=0.004 h=74°', paultol: 'ΔE ≥ 0.17' },
      'purple-night': { bg: '#0E0D10', fg: '#EAE5F0', headerBg: '#171519', keyword: '#BD87F4', func: '#A698E4', type: '#6EB78A', constant: '#C79C64', param: '#C79C64', string: '#EE946A', comment: '#AE9BC7', panicFg: '#FB7695', panicBg: '#1B1417', contrast: '15.12:1', oklch: 'L=14.3% C=0.005 h=312°', paultol: 'ΔE ≥ 0.15' },
      'deuteranopia-night': { bg: '#0E1419', fg: '#E8EEF4', headerBg: '#18222B', keyword: '#55A5F2', func: '#7E9FED', type: '#55A5F2', constant: '#E8A05A', param: '#E8A05A', string: '#EF9051', comment: '#91A2BA', panicFg: '#FB825B', panicBg: '#2A120E', contrast: '15.21:1', oklch: 'L=15.0% C=0.003 h=228°', paultol: 'ΔE ≥ 0.182 (Pass)' },
      'protanopia-night': { bg: '#100E12', fg: '#EEEAF0', headerBg: '#1D1822', keyword: '#63A3DE', func: '#ED75B5', type: '#4AD0BC', constant: '#E8B85A', param: '#E8B85A', string: '#E89A5A', comment: '#A597B1', panicFg: '#F27ABA', panicBg: '#2A0E1E', contrast: '14.93:1', oklch: 'L=14.8% C=0.004 h=328°', paultol: 'ΔE ≥ 0.165 (Pass)' },
      'tritanopia-night': { bg: '#0E1214', fg: '#E8F0F2', headerBg: '#181F24', keyword: '#FC7291', func: '#FF6C95', type: '#4AD0E0', constant: '#E8D05A', param: '#E8D05A', string: '#FB8170', comment: '#90A4AC', panicFg: '#FF7594', panicBg: '#2A0E16', contrast: '14.86:1', oklch: 'L=15.1% C=0.004 h=200°', paultol: 'ΔE ≥ 0.171 (Pass)' },
      'high-contrast-night': { bg: '#000000', fg: '#FFFFFF', headerBg: '#0F0F0F', keyword: '#5B9BD6', func: '#B89BE8', type: '#6BCB7A', constant: '#E8B85A', param: '#E8B85A', string: '#E89A5A', comment: '#B0B0B0', panicFg: '#FF778A', panicBg: '#2A0E12', contrast: '21.00:1', oklch: 'L=0% C=0.000 h=0°', paultol: 'ISO 9241-303' }
    };

    let activeThemeId = 'default';
    let activeLang = 'python';
    let activeMainTab = 'code';

    function selectTheme(themeId) {
      activeThemeId = themeId;
      document.querySelectorAll('.theme-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.theme === themeId);
      });
      document.querySelectorAll('.cvd-item').forEach(item => {
        item.classList.toggle('active', item.dataset.theme === themeId);
      });
      updateViews();
    }

    // Dropdown group toggle — click header to expand/collapse
    document.querySelectorAll('.dropdown-header').forEach(header => {
      header.addEventListener('click', () => {
        header.parentElement.classList.toggle('open');
      });
    });

    function selectLang(lang) {
      activeLang = lang;
      document.querySelectorAll('#lang-chips .lang-chip').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
      });
      updateViews();
    }

    function selectMainTab(tab) {
      activeMainTab = tab;
      document.getElementById('btn-tab-dash').classList.toggle('active', tab === 'dash');
      document.getElementById('btn-tab-code').classList.toggle('active', tab === 'code');
      document.getElementById('view-dashboard').style.display = tab === 'dash' ? 'flex' : 'none';
      document.getElementById('view-code').style.display = tab === 'code' ? 'block' : 'none';
    }

    function updateViews() {
      const palette = themesPalette[activeThemeId] || themesPalette.default;
      const themeObj = themeMetadata.find(t => t.id === activeThemeId) || themeMetadata[0];
      const sample = codeSamples[activeLang] || codeSamples.python;

      // 0. Update Root CSS Variables for Whole-Page Dynamic Theming
      const root = document.documentElement;
      root.style.setProperty('--theme-bg', palette.bg);
      root.style.setProperty('--theme-fg', palette.fg);
      root.style.setProperty('--theme-header-bg', palette.headerBg);
      root.style.setProperty('--theme-primary', palette.keyword);
      root.style.setProperty('--theme-func', palette.func);
      root.style.setProperty('--theme-type', palette.type);
      root.style.setProperty('--theme-constant', palette.constant);
      root.style.setProperty('--theme-comment', palette.comment);
      root.style.setProperty('--theme-card-border', palette.headerBg);
      root.style.setProperty('--theme-subtle-bg', palette.bg === '#FFFFFF' ? '#F4F7FB' : palette.headerBg);

      // 1. Update Telemetry Card
      document.getElementById('tel-canvas').textContent = palette.bg;
      document.getElementById('tel-oklch').textContent = palette.oklch;
      document.getElementById('tel-contrast').textContent = palette.contrast;
      document.getElementById('tel-paultol').textContent = palette.paultol;

      // 2. Update Code View
      const card = document.getElementById('editor-card');
      card.style.backgroundColor = palette.bg;
      card.style.color = palette.fg;

      const topbar = document.getElementById('editor-topbar');
      topbar.style.backgroundColor = palette.headerBg;
      topbar.style.color = palette.keyword;

      document.getElementById('editor-filename').textContent = sample.filename + ' — ' + themeObj.name;
      document.getElementById('editor-body').innerHTML = sample.code(palette);

      // 3. Update Dashboard View
      const dash = document.getElementById('view-dashboard');
      dash.style.backgroundColor = palette.bg;
      dash.style.color = palette.fg;

      const dashBtn = document.getElementById('dash-action-btn');
      if (dashBtn) {
        dashBtn.style.backgroundColor = palette.keyword;
        dashBtn.style.color = '#FFFFFF';
      }

      const signupBtn = document.getElementById('btn-submit-signup');
      if (signupBtn) {
        signupBtn.style.backgroundColor = palette.keyword;
        signupBtn.style.color = '#FFFFFF';
      }

      const chartLine = document.getElementById('chart-line');
      if (chartLine) chartLine.setAttribute('stroke', palette.keyword);
      const stop1 = document.getElementById('grad-stop-1');
      if (stop1) stop1.setAttribute('stop-color', palette.keyword);
      const stop2 = document.getElementById('grad-stop-2');
      if (stop2) stop2.setAttribute('stop-color', palette.keyword);
    }

    function handleSignupSubmit() {
      const status = document.getElementById('signup-status');
      if (status) {
        status.style.display = 'inline-block';
        setTimeout(() => {
          status.style.display = 'none';
        }, 4000);
      }
    }

    // Event Listeners for Theme Selection
    document.querySelectorAll('.theme-chip').forEach(chip => {
      chip.onclick = () => selectTheme(chip.dataset.theme);
    });
    document.querySelectorAll('.cvd-item').forEach(item => {
      item.onclick = () => selectTheme(item.dataset.theme);
    });

    // Language Tabs
    document.querySelectorAll('#lang-chips .lang-chip').forEach(btn => {
      btn.onclick = () => selectLang(btn.dataset.lang);
    });

    // Main View Tabs
    document.getElementById('btn-tab-dash').onclick = () => selectMainTab('dash');
    document.getElementById('btn-tab-code').onclick = () => selectMainTab('code');

    // Toggles
    document.getElementById('toggle-error-lens').onchange = (e) => {
      document.getElementById('editor-card').classList.toggle('no-error-lens', !e.target.checked);
    };
    document.getElementById('toggle-indent').onchange = (e) => {
      document.getElementById('editor-card').classList.toggle('no-indent', !e.target.checked);
    };
    document.getElementById('toggle-firewall').onchange = (e) => {
      document.getElementById('editor-card').classList.toggle('no-firewall', !e.target.checked);
    };

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10) - 1;
        if (num < themeMetadata.length) selectTheme(themeMetadata[num].id);
      } else if (e.key === '0' && themeMetadata.length >= 10) {
        selectTheme(themeMetadata[9].id);
      } else if (e.key === 'ArrowRight') {
        const idx = themeMetadata.findIndex(t => t.id === activeThemeId);
        const next = (idx + 1) % themeMetadata.length;
        selectTheme(themeMetadata[next].id);
      } else if (e.key === 'ArrowLeft') {
        const idx = themeMetadata.findIndex(t => t.id === activeThemeId);
        const prev = (idx - 1 + themeMetadata.length) % themeMetadata.length;
        selectTheme(themeMetadata[prev].id);
      }
    });

    // Initial load
    updateViews();
  </script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, htmlContent, 'utf8');
console.log('✅ Generated 2-Column Single-Line Interactive Theme Showcase at docs/previews/gallery.html');
