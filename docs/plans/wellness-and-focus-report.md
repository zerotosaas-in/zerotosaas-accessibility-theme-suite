---
layout: default
title: Human-Centered Wellness & Focus Report
target-destination: docs/Wellness.md
---

# ZeroToSaaS — Human-Centered Wellness & Focus Report

## Plan Execution Notes (for the implementing agent — NOT part of the published report)

- **Dual-purpose file.** Everything except this preamble and §11 constitutes the wellness report deliverable ([REPORT] body). §11 is the executable task list.
- **Entry point:** execute §11 phases in order; Phase 0 items are independent, safe fixes and may land separately.
- **Publication contract (task P4.3):** create `docs/Wellness.md` from the [REPORT] body (restore YAML front matter `layout: default`, `title: Human-Centered Wellness & Focus Report`; drop this preamble and §11). Link it from `docs/index.md`, README ("Wellness & Focus" section), gallery card, and CHANGELOG. Do not modify this plan file during implementation.
- **Test wiring (P1.5):** add `"test": "node --test scripts/wellness.test.js"` to `package.json` scripts (repo has no test framework today; `node --test` matches its zero-dependency style).
- **Keybindings:** proposed `Ctrl+Alt+*` chords auto-map to `Cmd+Alt+*` on macOS; verify no collisions with common extensions before finalizing.

A deep analysis of the ZeroToSaaS Accessibility Theme Suite through the lens of **human-friendliness**, **long-duration screen health**, and **sustained attention**, together with an implementation-ready enhancement plan for eye-health tooling (20-20-20 and beyond) and Pomodoro-style focus sessions fused with ocular rest.

