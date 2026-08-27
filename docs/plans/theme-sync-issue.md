---
agent: devin-local
session: infrequent-lemming
created: 2026-08-27T07:00:06Z
---
# RCA: Cross-IDE theme propagation between Antigravity IDE and Devin IDE

Switching a theme in Antigravity IDE reappears in the Devin IDE (after restart) because Antigravity's Google Unified State Sync persists `workbench.colorTheme` + the full color map to the Google account, and the ZeroToSaaS extension's install hygiene (stale duplicate installs under the old publisher id, version-mismatched symlinks, Devin missing from the config script) lets `applyDefaultThemeOnce` re-fire on activation and reset themes per-IDE.

## Summary

Switching a theme in Antigravity IDE makes the same theme appear in the Devin IDE after a restart. The root cause is **Antigravity IDE's Google Unified State Sync** syncing `workbench.colorTheme` (and the entire color map) to the Google account, compounded by **extension install hygiene bugs in this repo** that let the extension's `applyDefaultThemeOnce` re-fire on activation and reset themes.

## Evidence gathered (read-only)

- `package.json`: publisher `zerotosaas-in`, name `zerotosaas-theme`, version `0.6.0`. Themes contributed under `contributes.themes`.
- `src/extension.js` `applyDefaultThemeOnce()` (lines 1374-1404): on activation, if `globalState[z2s.defaultThemeApplied]` is false AND the current theme is a VS Code built-in default, it overwrites `workbench.colorTheme` = `ZeroToSaaS Light (Default)` at `ConfigurationTarget.Global`. It also sets `preferredDarkColorTheme` / `preferredLightColorTheme`. The gate key `z2s.defaultThemeApplied` lives in `context.globalState`, which is **namespaced per extension ID per IDE**.
- `scripts/update-ide-configs.js`: targets only **Codium, Windsurf, Antigravity IDE**. **Devin IDE is NOT a target.** It removes stale entries matching `${extId}-` (i.e. `zerotosaas-in.zerotosaas-theme-*`) only — it does **not** clean up entries under the **old publisher id** `zerotosaas.*`.
- On disk:
  - `~/.antigravity-ide/extensions/`: `zerotosaas-in.zerotosaas-theme-0.5.2 -> repo` AND a stale `zerotosaas.zerotosaas-theme-0.2.0 -> repo`. The repo `package.json` now says `0.6.0`, so **both symlinks have version/id mismatches** vs their folder names.
  - `~/.windsurf/extensions/`: same pair, same mismatches.
  - `~/.devin/extensions/zerotosaas.zerotosaas-theme-0.1.0/`: a **real directory** (not symlink) with its own `package.json` declaring publisher `zerotosaas`, version `0.1.0` — a stale old install. The current extension is **not installed in Devin at all**.
- Antigravity IDE `state.vscdb` contains `antigravityUnifiedStateSync.theme` whose decoded value is `{"themeName":"ZeroToSaaS Protanopia (Magenta / Teal)","colors":{...full color map...}}`, matching `Antigravity IDE/User/settings.json` `workbench.colorTheme`. This is Antigravity's Google-account theme sync.
- Devin `product.json`: `"oldDataFolderName": ".windsurf"`, `"oldNameShort": "Windsurf"`, `"darwinBundleIdentifier": "com.exafunction.windsurf"`, `extensionsGallery.serviceUrl = marketplace.windsurf.com` — **Devin IDE is a rebrand of Windsurf (Codeium/Exafunction)**, with its own data dir `~/.devin` and `~/Library/Application Support/Devin`. No Google sync, no `antigravityUnifiedStateSync.*` keys, no Microsoft `userDataSync` keys.
- `.devin-shared/sharedStorage/state.vscdb` contains only `content.trust.model.key` and `history.recentlyOpenedPathsList` — **no theme state**.
- No Microsoft Settings Sync (`userDataSync.*` / `lastSync*` keys absent) in any IDE; no shared user-data dir; the three IDEs currently hold **different** themes (Windsurf `Default Light Modern`, Antigravity `ZeroToSaaS Protanopia`, Devin `ZeroToSaaS Golden Sand`).

## Root Cause Analysis

### Primary: Antigravity IDE Google Unified State Sync (confirmed)
`antigravityUnifiedStateSync.theme` persists the **full theme (name + color overrides)** to the Google account signed into Antigravity IDE. On any Antigravity instance signed into the same Google account, a restart pulls the synced theme and rewrites `workbench.colorTheme`. This is the confirmed mechanism by which a theme chosen in one Antigravity window reappears in another Antigravity instance after restart. It is **Antigravity-internal** (Google backend); the Devin IDE (Codeium/Windsurf fork) does not share this backend.

### Secondary: extension install hygiene (explains the "after restart" resets and the Devin-side symptom)
1. **Devin IDE is missing from `update-ide-configs.js` targets**, so the current extension is never installed/symlinked into `~/.devin/extensions`. Devin runs the **stale v0.1.0** extension (`zerotosaas.zerotosaas-theme-0.1.0`), whose activation behavior diverges from current code.
2. **Stale duplicate installs under the old publisher id `zerotosaas.*`** exist in all three IDEs. The cleanup loop only matches `${extId}-` = `zerotosaas-in.zerotosaas-theme-*`, so the `zerotosaas.zerotosaas-theme-*` entries are never removed. Where these are symlinks to the current repo (Windsurf/Antigravity), the folder-name id/version mismatch the repo `package.json` — VS Code may skip them, but they remain as dead entries that confuse `extensions.json`.
3. **Version-mismatched symlinks**: the live symlinks are named `...-0.5.2` while `package.json` is `0.6.0` (the script was last run at v0.5.2 and not re-run after the bump). VS Code validates folder-name version against `package.json` version; mismatches can cause the extension to fail to load or to load inconsistently across IDEs.
4. **`applyDefaultThemeOnce` gate is per-extension-ID**: if the extension ever loads under two IDs (current + stale) in the same IDE, each has an independent `z2s.defaultThemeApplied` globalState gate, so the default-applier can fire again under the second ID and reset `colorTheme` to `ZeroToSaaS Light (Default)` — overriding a user's manual choice on restart.

