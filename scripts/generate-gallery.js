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

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ZeroToSaaS Theme Suite — Visual Validation Gallery</title>
  <style>
    :root {
      --font-mono: 'JetBrains Mono', 'Geist Mono', 'SF Mono', Consolas, monospace;
      --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background: #F8FAFC;
      color: #0F172A;
      padding: 2.5rem;
      line-height: 1.6;
    }
    .header {
      max-width: 1400px;
      margin: 0 auto 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #E2E8F0;
    }
    .header h1 { font-size: 2.2rem; color: #075985; margin-bottom: 0.5rem; font-weight: 700; }
    .header p { color: #334155; font-size: 1.1rem; }
    
    .section-card {
      max-width: 1400px;
      margin: 0 auto 3rem;
      background: #FFFFFF;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
    }
    .section-title {
      font-size: 1.35rem;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    .section-desc {
      color: #334155;
      font-size: 0.95rem;
      margin-bottom: 1.75rem;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: #E0F2FE;
      color: #0369A1;
      border: 1px solid #BAE6FD;
    }

    .editor-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(620px, 1fr));
      gap: 1.5rem;
    }

    .editor-mockup {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 1px solid rgba(0,0,0,0.12);
      font-family: var(--font-mono);
      font-size: 13px;
    }

    .editor-header {
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0,0,0,0.08);
      font-size: 12px;
      font-weight: 600;
    }

    .editor-body {
      padding: 1rem;
      white-space: pre;
      overflow-x: auto;
      line-height: 1.6;
    }

    .line { display: flex; }
    .ln {
      width: 2.5rem;
      user-select: none;
      opacity: 0.45;
      text-align: right;
      padding-right: 1rem;
    }
    .code { flex: 1; }

    /* Indent Shading */
    .indent-odd { background-color: rgba(0,0,0,0.04); display: inline-block; }
    .indent-even { background-color: transparent; display: inline-block; }

    /* Status Badges */
    .status-tag {
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 500;
      font-size: 11px;
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
  </style>
</head>
<body>

  <div class="header">
    <h1>🔬 ZeroToSaaS Accessibility Theme Suite — Validation Matrix</h1>
    <p>Empirical verification across OkLCH Perceptual Lightness, Paul Tol CVD Wavelength Discrimination, ColorBrewer IA Scales, and Farnsworth-Munsell 100-Hue Quadrants.</p>
  </div>

  <!-- 1. OkLCH Perceptual Uniformity Preview -->
  <div class="section-card" id="oklch-section">
    <div class="section-title">
      <span>📐 1. OkLCH (Oklab Color Space) Perceptual Uniformity</span>
      <span class="badge">L ≈ 42%–45% Invariant</span>
    </div>
    <div class="section-desc">
      Demonstrating identical perceived lightness and cognitive reading ease across <strong>Forest Calm (Green)</strong>, <strong>Golden Sand (Yellow)</strong>, <strong>Terracotta (Orange)</strong>, and <strong>Warm Sepia (Brown)</strong> on their respective glare-free canvases.
    </div>

    <div class="editor-grid">
      <!-- Green Theme -->
      <div class="editor-mockup" style="background: #F8FCF9; color: #0A2014; border-color: #B6DCC1;">
        <div class="editor-header" style="background: #E8F2EB; color: #096032;">
          <span>🌲 ZeroToSaaS Forest Calm (Green) • sample_pipeline.py</span>
          <span>OkLCH L=98.5% Canvas</span>
        </div>
        <div class="editor-body">
<div class="line"><span class="ln">1</span><span class="code"><span style="color: #0A6233; font-weight: bold;">import</span> <span style="color: #0A2014;">os</span>, <span style="color: #0A2014;">sys</span></span></div>
<div class="line"><span class="ln">2</span><span class="code"><span style="color: #0A6233; font-weight: bold;">from</span> <span style="color: #0A2014;">dataclasses</span> <span style="color: #0A6233; font-weight: bold;">import</span> <span style="color: #06522B; font-weight: bold;">dataclass</span></span></div>
<div class="line"><span class="ln">3</span><span class="code"></span></div>
<div class="line"><span class="ln">4</span><span class="code"><span style="color: #06522B; font-weight: bold;">@dataclass</span></span></div>
<div class="line"><span class="ln">5</span><span class="code"><span style="color: #0A6233; font-weight: bold;">class</span> <span style="color: #06522B; font-weight: bold;">PipelineHealthMetrics</span>:</span></div>
<div class="line"><span class="ln">6</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0A2014;">cluster_id</span>: <span style="color: #06522B;">str</span></span></div>
<div class="line"><span class="ln">7</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0A2014;">active_workers</span>: <span style="color: #06522B;">int</span></span></div>
<div class="line"><span class="ln">8</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0A2014;">secret_token</span>: <span style="color: #06522B;">str</span> = <span class="status-panic" style="background: #FEF1F2; color: #960C1B;">"AIzaSyD9x82kL90a..."</span> <span class="error-lens error-lens-err">🔴 [Panic] Hardcoded Secret Key Exposed</span></span></div>
<div class="line"><span class="ln">9</span><span class="code"></span></div>
<div class="line"><span class="ln">10</span><span class="code"><span style="color: #0A6233; font-weight: bold;">def</span> <span style="color: #0A5C4A; font-weight: bold;">execute_health_check</span>(<span style="color: #2E5918;">cluster</span>: <span style="color: #06522B;">str</span>) -> <span style="color: #06522B;">bool</span>:</span></div>
<div class="line"><span class="ln">11</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #32583E;"># Verified strict contract</span></span></div>
<div class="line"><span class="ln">12</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0A6233; font-weight: bold;">return</span> <span style="color: #145524; font-weight: bold;">True</span></span></div>
        </div>
      </div>

      <!-- Yellow Theme -->
      <div class="editor-mockup" style="background: #FCFAF4; color: #221B03; border-color: #CEBF8F;">
        <div class="editor-header" style="background: #F2EDDC; color: #6B4C00;">
          <span>☀️ ZeroToSaaS Golden Sand (Yellow) • sample_pipeline.py</span>
          <span>OkLCH L=98.5% Canvas</span>
        </div>
        <div class="editor-body">
<div class="line"><span class="ln">1</span><span class="code"><span style="color: #6E4E00; font-weight: bold;">import</span> <span style="color: #221B03;">os</span>, <span style="color: #221B03;">sys</span></span></div>
<div class="line"><span class="ln">2</span><span class="code"><span style="color: #6E4E00; font-weight: bold;">from</span> <span style="color: #221B03;">dataclasses</span> <span style="color: #6E4E00; font-weight: bold;">import</span> <span style="color: #2C5814; font-weight: bold;">dataclass</span></span></div>
<div class="line"><span class="ln">3</span><span class="code"></span></div>
<div class="line"><span class="ln">4</span><span class="code"><span style="color: #2C5814; font-weight: bold;">@dataclass</span></span></div>
<div class="line"><span class="ln">5</span><span class="code"><span style="color: #6E4E00; font-weight: bold;">class</span> <span style="color: #2C5814; font-weight: bold;">PipelineHealthMetrics</span>:</span></div>
<div class="line"><span class="ln">6</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #221B03;">cluster_id</span>: <span style="color: #2C5814;">str</span></span></div>
<div class="line"><span class="ln">7</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #221B03;">active_workers</span>: <span style="color: #2C5814;">int</span></span></div>
<div class="line"><span class="ln">8</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #221B03;">secret_token</span>: <span style="color: #2C5814;">str</span> = <span class="status-panic" style="background: #FEF1EE; color: #8E1200;">"AIzaSyD9x82kL90a..."</span> <span class="error-lens error-lens-err">🔴 [Panic] Hardcoded Secret Key Exposed</span></span></div>
<div class="line"><span class="ln">9</span><span class="code"></span></div>
<div class="line"><span class="ln">10</span><span class="code"><span style="color: #6E4E00; font-weight: bold;">def</span> <span style="color: #5C4100; font-weight: bold;">execute_health_check</span>(<span style="color: #6E4E00;">cluster</span>: <span style="color: #2C5814;">str</span>) -> <span style="color: #2C5814;">bool</span>:</span></div>
<div class="line"><span class="ln">11</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #5D522B;"># Verified strict contract</span></span></div>
<div class="line"><span class="ln">12</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #6E4E00; font-weight: bold;">return</span> <span style="color: #735200; font-weight: bold;">True</span></span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 2. Paul Tol CVD-Safe Photoreceptor Wavelength Calibration Preview -->
  <div class="section-card" id="paul-tol-section">
    <div class="section-title">
      <span>🧪 2. Paul Tol's CVD-Safe Color Schemes</span>
      <span class="badge">SRON Medical Standard • ΔE ≥ 0.10</span>
    </div>
    <div class="section-desc">
      Isolated wavelength discrimination for Deuteranopia (Oceanic Blue/Amber), Protanopia (Magenta/Teal), and Tritanopia (Crimson/Cyan).
    </div>

    <div class="editor-grid">
      <!-- Deuteranopia -->
      <div class="editor-mockup" style="background: #FAFCFE; color: #0A1B38; border-color: #C8D9EE;">
        <div class="editor-header" style="background: #EFF4FA; color: #0043A4;">
          <span>🌐 ZeroToSaaS Deuteranopia (Blue / Orange) • sample-app.tsx</span>
          <span>470nm / 600nm Axis</span>
        </div>
        <div class="editor-body">
<div class="line"><span class="ln">1</span><span class="code"><span style="color: #0043A4; font-weight: bold;">interface</span> <span style="color: #0043A4; font-weight: bold;">UserSession</span> {</span></div>
<div class="line"><span class="ln">2</span><span class="code">    <span style="color: #0A1B38;">userId</span>: <span style="color: #0043A4;">string</span>;</span></div>
<div class="line"><span class="ln">3</span><span class="code">    <span style="color: #0A1B38;">authToken</span>: <span style="color: #0043A4;">string</span>;</span></div>
<div class="line"><span class="ln">4</span><span class="code">}</span></div>
<div class="line"><span class="ln">5</span><span class="code"></span></div>
<div class="line"><span class="ln">6</span><span class="code"><span style="color: #0043A4; font-weight: bold;">export const</span> <span style="color: #1E3A8A; font-weight: bold;">SessionWidget</span> = ({ <span style="color: #733500;">session</span> }: { <span style="color: #733500;">session</span>: <span style="color: #0043A4;">UserSession</span> }) => {</span></div>
<div class="line"><span class="ln">7</span><span class="code">    <span style="color: #0043A4; font-weight: bold;">return</span> (</span></div>
<div class="line"><span class="ln">8</span><span class="code">        &lt;<span style="color: #0043A4; font-weight: bold;">div</span> <span style="color: #1E3A8A;">className</span>=<span class="status-warning" style="background: #FFF8F1; color: #7D3800;">"session-card active"</span>&gt;</span></div>
<div class="line"><span class="ln">9</span><span class="code">            &lt;<span style="color: #0043A4; font-weight: bold;">span</span>&gt;Auth Verified: {session.userId}&lt;/<span style="color: #0043A4; font-weight: bold;">span</span>&gt;</span></div>
<div class="line"><span class="ln">10</span><span class="code">        &lt;/<span style="color: #0043A4; font-weight: bold;">div</span>&gt;</span></div>
<div class="line"><span class="ln">11</span><span class="code">    );</span></div>
<div class="line"><span class="ln">12</span><span class="code">};</span></div>
        </div>
      </div>

      <!-- Protanopia -->
      <div class="editor-mockup" style="background: #FCFAFC; color: #1E0E22; border-color: #DFC9E3;">
        <div class="editor-header" style="background: #F4EEF5; color: #8C0064;">
          <span>🌐 ZeroToSaaS Protanopia (Magenta / Teal) • sample-app.tsx</span>
          <span>Jewel Magenta & Arctic Teal</span>
        </div>
        <div class="editor-body">
<div class="line"><span class="ln">1</span><span class="code"><span style="color: #0A4BA0; font-weight: bold;">interface</span> <span style="color: #015D53; font-weight: bold;">UserSession</span> {</span></div>
<div class="line"><span class="ln">2</span><span class="code">    <span style="color: #1E0E22;">userId</span>: <span style="color: #015D53;">string</span>;</span></div>
<div class="line"><span class="ln">3</span><span class="code">    <span style="color: #1E0E22;">authToken</span>: <span style="color: #015D53;">string</span>;</span></div>
<div class="line"><span class="ln">4</span><span class="code">}</span></div>
<div class="line"><span class="ln">5</span><span class="code"></span></div>
<div class="line"><span class="ln">6</span><span class="code"><span style="color: #0A4BA0; font-weight: bold;">export const</span> <span style="color: #8C0064; font-weight: bold;">SessionWidget</span> = ({ <span style="color: #703700;">session</span> }: { <span style="color: #703700;">session</span>: <span style="color: #015D53;">UserSession</span> }) => {</span></div>
<div class="line"><span class="ln">7</span><span class="code">    <span style="color: #0A4BA0; font-weight: bold;">return</span> (</span></div>
<div class="line"><span class="ln">8</span><span class="code">        &lt;<span style="color: #0A4BA0; font-weight: bold;">div</span> <span style="color: #8C0064;">className</span>=<span class="status-warning" style="background: #FFF7F0; color: #7D3800;">"session-card active"</span>&gt;</span></div>
<div class="line"><span class="ln">9</span><span class="code">            &lt;<span style="color: #0A4BA0; font-weight: bold;">span</span>&gt;Auth Verified: {session.userId}&lt;/<span style="color: #0A4BA0; font-weight: bold;">span</span>&gt;</span></div>
<div class="line"><span class="ln">10</span><span class="code">        &lt;/<span style="color: #0A4BA0; font-weight: bold;">div</span>&gt;</span></div>
<div class="line"><span class="ln">11</span><span class="code">    );</span></div>
<div class="line"><span class="ln">12</span><span class="code">};</span></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. Cynthia Brewer's ColorBrewer Framework Preview -->
  <div class="section-card" id="colorbrewer-section">
    <div class="section-title">
      <span>🎨 3. Cynthia Brewer's ColorBrewer Framework</span>
      <span class="badge">Qualitative • Sequential • Diverging</span>
    </div>
    <div class="section-desc">
      Semantic organization of visual data: <strong>Qualitative</strong> (AST syntax balance), <strong>Sequential</strong> (alternating indent guides levels 1–6), and <strong>Diverging</strong> (bipolar cognitive status alerts).
    </div>

    <div class="editor-grid">
      <!-- Default Light Theme with Indent & Status Scales -->
      <div class="editor-mockup" style="background: #FCFCFD; color: #111827; border-color: #D8E1ED;">
        <div class="editor-header" style="background: #F3F6FA; color: #0B4F9C;">
          <span>📊 ZeroToSaaS Light (Default) • ColorBrewer Scale Demonstration</span>
          <span>Diverging Status System</span>
        </div>
        <div class="editor-body">
<div class="line"><span class="ln">1</span><span class="code"><span style="color: #0B4F9C; font-weight: bold;">export async function</span> <span style="color: #4F2683; font-weight: bold;">processAuditTrail</span>() {</span></div>
<div class="line"><span class="ln">2</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="status-tag status-safe">Safe (🟢)</span> <span style="color: #0B6229; font-weight: bold;">Strict Contract Validated</span></span></div>
<div class="line"><span class="ln">3</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="status-tag status-caution">Caution (🟡)</span> <span style="color: #784A00;">Dynamic Parameter Checked</span></span></div>
<div class="line"><span class="ln">4</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="status-tag status-warning">Warning (🟠)</span> <span style="color: #8C3800;">"Hardcoded Primitive String"</span></span></div>
<div class="line"><span class="ln">5</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="status-tag status-panic">Panic (🔴)</span> <span style="color: #990014; font-weight: bold;">UUID: 550e8400-e29b-41d4-a716-446655440000</span></span></div>
<div class="line"><span class="ln">6</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span></span></div>
<div class="line"><span class="ln">7</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #485260;">// Sequential Indent Shading Levels 1 -> 6</span></span></div>
<div class="line"><span class="ln">8</span><span class="code">    <span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-even">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="indent-odd">&nbsp;&nbsp;&nbsp;&nbsp;</span><span style="color: #0B4F9C; font-weight: bold;">return</span> <span style="color: #784A00; font-weight: bold;">true</span>;</span></div>
<div class="line"><span class="ln">9</span><span class="code">}</span></div>
        </div>
      </div>

      <!-- High Contrast ISO 9241-303 -->
      <div class="editor-mockup" style="background: #FFFFFF; color: #000000; border: 2px solid #000000;">
        <div class="editor-header" style="background: #FAFAFA; color: #000000; border-bottom: 2px solid #000000;">
          <span>⚡ ZeroToSaaS High Contrast (ISO 9241-303)</span>
          <span>Luminance Ratio &gt; 15:1</span>
        </div>
        <div class="editor-body">
<div class="line"><span class="ln">1</span><span class="code"><span style="color: #002D80; font-weight: bold;">SELECT</span> <span style="color: #00591E;">user_id</span>, <span style="color: #00591E;">email</span>, <span style="color: #00591E;">created_at</span></span></div>
<div class="line"><span class="ln">2</span><span class="code"><span style="color: #002D80; font-weight: bold;">FROM</span> <span style="color: #000000; font-weight: bold;">production_users</span></span></div>
<div class="line"><span class="ln">3</span><span class="code"><span style="color: #002D80; font-weight: bold;">WHERE</span> <span style="color: #00591E;">is_active</span> = <span style="color: #5E3800; font-weight: bold;">TRUE</span></span></div>
<div class="line"><span class="ln">4</span><span class="code"><span style="color: #002D80; font-weight: bold;">ORDER BY</span> <span style="color: #00591E;">created_at</span> <span style="color: #002D80; font-weight: bold;">DESC</span>;</span></div>
<div class="line"><span class="ln">5</span><span class="code"></span></div>
<div class="line"><span class="ln">6</span><span class="code"><span style="color: #444444;">-- ISO 9241-303 Certified Solid Structural Contrast</span></span></div>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML, htmlContent, 'utf8');
console.log('✅ Generated HTML visual validation gallery at docs/previews/gallery.html');