Companion documents: `docs/Guidelines.md` · `docs/TODO.md` · `docs/Validation.md`

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Current State Analysis](#2-current-state-analysis)
3. [Human-Friendliness Audit (Gaps & Friction Points)](#3-human-friendliness-audit-gaps--friction-points)
4. [Design Principles for the Wellness Layer](#4-design-principles-for-the-wellness-layer)
5. [Proposed Feature Set](#5-proposed-feature-set)
6. [Technical Architecture](#6-technical-architecture)
7. [Configuration Reference (Proposed)](#7-configuration-reference-proposed)
8. [Command Reference (Proposed)](#8-command-reference-proposed)
9. [Worked Example: A Fused 2-Hour Session](#9-worked-example-a-fused-2-hour-session)
10. [Edge Cases & Failure Modes](#10-edge-cases--failure-modes)
11. [Implementation Task List (Phased)](#11-implementation-task-list-phased)
12. [Validation & QA Plan](#12-validation--qa-plan)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Success Metrics](#14-success-metrics)
15. [Medical Grounding & References](#15-medical-grounding--references)
16. [Beyond the IDE: Cross-Surface Wellness (VSCodium, Web, Mobile, TV, SaaS & Documents)](#16-beyond-the-ide-cross-surface-wellness-vscodium-web-mobile-tv-saas--documents)
17. [IDE Human-Friendliness Configuration Catalogue](#17-ide-human-friendliness-configuration-catalogue)
18. [Out of Scope / Future Ideas](#18-out-of-scope--future-ideas)

---

## 1. Executive Summary

ZeroToSaaS already leads the theme ecosystem on *passive* visual ergonomics: WCAG AAA contrast, OkLCH uniformity, CVD-safe palettes, and positive-polarity canvases. What it lacks is an **active behavioral layer**: nothing in the product today reliably changes *what users do* over an 8–12 hour session.

This report proposes a coherent **Wellness Layer** with three tiers:

| Tier | Name | Default | Purpose |
| :--- | :--- | :--- | :--- |
| Tier 1 | **Continuous Work Guardian** | ✅ **ON** | Safety net: any user typing/scrolling/working continuously for a long duration gets reminded — even with every other feature switched off. |
| Tier 2 | **Eye Health Suite** (20-20-20 v2 + Blink Coach) | Opt-in | Clinical ocular rest cycles, blink lubrication cues, idle-aware pausing, snooze/skip. |
| Tier 3 | **FocusFlow** (Pomodoro fused with 20-20-20) | Opt-in | Attention management where pomodoro breaks and eye micro-breaks reinforce each other instead of fighting. |

Plus supporting infrastructure: a unified status-bar hub, a stats dashboard, onboarding, de-nagged advisories, and accessible notification design.

**Key finding:** the existing 20-20-20 assistant (`src/extension.js:1079-1161`) is a wall-clock timer that neither knows whether the user is present, nor pauses when the window is unfocused, nor offers skip/snooze, nor escalates when ignored. One confirmed defect (`hintLensDecorationType` used but never created) breaks the tail of every decoration pass. All findings are detailed below with file/line references.

Beyond the extension itself, §16 specifies how the same palettes, wellness timings, and state machines transfer to the VSCodium/OpenVSX ecosystem, web/mobile/TV surfaces, and SaaS applications — including human-friendly PDF/XLSX/DOCX output — via token exports; §17 catalogues the complete VS Code configuration surface (theme colors + `configurationDefaults`) required to maximize in-editor human-friendliness.

---

## 2. Current State Analysis

### 2.1 What exists today (verified in code)

| Capability | Location | State |
| :--- | :--- | :--- |
| 20 themes (10 light + 10 night), WCAG AAA | `package.json:57-159`, `themes/*.json` | ✅ Solid, validated (420/420 assertions) |
| Semantic status badges (Safe/Caution/Warning/Panic) | `src/extension.js:701-931` | ✅ Works |
| Error Lens + inline Git blame | `src/extension.js:966-1077` | ⚠️ Works but crashes on hint path (see §2.3) |
| Alternating indent shading | `src/extension.js:659-696` | ✅ Works |
| 20-20-20 Ocular Rest Assistant | `src/extension.js:1079-1161` | ⚠️ Minimal: naive wall-clock timer, **off by default** |
| Day/Night auto-switcher | `src/extension.js:1261-1302` | ✅ Works |
| Dark-theme eye-health warnings | `src/extension.js:1362-1394`, `1207-1233` | ⚠️ Functional but repeats on every activation (nag risk) |

### 2.2 Existing rest assistant — behavioral gaps

Current implementation facts (from `initRestAssistant()`, `beginRestBreak()`, `updateRestStatusText()`):

1. **Pure wall-clock countdown.** `restNextBreakAt = Date.now() + intervalMs`; a 1 s `setInterval` compares timestamps. It has **no concept of user activity** — the reminder fires even if the user has been on a coffee break for 19 of the last 20 minutes, and never credits that rest.
2. **No idle detection.** Timers run while the OS is unlocked-but-away, in meetings, or with VS Code minimized.
3. **No pause on window blur.** `vscode.window.onDidChangeWindowState` is unused.
4. **Single-shot transient toast** (`showInformationMessage`) — auto-dismisses, easily missed on multi-monitor setups or during flow.
5. **No skip / snooze / postpone.** Clicking the status item only resets the whole timer (`zerotosaas.resetRestTimer`).
6. **No compliance feedback loop.** Nothing records whether breaks were taken — no streaks, stats, or positive reinforcement.
7. **Off by default with zero discovery.** `restReminder.enabled` defaults to `false`; no walkthrough, first-run nudge, or status-bar presence when disabled. Most users will never learn it exists.
8. **Blink reminders** are mentioned in README/settings copy ("and blink reminder") but **not implemented** as a distinct cue.

### 2.3 Confirmed defect

- **`hintLensDecorationType` is used but never created.** Declared at `src/extension.js:33`, pushed (still `undefined`) into subscriptions at `:460`, disposed-guarded at `:474`, cleared at `:961-962`, and passed to `editor.setDecorations(hintLensDecorationType, hintOptions)` at `:1076`. Since `initDecorations()` never assigns it, every `updateErrorLens()` pass throws on the final `setDecorations` call (after error/warning/info decorations are applied). Symptoms: unhandled exceptions in the extension host console on each debounced update; hint-level lens never renders. **Fix:** create it alongside the other lens types (mirror info styling with muted fg/bg) in `initDecorations()`.

### 2.4 Secondary observations

- `resetRestTimer` silently no-ops when the assistant is disabled (`extension.js:1330-1336`) — acceptable, but an explanatory message would be friendlier.
- No keybindings are contributed for any command; health tools especially benefit from muscle-memory shortcuts.
- `package.json` `categories` includes `"Linters"` — marketplace hygiene: attracts the wrong audience, dilutes the accessibility story.
- The extension is a single 1,477-line file; adding three timers, a webview dashboard, and a state machine would become unmaintainable. Architecture split is proposed in §6.

---

## 3. Human-Friendliness Audit (Gaps & Friction Points)

| # | Friction | Evidence | Severity |
| :--- | :--- | :--- | :--- |
| H1 | Dark-theme warning re-fires on **every** externally-initiated dark activation (native `Ctrl+K Ctrl+T`). Users who toggle themes see it repeatedly. | `extension.js:1373-1392` | High (annoyance) |
| H2 | Night-theme QuickPick shows a long medical paragraph **every** selection; no "don't ask again" memory. | `extension.js:1207-1233` | High |
| H3 | No onboarding/walkthrough; wellness features are undiscoverable. | No `contributes.walkthroughs` | High |
| H4 | No central place to see/control all wellness features; users must hunt the settings UI. | Scattered commands only | Medium |
| H5 | Reminder copy is clinical and static; no warmth, variety, or progress framing ("3 breaks done today"). | `beginRestBreak()` | Low |
| H6 | No respect for presentation/zen/screen-share moments — a pop-up mid-demo is hostile. | Absent | Medium |
| H7 | Notifications are text+emoji only; screen-reader phrasing is an afterthought. | Inline messages | Medium |
| H8 | No quiet hours; a 02:00 debugging session gets identical treatment to 14:00. | Absent | Low |

---

## 4. Design Principles for the Wellness Layer

1. **Protect by default, coach gently.** Only the Guardian safety net defaults ON (it is low-frequency by design). Everything else is opt-in with one-click onboarding.
2. **Never fight flow unintentionally.** Escalate gradually: status tint → toast → (rarely) modal. Hard interruptions require explicit configuration ("strict mode") or sustained ignoring.
3. **Respect presence.** All timers are activity-aware: idle ⇒ pause; window unfocused ⇒ pause; resume ⇒ continue from where physiology left off, not where the clock left off.
4. **Reward, don't scold.** Streaks, counts, and end-of-day summaries framed positively; no guilt copy, no red shaming.
5. **Evidence-based, locally computed.** Durations traceable to cited guidance (§15); zero telemetry, zero network — all state in `globalState`.
6. **One status-bar citizen.** A single adaptive item represents whichever timer is dominant; no widget sprawl.
7. **Accessibility parity.** Every visual signal has textual and screen-reader equivalents — consistent with the suite's own multi-dimensional signaling principle.

---

## 5. Proposed Feature Set

### F1. Unified Wellness Hub (status bar + command center)

- One status-bar item (Right, priority ~100) reflecting the **dominant** active subsystem:
  - `$(eye) 12:40` — eye-break countdown (Tier 2 active)
  - `$(watch) 18:22` — FocusFlow work phase remaining
  - `$(coffee) 03:10` — pomodoro break in progress
  - `$(shield) ok` — only Guardian active (default state; deliberately calm)
  - `$(eye) break 14s` — break running
- Tint uses the theme palette: **Safe** green (>5 min to event), **Caution** amber (<5 min), **Warning** orange (due/overdue). Color always paired with icon+text (multi-dimensional signaling).
- Click opens a **QuickPick command center**: Start/Pause/Skip Pomodoro, Take eye break now, Snooze 10 min, Toggle each tier, Open dashboard, Open settings.
- Hover tooltip: rich Markdown (`MarkdownString.supportThemeIcons`) summarizing all timers + today's stats.

### F2. 20-20-20 Ocular Rest Assistant v2

1. **Activity-aware clock.** Continuous-work accumulator advances only while active (§6.2). Idle > `idleThresholdSeconds` (default 120 s) ⇒ clock freezes; returning resumes (physiologically correct: eyes rested while away).
2. **Pre-break heads-up** (30 s before, configurable): amber tint + whisper toast "Eye break in 30s — finish your thought."
3. **Break UX styles:** `toast` (default) · `overlay` (non-blocking editor border pulse, §6.4) · `modal` (with **Skip** / **Snooze 10 min** / **Done early**).
4. **Skip & snooze tracked;** two consecutive skips downgrade the next reminder to status-only (anti-fatigue), while the Guardian still watches total continuous time.
5. **Streaks:** honored-break counter in tooltip/dashboard ("🔥 6 clean breaks today").
6. **Back-compat:** `zerotosaas.restReminder.*` keys keep working, mapped onto the new engine; deprecated aliases noted in setting descriptions.

### F3. Blink Coach

- Rationale: blink rate drops ~66% during screen focus (§15); dry-eye is the most common CVS complaint and doesn't wait 20 minutes.
- Between eye breaks, every `blinkCoach.intervalMinutes` (default 5): status item briefly pulses `$(eye)` + optional whisper "Blink slowly ×3 👁️". ≤ 4 s, never modal.
- Enabled together with the eye assistant (one switch, two cues) with individual override.

### F4. FocusFlow — Pomodoro × 20-20-20 Fusion (best of both worlds)

**Problem with naively running both timers:** a 25-min pomodoro and a 20-min eye timer collide at minute 20 of every cycle — double interruptions, timer desync resentment.

**Fusion model (default `mode: "fused"`):**

- Phases: `work` (25 m) → `short break` (5 m); `long break` (15 m) after `longBreakEvery` (4) cycles.
- **Eye micro-break injection:** if the work phase exceeds 20 *active* minutes, a 20-second 20-20-20 micro-break fires exactly at the 20-minute boundary *inside* the phase (`$(eye) look far 20s`). With 25-min phases this yields one micro-break per cycle; with `workMinutes ≤ 20` it never intrudes.
- **Short pomodoro break doubles as extended eye rest** — its end-of-break toast reminds: "use the last 30 s to focus on something far away."
- **Long break adds movement:** appends the posture/stretch nudge (F6).
- **Independent mode** (`mode: "independent"`): both run side-by-side; collision resolution merges reminders due within 60 s.
- Controls: Start / Pause / Resume / Stop / Skip-phase; `autoStartBreaks` / `autoStartWork` both default **off** — humans decide transitions.
- Cycle counter in the status item (`$(watch) 14:02 · 2/4`).
- Survives window reloads via `globalState` timestamps (§6.3).
- No binary audio assets in v1; phase transitions signaled via status flash (+ optional Phase 4 chime setting).
- **v1 exclusions:** no task labels or per-task time tracking, no bundled audio files, no cloud sync (see §18).

### F5. Continuous Work Guardian (Always-On Safety Net)

**Satisfies: "even with pomodoro/20-20-20 switched off, anyone typing/scrolling/working long still gets reminded."**

- **Ships enabled** (`zerotosaas.wellness.guardian.enabled: true` — decided with user). A one-time first-run notice (F8) discloses it and offers opt-out; the choice persists. Once accepted, it cannot silently disappear.
- Tracks `continuousActiveMs` from real interaction time; pauses on idle; clears after `resetIdleMinutes` (default 3) away.
- Thresholds (defaults):
  - `softLimitMinutes: 50` → Warning-orange tint + gentle toast: *"You've been in flow for 50 minutes. Worth a 2-minute reset — stand, sip water, look far."*
  - `hardLimitMinutes: 75` → firmer toast (or modal per `escalation`), then rate-limited re-reminders at most once per `reRemindAfterMinutes` (15) until a genuine ≥2-min away period resets the accumulator.
- **Quiet hours** (`quietHours.start/end`): suppress toasts but keep status tint — signal degrades, never vanishes.
- **Presentation guard:** zen/presentation mode or active screencast context defers toasts and re-queues them.
- **Daily rhythm:** `dailySoftLimitHours` (8) → one-time summary toast + dashboard pointer.

### F6. Movement, Posture & Hydration Nudges

- `movement.nudgeEveryMinutes` (default 0 = off; suggested 50) — pairs with pomodoro long breaks and Guardian hard-limit reminders.
- `hydration.everyMinutes` (off by default) — toast-only, frequency-capped.
- Copy rotates among 5–6 variants to avoid banner blindness.

### F7. Health Dashboard & Session Stats

- Command `zerotosaas.wellness.openDashboard` renders a CSP-safe local Webview styled with the active theme palette (`getThemePalette()` reuse):
  - Today: active screen time, continuous-work peaks, eye breaks taken/skipped, blink cues, pomodoro cycles, longest uninterrupted stretch.
  - 7-day trend (inline SVG bars — zero dependencies).
  - Quick toggles for every tier (writes canonical settings via API).
- Data: counters in `context.globalState`, aggregated at midnight rollover.

### F8. Onboarding & Discoverability

- `contributes.walkthroughs` in `package.json`: theme selection, Guardian explanation, FocusFlow start, dashboard — each step executable via `command:` metadata.
- First-run Guardian notice (once, gated by `globalState.onboarding.done`): single non-modal info message: *"ZeroToSaaS will gently remind you to rest after long uninterrupted sessions (~every 50 min of continuous work). Everything stays local — nothing leaves your machine."* → `[Also enable 20-20-20 eye breaks]` / `[Turn off guardian]`; dismissing the notification = keep on. "Turn off" writes `wellness.guardian.enabled: false` (canonical, discoverable in Settings UI); every path sets `onboarding.done`. Re-discoverable via the walkthrough.
- README gains a "Wellness & Focus" section; gallery gains a wellness card.

### F9. De-Nagging Pass on Existing Advisories

- Dark-theme external-activation warning: **once per theme label per day** + `"Don't remind me again"` persistent suppression.
- Night-theme QuickPick advisory: two sentences + "Apply and stop advising"; full medical text linked to `Guidelines.md`.
- Rationale: repetition converts a health message into noise; noise trains users to dismiss health UI — the opposite of the mission.

### F10. Accessible Notification Design

- Plain-language sentence first, emoji/icon last (clean screen-reader announcement).
- Status item exposes `accessibilityInformation` ({ role: "timer", label: dynamic description }).
- With `editor.accessibilitySupport === 'on'`: text-first notifications; overlay auto-downgrades to toast.

---

## 6. Technical Architecture

### 6.1 Module layout

```
src/
  extension.js            # slim orchestrator: registration + wiring only (<300 lines goal)
  wellness/
    engine.js             # singleton scheduler: one 1s tick drives all tiers
    activity.js           # interaction tracker (last-active, idle, continuous accumulator)
    eyeBreak.js           # Tier 2 state machine (idle, armed, heads-up, breaking, skipped)
    pomodoro.js           # FocusFlow state machine (work/short/long, fusion hooks)
    guardian.js           # Tier 1 thresholds, escalation, rate limiting
    stats.js              # counters, daily rollover, streaks (globalState adapter)
    dashboard.js          # webview panel
    copy.js               # all user-facing strings (i18n-ready, tone-guided)
```

Each machine is a **pure transition function** `(state, now, config, activitySnapshot) => { nextState, actions[] }` with effects applied by the engine — making timing logic unit-testable in plain Node (`node --test scripts/wellness.test.js`), matching the repo's zero-framework test style (`scripts/validate-contrast.js`).

### 6.2 Activity detection (no native idle API — derive it)

| Signal | Source | Notes |
| :--- | :--- | :--- |
| Text edits | `onDidChangeTextDocument` | Strongest signal |
| Selection/cursor moves | `onDidChangeTextEditorSelection` | Includes arrow-key nav |
| Scrolling | `onDidChangeTextEditorVisibleRanges` | Already subscribed |
| Editor switches | `onDidChangeActiveTextEditor` | Reading/reviewing |
| Window focus | `onDidChangeWindowState` (`focused`) | Hard gate: unfocused ⇒ idle |
| Terminal/debug focus | `onDidChangeActiveTerminal` | Debugging is work too |

`active = windowFocused && (now - lastInteraction) <= idleThresholdSeconds`, throttled to ≤1 update/5 s. Covers: (a) reading without keys (scroll/selection still fire; truly motionless 10+ min ⇒ idle-pause is *desired*), (b) long-running debug sessions, (c) OS lock/sleep via §6.3.

### 6.3 Persistence & drift correction

All schedules store **absolute epoch targets**, never interval counts:

```
globalState keys (prefix z2s.wellness.)
  eye.nextBreakAt        eye.breakUntil       eye.skipsRow
  pomo.phase             pomo.phaseEndsAt     pomo.cycle
  guard.continuousMs     guard.lastHardRemindAt
  stats.daily.{date}     stats.streakEye      onboarding.done
  advisory.dark.{label}.{date} = true
```

On activation/resume (`onDidChangeWindowState → focused`): recompute against wall clock; if a break target expired while away by > `graceMinutes` (default 5), treat as *taken* (user was physically away) rather than spamming overdue alerts. Sleep/wake self-heals.

Multi-window: extension hosts share `globalState` but run separate timers. Mitigation: before any toast, write `z2s.wellness.lock.{tier}` = timestamp; suppress if another window holds a lock younger than 30 s (best-effort dedupe; residual risk documented §13).

### 6.4 Overlay break mode (non-blocking)

`isWholeLine` decoration + themed border pulse via existing `setDecorations` pipeline — zero webviews, zero layout shift; colors from `getThemePalette()` so every variant (incl. HC/CVD) ships tuned values.

### 6.5 Performance budget

- Exactly **one** `setInterval(…, 1000)` for the entire wellness layer (replaces today's timer; net-zero when only Guardian runs).
- Event listeners throttled; zero added work on typing hot paths.
- Dashboard webview lazy-created, disposed on close; stats are O(1) Map reads.

---

## 7. Configuration Reference (Proposed)

New namespace `zerotosaas.wellness.*`. Legacy `zerotosaas.restReminder.*` remains functional (engine reads legacy keys when new ones are untouched).

| Setting | Type / Default | Description |
| :--- | :--- | :--- |
| `wellness.guardian.enabled` | bool / **true** | Always-on continuous-work safety net (Tier 1) |
| `wellness.guardian.softLimitMinutes` | num / 50 | First gentle reminder threshold |
| `wellness.guardian.hardLimitMinutes` | num / 75 | Firm reminder threshold |
| `wellness.guardian.reRemindAfterMinutes` | num / 15 | Max repeat frequency while over limit |
| `wellness.guardian.resetIdleMinutes` | num / 3 | Away-time that clears the continuous counter |
| `wellness.guardian.escalation` | enum / `toast` | `statusOnly` \| `toast` \| `modal` |
| `wellness.idleThresholdSeconds` | num / 120 | Interaction gap marking user idle |
| `wellness.quietHours.start` / `.end` | str / "" | "HH:mm" window suppressing toasts (tint persists) |
| `wellness.eyeBreak.enabled` | bool / false | 20-20-20 assistant v2 (mirrors legacy toggle) |
| `wellness.eyeBreak.intervalMinutes` | num / 20 | Active-time between ocular breaks |
| `wellness.eyeBreak.breakDurationSeconds` | num / 20 | Break length (legacy-compatible floor 5) |
| `wellness.eyeBreak.headsupSeconds` | num / 30 | Pre-break notice lead time |
| `wellness.eyeBreak.style` | enum / `toast` | `statusOnly` \| `toast` \| `overlay` \| `modal` |
| `wellness.blinkCoach.enabled` | bool / false | Mid-interval blink cues |
| `wellness.blinkCoach.intervalMinutes` | num / 5 | Cadence |
| `wellness.focusFlow.mode` | enum / `off` | `off` \| `fused` \| `independent` |
| `wellness.focusFlow.workMinutes` | num / 25 | Work phase length |
| `wellness.focusFlow.shortBreakMinutes` | num / 5 | Short break |
| `wellness.focusFlow.longBreakMinutes` | num / 15 | Long break |
| `wellness.focusFlow.longBreakEvery` | num / 4 | Cycles before long break |
| `wellness.focusFlow.autoStartBreaks` | bool / false | Auto-transition break→work |
| `wellness.focusFlow.autoStartWork` | bool / false | Auto-transition work→break |
| `wellness.movement.nudgeEveryMinutes` | num / 0 (off) | Stand/stretch cue cadence |
| `wellness.hydration.everyMinutes` | num / 0 (off) | Water cue cadence |
| `wellness.daily.softLimitHours` | num / 8 | Triggers one daily usage summary |
| `wellness.dashboard.showInStatusBarTooltip` | bool / true | Embed today's numbers in tooltip |
| `wellness.darkAdvisory.suppressed` | bool / false | Silences dark-theme advisories permanently |

Deprecation aliases: `restReminder.enabled → wellness.eyeBreak.enabled`, `restReminder.intervalMinutes → wellness.eyeBreak.intervalMinutes`, `restReminder.breakDurationSeconds → wellness.eyeBreak.breakDurationSeconds`. Engine resolution order: new key if set → legacy key → default. Legacy keys get `"deprecationMessage"` in their `package.json` descriptions pointing at the replacement, but remain functional indefinitely (no removal date committed).

## 8. Command Reference (Proposed)

| Command ID | Title | Keybinding (proposal) |
| :--- | :--- | :--- |
| `zerotosaas.wellness.openHub` | Open Wellness Command Center | `Ctrl+Alt+W` |
| `zerotosaas.wellness.openDashboard` | Show Health Dashboard | — |
| `zerotosaas.eyeBreak.takeNow` | Take 20-20-20 Eye Break Now | `Ctrl+Alt+E` |
| `zerotosaas.eyeBreak.snooze` | Snooze Next Eye Break 10 min | — |
| `zerotosaas.pomodoro.start` | FocusFlow: Start Session | `Ctrl+Alt+P` |
| `zerotosaas.pomodoro.pause` / `.resume` | Pause / Resume | — |
| `zerotosaas.pomodoro.stop` | Stop Session | — |
| `zerotosaas.pomodoro.skipPhase` | Skip Current Phase | — |
| `zerotosaas.guardian.resetContinuousTimer` | Reset Continuous-Work Watch | — |
| *(existing)* `toggleRestReminder`, `resetRestTimer` | kept as back-compat wrappers | — |

---

## 9. Worked Example: A Fused 2-Hour Session

Defaults: FocusFlow `fused` (25/5×4), micro-break injection at 20 active minutes, Guardian 50/75, idle threshold 2 min.

| Clock | Event | Surface |
| :--- | :--- | :--- |
| 0:00 | User starts FocusFlow | `$(watch) 25:00 · 1/4` |
| 0–20:00 | Deep work (+blink cues at 5/10/15 m if enabled) | brief `$(eye)` pulses |
| 20:00 | **Injected 20-20-20 micro-break**, work resumes after | `$(eye) look far 20s` |
| 23:00 | Heads-up: "Work ends in 2 min" | amber tint |
| 25:00 | Work→short break (manual advance) | `$(coffee) 05:00` |
| 30:00 | Cycle 2 begins … | … |
| 48:00 | Micro-break #2 (20 active min into cycle 2) | eye cue |
| 55:00 | Cycle 2 ends → short break #2 | coffee |
| 60:00 | Micro-break #3 mid-cycle-3 | eye cue |
| 85:00 | Micro-break #4 | eye cue |
| 95:00 | Cycle 4 ends → **long break** + movement/stretch nudge | `$(coffee) 15:00 🧘` |
| 115:00 | Continuous active time (net of breaks) below Guardian limits → silent | green |
| *contrast* | Same session with FocusFlow & eye assistant **OFF** | Guardian alone toasts once at 50 active min, firmly at 75, then ≤1×/15 min — the promised safety net |

---

## 10. Edge Cases & Failure Modes

| Case | Behavior |
| :--- | :--- |
| Laptop lid closed / OS sleep | Wall-clock targets recomputed on wake; absence > grace ⇒ breaks auto-marked taken, no overdue spam |
| User in meeting (window unfocused) | Window-blur gates activity ⇒ all accumulators freeze |
| Reading-only marathon (no keys) | Scroll/selection/editor-switch events count as activity; truly frozen viewer goes idle by design |
| Long-running tests/debug watch | Terminal/debug focus signals count as activity |
| Pomodoro & eye timer due together (independent mode) | Merged into one combined notification within 60 s window |
| Repeated skipping | Escalation damping (next cue status-only); Guardian unaffected — physiological floor preserved |
| Multiple VS Code windows | `globalState` lock dedupe; worst case duplicate toast, never duplicated modals |
| Screen sharing / presentation / zen mode | Toasts deferred and re-queued until mode exits |
| Large monorepo churn | Wellness layer touches no documents/decorations — zero interaction with decoration engine |
| Restart mid-pomodoro | Phase + absolute end restored from `globalState`; expired-during-restart handled by grace rule |
| `editor.accessibilitySupport: on` | Visual-only styles upgraded to text-first notifications |
| `window.autoDetectColorScheme: true` | Time-based auto-switch defers silently + one-time hint (§17.3); resumes when native switching disabled |

---

## 11. Implementation Task List (Phased)

### Phase 0 — Correctness & de-nag (small, immediate)

*Exit criteria:* zero unhandled exceptions from the Error Lens path during typing/diagnostics churn; each advisory fires ≤ once per theme label per day.

- [ ] P0.1 Create `hintLensDecorationType` in `initDecorations()` (muted info-style fg/bg); verify `updateErrorLens` no longer throws (`src/extension.js:426-461,1076`).
- [ ] P0.2 Dedupe dark-theme advisory: once per theme-label per day + persistent "Don't remind me again" (F9).
- [ ] P0.3 Shorten night-theme QuickPick advisory; link to Guidelines.md (F9).
- [ ] P0.4 Remove `"Linters"` from `package.json` categories.

### Phase 1 — Wellness core + Guardian safety net

*Exit criteria:* unit tests pass (`pnpm test`); Guardian fires within ±5 s of simulated thresholds on a scripted activity timeline; legacy `restReminder.*` behavior unchanged when new keys are untouched.

- [ ] P1.1 Scaffold `src/wellness/` modules (pure state machines + single shared tick); port legacy rest-assistant behind new engine (legacy settings keep working).
- [ ] P1.2 Implement `activity.js` (signals table §6.2, throttled).
- [ ] P1.3 Implement `guardian.js` (soft/hard thresholds, rate-limited escalation, idle reset, quiet hours).
- [ ] P1.4 Unified status-bar item with palette-driven tints + `accessibilityInformation`.
- [ ] P1.5 Unit tests `scripts/wellness.test.js`: scheduler transitions, drift/grace, guardian thresholds (`node --test`).
- [ ] P1.6 Settings schema (all §7 keys) in `package.json`.

### Phase 2 — Eye suite v2 + FocusFlow

*Exit criteria:* fused-session simulation reproduces the §9 timeline exactly (one injected micro-break per 25-min phase); skip/snooze state and pomodoro phase survive window reload.

- [ ] P2.1 Eye-break v2: idle-aware countdown, heads-up, `toast|overlay|modal` styles, skip/snooze, streaks.
- [ ] P2.2 Blink coach cues.
- [ ] P2.3 Pomodoro machine (phases, cycle counter, auto-start flags, reload persistence).
- [ ] P2.4 Fusion logic: 20-min micro-break injection + 60-s collision merging (independent mode).
- [ ] P2.5 Hub QuickPick (`openHub`) + keybindings; back-compat command wrappers.
- [ ] P2.6 Multi-window lock dedupe.

### Phase 3 — Insights & onboarding

*Exit criteria:* dashboard renders without CSP errors across all 20 theme palettes; walkthrough completable end-to-end on a fresh profile; first-run notice appears exactly once and every button path persists its outcome.

- [ ] P3.1 `stats.js` daily rollover + streaks; tooltip embed.
- [ ] P3.2 Dashboard webview (today + 7-day SVG trend + quick toggles), palette-styled.
- [ ] P3.3 Walkthrough contribution + one-time first-run Guardian notice (F8: disclose-and-consent).
- [ ] P3.4 Movement & hydration nudges (F6).

### Phase 4 — Polish & publication

*Exit criteria:* `pnpm run build && pnpm run validate && pnpm run package` all green; docs published and cross-linked; version bumped; AGPL headers present.

- [ ] P4.1 Extract all copy to `copy.js` with rotation variants and tone guide.
- [ ] P4.2 Optional soft chime (setting-gated, no binary assets).
- [ ] P4.3 Publish report body (all sections except Plan Execution Notes and §11) as `docs/Wellness.md` with front matter restored; link from `docs/index.md`, `docs/TODO.md` (§3 Developer Health), README ("Wellness & Focus" section), gallery card, CHANGELOG.
- [ ] P4.4 AGPL headers in every new file (repo CLA policy).
- [ ] P4.5 Release: bump version (`0.2.0 → 0.3.0` in `package.json`), write `CHANGELOG.md` entry, run full pipeline `pnpm run build && pnpm run validate && pnpm run package`.

### Phase 5 — Cross-surface tokens & IDE config completion (§16, §17)

*Exit criteria:* all 20 regenerated themes include every §17.1 key group with validator-passing contrast; `tokens/` artifacts build and pass `--tokens` assertions; OpenVSX listing live; VSCodium smoke test passes.

- [ ] P5.1 Add §17.1 color groups to `scripts/generate-themes.js` across all 20 themes; extend `scripts/validate-contrast.js` with assertions for new pairs; regenerate themes + gallery.
- [ ] P5.2 Add non-motion `configurationDefaults` (stickyScroll, global bracket colorization/guides); document opt-in motion trio in README recommended settings.
- [ ] P5.3 Implement auto-switch coexistence guard with `window.autoDetectColorScheme` (defer + one-time hint, §17.3).
- [ ] P5.4 Build `scripts/export-tokens.js`: emit `tokens/wellness.json`, `tokens/document-palette.css`, `tokens/document-palette.json`; add `--tokens` validator mode; wire into `build` script.
- [ ] P5.5 Publish wellness release to OpenVSX; VSCodium install + feature smoke test; Theia walkthrough-degradation check (§16.1 matrix).

---

## 12. Validation & QA Plan

1. **Automated:** `pnpm run validate` stays green (420 assertions); new `node --test scripts/wellness.test.js` asserting: idle freeze/resume math, injected micro-break placement (25-min phase ⇒ exactly one at 20:00), collision merge, guardian rate limiting, grace-rule auto-take, midnight rollover.
2. **Manual matrix:** each tier × {focused, blurred, idle > 2 m, sleep-wake, reload mid-session, two windows, presentation mode, screen-reader on}; verify ≤1 s tick and zero decoration-engine interference (Extension Host sampler profile).
3. **Regression:** legacy `restReminder.*` keys drive v2 behavior identically when new keys untouched.
4. **Package check:** `pnpm run package` succeeds; walkthrough renders in VS Code/Cursor/Windsurf smoke test.
5. **Token exports (P5.4):** `node --test` asserts wellness.json constants match §7 defaults; `--tokens` validator mode passes ≥7:1 + CVD separation on every exported pair; CSS/JSON parse cleanly.
6. **Cross-IDE matrix (§16.1):** manual pass on VSCodium (status bar, toasts, dashboard webview, persistence) and Theia (walkthrough degradation harmless, no console errors from unknown contributions).

## 13. Risks & Mitigations

| Risk | Mitigation |
| :--- | :--- |
| Notification fatigue → users disable everything | Escalation ladder, damping on skips, quiet hours, single status citizen, capped Guardian frequencies |
| Multi-window duplicate prompts | `globalState` locks + grace rules (residual: rare duplicate toast, accepted & documented) |
| Timer drift / battery throttling of `setInterval` | Absolute-epoch targets recomputed per tick; correctness never depends on tick count |
| Perceived surveillance ("counting me") | Local-only state, transparent dashboard, plain-language explanations, master off switch |
| Feature bloat diluting theme brand | Distinct `wellness` namespace; themes remain the README headline |
| Regression risk in hot extension file | Phased module extraction; Phase 0 fixes land independently and small |

## 14. Success Metrics

(All measurable locally in the dashboard; no telemetry shipped.)

- ≥ 30% of installs keep Guardian enabled at week 2 (default-on guarantees baseline).
- Median honored eye breaks/day ≥ 4 among eye-suite users.
- Skip-to-take ratio < 3:1 (dismissals vs. take-now invocations).
- Zero decoration-engine CPU regression (before/after profile parity).
- Dark-advisory complaints → near zero post-F9.

## 15. Medical Grounding & References

Aligned with the repo's existing citations in `docs/Guidelines.md`:

1. **20-20-20 rule** — American Academy of Ophthalmology, digital device usage guidance: every 20 min, ≥20 s at ≥20 ft.
2. **Blink-rate depression** — Patel S. et al. (1991); Tsubota K., Nakamori K. (1993): blink rate drops markedly at screens; corneal drying drives dry-eye CVS symptoms → motivates F3.
3. **Computer Vision Syndrome** — American Optometric Association definition & management (rest breaks, task lighting, polarity) → motivates Tiers 1–2.
4. **Pomodoro Technique** — Cirillo F. (1988/2018): 25/5 cycles with longer recovery blocks → F4 defaults.
5. **Ultradian performance rhythms** — ~90-min alertness cycles supporting 50–75-min continuous-work ceilings (deliberate-practice rest literature, Ericsson et al.) → Guardian defaults.
6. **Positive-polarity advantage & pupil optics** — as argued in README "Developer Health" (kept consistent; the wellness layer complements passive contrast with active behavior change).

## 16. Beyond the IDE: Cross-Surface Wellness (VSCodium, Web, Mobile, TV, SaaS & Documents)

**Scope decision (user-confirmed):** guidance sections + token exports now (`scripts/export-tokens.js` emitting wellness + document palettes); a standalone reusable `wellness-core` SDK package is explicitly deferred (§18). The architecture already enables this: every wellness state machine is a pure function `(state, now, config, activitySnapshot) => { nextState, actions[] }` with zero VS Code imports in its transition logic — the same timing constants and thresholds ship as data tokens any surface can consume.

### 16.1 VSCodium-compatible IDE family (VS Code · Cursor · Windsurf · Antigravity · VSCodium · Theia)

The extension uses only stable, universally-implemented APIs (`engines: ^1.74`). Per-feature compatibility and required graceful degradation:

| Capability | VS Code | Cursor | Windsurf | Antigravity | VSCodium | Theia |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Themes / workbench colors (§17) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Status-bar item + palette tints | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Toasts / modal escalation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `globalState` persistence & multi-window locks | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Webview dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Keybinding chords (`Ctrl+Alt+*`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `accessibilityInformation` on status item (≥1.44) | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ ignored harmlessly |
| `contributes.walkthroughs` | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ partial — unknown contributions are ignored; degrade to README/docs link |

Rules: feature-detect nothing proprietary; never assume marketplace-only distribution — publish the wellness release to **OpenVSX** (existing roadmap §0) so VSCodium users get it; add a VSCodium install smoke test to the release checklist. AI-first surfaces (Cursor inline ghosts, Windsurf Cascade, Antigravity chat) additionally benefit from §17's ghost-text/chat token coverage.

### 16.2 Web applications (SaaS dashboards, portals)

- Consume `tokens/wellness.json` (identical defaults) + `tokens/document-palette.css`; do not fork timings.
- Activity adapter mapping (same accumulator math, different signals):

| IDE signal | Web equivalent |
| :--- | :--- |
| `onDidChangeWindowState` (focus) | `focus`/`blur` + `visibilitychange` (tab hidden ⇒ idle immediately) |
| Selection / document edits | throttled `keydown`, `pointermove`, `pointerdown`, `wheel`/`scroll` |
| Editor switch | SPA route change, iframe focus |
| Long-read detection | IntersectionObserver dwell on content region |

- Notification surfaces, escalating like F5: non-blocking corner toast → tab-title pulse (`(Break) MyApp`) → favicon hue swap to Warning amber (multi-dimensional signaling without modality).
- Respect `prefers-reduced-motion` (disable pulses/animations) and `prefers-color-scheme` (serve Light/Night token sets natively; OS-follow replaces the extension's time-based switcher, which exists only because VS Code lacked it).
- Strict/blocking overlay remains opt-in only, mirroring IDE policy.

### 16.3 Mobile

- Foreground/background lifecycle replaces window-focus gating; accumulators advance only while foregrounded.
- Reminders become scheduled local notifications computed from the same absolute-epoch targets (drift-corrected on foreground); deep-link back into the app after a break.
- Touch/scroll count as activity. No persistent background timers (battery policy); no OS screen-time integration (privacy/scope).

### 16.4 TV / 10-foot UI

- Remote-key presses are the only activity signal (no pointer); status-bar patterns don't exist at distance — reminders are full-screen, high-legibility overlays using Night/high-contrast tokens by default.
- Viewer-vs-operator distinction: passive playback is still continuous *exposure* — apply Guardian soft/hard limits as auto-dim + interstitial instead of dismissible toasts.
- Honor system screensaver handoff rather than fighting it.

### 16.5 SaaS applications & generated documents (PDF / XLSX / DOCX / print)

Core principle: downstream documents reuse the suite's validated scales — Safe/Caution/Warning/Panic diverging roles for status semantics, ColorBrewer qualitative sets for categorical series, sequential steps for magnitude — always paired with non-color indicators (icon + label), never color alone; always positive polarity (light canvas) regardless of the user's dark app theme, because print/projected output follows optical reading rules, not UI fashion.

Role mapping for generators (PDF libs, OOXML styling, CSS print):

| Document element | Token role | Hard rule |
| :--- | :--- | :--- |
| Body text / headers / footers | `fg` on `bg` / `bgSubtle`+`fgMuted` | ≥ 7:1 contrast everywhere |
| Status chips (paid, failed, pending…) | `safe/caution/warning/panic` `.bg`+`.fg` pairs | chip = color + icon glyph + text label |
| Negative amounts, overdue, failures | `panic.fg` | plus ▼/✕ glyph and accounting format `(1,234)` — not red alone |
| Table row banding | sequential scale steps 1–2 at ≤ 8% alpha | banding must not reduce text contrast below 7:1 |
| Categorical chart series | CVD-safe qualitative set | reuse validator ΔE_ok separation assertions |
| Sequential heatmaps | ColorBrewer sequential ramp | annotate endpoint values numerically |
| XLSX conditional formats | chip pairs + icon sets (✓ ! ✕) via icon-set rule | pair with number formats; sheet tab colors from accent variants |
| DOCX headings / links | accent / `info.fg` | use named styles, not ad-hoc manual formatting |
| Print stylesheet | force Light tokens; strip shadows/animations | `@media print { … }` block shipped in palette CSS |

Implementation vehicle (task P5.4): extend the planned `scripts/export-tokens.js` to emit
- `tokens/wellness.json` — all timing/threshold constants mirroring §7 defaults (intervalMinutes 20, breakDurationSeconds 20, blink cadence 5, pomodoro 25/5/15×4, guardian 50/75/15, idle 120 s, grace 5 min);
- `tokens/document-palette.css` — custom properties per role incl. the `@media print` block;
- `tokens/document-palette.json` — hex pairs keyed for OOXML/XLSX/DOCX styling libraries;
and add a `--tokens` assertion mode to `scripts/validate-contrast.js` proving every exported fg/bg pair passes ≥7:1 and CVD separation. Wire exports into `pnpm run build`.

---

## 17. IDE Human-Friendliness Configuration Catalogue

### 17.1 Verified theme-color gaps (add across all 20 themes in `scripts/generate-themes.js`)

Current themes already cover chrome comprehensively (title/activity/sidebar/status variants, full ANSI terminal, notifications, settings UI, indent guides 1–6, inline chat, git decorations — verified in generator lines ~791–1218). Gaps that materially affect human comfort, especially on AI-first IDEs:

| Missing key group | Why it matters | Suggested source values |
| :--- | :--- | :--- |
| `editorGhostText.foreground` (+ `.background`) | Inline AI completions dominate Cursor/Windsurf/Antigravity screens; default ghost text pulls attention and adds halation load | `fgMuted` at ~55–60% alpha |
| `editorStickyScroll.background` / `.border` | Sticky scope headers cut vertical eye travel during long files | `bgSubtle` / `border` |
| `editorBracketHighlight.foreground1..6` | Depth perception for nesting (defaults are uncalibrated); hue-align with existing indent-guide hues | accent, safe.fg, caution.fg, syntax.function, syntax.type, warning.fg |
| `editorUnnecessaryCode.opacity` (+ foreground) | De-emphasizing dead code lowers cognitive load | opacity `0.55`, fg `fgMuted` |
| `editorOverviewRuler.errorForeground/.warningForeground/.infoForeground` | Peripheral problem scanning without gutter fixation | panic/warning/info fg |
| `banner.background/.foreground` (+ icon variant keys) | Workspace-trust & extension banners currently unstyled | `bgSubtle` / `fg` |
| `chat.*` (requestBackground/border, slashCommandBackground, editedFileForeground…) | Copilot/Antigravity/Windsurf chat panels render unthemed today | bg/bgSubtle/accent family |
| `editorCommentsWidget.*` | Review threads legible across themes | bgSubtle/accent family |
| `merge.currentHeader/.incomingHeader` (+ backgrounds) | Conflict-resolution clarity under stress | safe.bg / info.bg pairs |
| `minimap.backgroundSlider/.hoverHighlight`, minimap error/warning marks | Peripheral navigation aid | subtle alphas of border/panic/warning |
| `testing.*` (messageError/warning, runAction borders) | Test-runner states match log-badge semantics | panic/warning/safe |
| `debugConsole.info/.warning/.errorForeground` | Debug output aligns with audit-log badge colors | caution/warning/panic fg |
| `sash.hoverBorder` | Resize affordances discoverable | accent |
| `walkthroughPage.*` / welcome tiles | Onboarding coherence with F8 walkthrough | bgSidebar/accent |

Extend `scripts/validate-contrast.js` to assert ≥ 7:1 for every newly introduced fg/background pair (no AA-large exceptions unless documented).

### 17.2 Recommended `configurationDefaults` additions

Ship only non-motion defaults globally (vestibular-safe); motion preferences stay opt-in documentation:

```jsonc
// added to contributes.configurationDefaults (global scope)
{
  "editor.stickyScroll.enabled": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active"
}
```

Documented as recommended (README settings block, NOT forced): `"editor.smoothScrolling": true`, `"workbench.list.smoothScrolling": true`, `"terminal.integrated.smoothScrolling": true`, `"editor.cursorSmoothCaretAnimation": "on"` — motion easing helps many users but can aggravate vestibular sensitivity, so it must remain user choice.

Never override (user autonomy): `editor.fontSize/lineHeight/fontFamily/fontLigatures`, `editor.accessibilitySupport` (read it, don't write it), `editor.minimap.enabled`, `editor.renderWhitespace`.

### 17.3 Native scheme-switch coexistence

VS Code natively supports `window.autoDetectColorScheme` + `workbench.preferredLightColorTheme/preferredDarkColorTheme` (OS-appearance follow). Rule: when `window.autoDetectColorScheme === true`, ZeroToSaaS's time-based auto-switch silently defers (no theme writes, no polling writes) and shows a one-time informational hint explaining both modes; it resumes when native switching is disabled. Prevents two agents fighting over `workbench.colorTheme`.

### 17.4 Settings the extension must respect at runtime

`editor.accessibilitySupport` ('auto'|'on'|'off' — drives F10 behavior), external `workbench.colorTheme` changes (already observed), zen/presentation context state (presentation guard, F5), and reduced-motion intent expressed via the user's smooth-scrolling settings (overlay pulse style downgrades if `editor.smoothScrolling === false`? — no: unrelated setting; rely solely on explicit wellness style config).

---

## 18. Out of Scope / Future Ideas

- Blocking full-screen enforced breaks (kiosk overlay) — hostile by default; revisit only as explicit opt-in "strict mode."
- Blue-light/night-shift tinting — OS owns this (Night Shift/f.lux); duplication invites conflict.
- Ambient light sensor integration — no VS Code API surface.
- Wearables, cloud sync, team dashboards — network + privacy scope creep vs. AGPL local-first ethos.
- AI fatigue prediction — unverifiable claims would contradict the suite's evidence-based brand.
- Standalone `wellness-core` npm SDK extraction for third-party apps — deferred by scope decision; the pure state-machine design keeps this a clean future refactor (§16).
- Native mobile/TV reference implementations — guidance and tokens only in this iteration.

---

*End of report. Implementation proceeds phase-by-phase per §11; Phase 0 items are safe standalone fixes.*