### Why "after restart" and "exactly the same"
- "After restart": both the Google sync pull and `applyDefaultThemeOnce` run during activation/startup.
- "Exactly the same": Antigravity sync copies the precise theme name + colors; the extension default-applier copies a fixed default. The user observes the Antigravity-synced theme reappearing in another Antigravity instance, and separately observes Devin being reset to a ZeroToSaaS theme by the stale extension on restart — perceived as "the same theme propagating."

### Honest uncertainty
The offline evidence confirms Antigravity→Antigravity theme sync via Google, but does **not** show a direct Antigravity→Devin cloud bridge (different backends, separate data dirs). If the user genuinely sees a theme chosen in Antigravity appear *verbatim* in Devin after restart, an additional runtime sync (e.g. a Devin/Codeium account setting sync that includes `colorTheme`, or Microsoft Settings Sync being enabled at the time) must be involved. The verification steps below isolate this.

## Suggested fixes

### A. IDE-level (stop the cross-instance theme propagation)
1. In Antigravity IDE: open Settings, search `antigravity` / "Unified State Sync" (or Accounts → Google → Sync settings), and **disable theme/color-theme sync** (or turn off Unified State Sync entirely for `workbench.colorTheme`). This stops Antigravity from pushing/pulling the theme to the Google account.
2. Alternatively, keep sync on but accept that theme is shared across Antigravity instances signed into the same Google account (by design).
3. If a verbatim Antigravity→Devin copy is confirmed (see verification), check whether Devin IDE has its own "Settings Sync" (Codeium/Windsurf account) enabled and either disable it or exclude `workbench.colorTheme` from sync.

### B. Extension-level (this repo) — prevent restart-time theme resets and clean installs
1. **`scripts/update-ide-configs.js`**:
   - Add a **Devin IDE** target: `extDir: ~/.devin/extensions`, `cacheDir: ~/Library/Application Support/Devin/CachedProfilesData` (verify the cache dir name).
   - Make the stale-entry cleanup remove **any** folder starting with `zerotosaas-theme-` or matching both `zerotosaas.zerotosaas-theme-*` and `zerotosaas-in.zerotosaas-theme-*` (i.e. clean old publisher ids too), not just `${extId}-`.
   - Re-run the script after every `version` bump so symlink folder names match `package.json` (or derive the folder name from the repo `package.json` at runtime — it already does; just ensure it's re-run).
2. **`src/extension.js` `applyDefaultThemeOnce`**:
   - Namespace the gate by extension version, e.g. key `z2s.defaultThemeApplied.v${version}`, so a version bump doesn't silently re-trigger it under a stale install.
   - Before overwriting, use `workbench.inspect('colorTheme')` to respect any explicit `globalValue`/`workspaceValue` even if it equals a built-in label.
   - Consider making the auto-default opt-in (off by default) to never override a user's manual choice — the current "only if on a built-in default" guard is fragile across forks that rename built-ins.
3. Remove the orphaned `~/.devin/extensions/zerotosaas.zerotosaas-theme-0.1.0` directory and the stale `zerotosaas.zerotosaas-theme-0.2.0` symlinks in Windsurf/Antigravity (the script fix above handles this going forward; one-time manual cleanup may be needed).

## Files to modify
- `scripts/update-ide-configs.js` — add Devin target; broaden stale-entry cleanup to old publisher id `zerotosaas.*`.
- `src/extension.js` — harden `applyDefaultThemeOnce` gate (version-namespaced key + `inspect()` respect).

## Verification
- [ ] Reproduce: with both IDEs open, switch theme in Antigravity IDE to a distinctive theme (e.g. `ZeroToSaaS Golden Sand`), restart Devin IDE, and confirm whether Devin's `~/Library/Application Support/Devin/User/settings.json` `workbench.colorTheme` changes. Repeat in the reverse direction.
- [ ] Inspect `antigravityUnifiedStateSync.theme` in `~/Library/Application Support/Antigravity IDE/User/globalStorage/state.vscdb` before/after a theme switch to confirm it tracks the new theme (confirms primary RCA).
- [ ] After disabling Antigravity theme sync (fix A1), repeat the reproduction and confirm propagation stops.
- [ ] Run `node scripts/update-ide-configs.js` after the script fix; confirm `~/.devin/extensions/zerotosaas-in.zerotosaas-theme-0.6.0 -> repo` exists and no `zerotosaas.zerotosaas-theme-*` entries remain in any IDE.
- [ ] After the `applyDefaultThemeOnce` hardening, set a non-default theme in each IDE, restart, and confirm the extension does **not** reset it.
- [ ] `gtimeout 30 pnpm validate` (contrast validation) and a manual reload of each IDE to ensure no load errors from mismatched symlinks.

## Risks / considerations
- Antigravity's Unified State Sync is a Google-account feature; disabling theme sync is a user preference, not something the extension can control. The extension can only stop *its own* restart-time resets.
- Removing stale `zerotosaas.*` extension dirs is safe (orphaned old publisher id) but should be confirmed not to be the only copy providing themes in Devin before deletion (currently Devin's only install is the stale v0.1.0 — the script fix will install the current one alongside cleanup).
- Changing `applyDefaultThemeOnce` gating is a behavior change for existing users who rely on the first-run default; gating by version + respecting explicit `inspect()` values mitigates regressions.
