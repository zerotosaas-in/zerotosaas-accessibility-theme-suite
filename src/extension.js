// Copyright (C) 2026 Sarvasv Technologies Pvt Ltd (ZeroToSaaS.in)
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const vscode = require('vscode');
const child_process = require('child_process');
const path = require('path');

// Semantic Cognitive Status Decoration Types
let safeDecorationType;
let cautionDecorationType;
let warningDecorationType;
let panicDecorationType;
let commentDecorationType;

// Odd-Sequence Indent Column Decoration Type
let oddIndentDecorationType;

// Inline Diagnostic Lens (Error Lens) Decoration Types
let errorLensDecorationType;
let warningLensDecorationType;
let infoLensDecorationType;
let hintLensDecorationType;

// Git Blame Cache for Error Lens
const gitBlameCache = new Map();
const MAX_CACHE_SIZE = 500;

// Performance Constants
const OVERSCAN_LINES = 60;
const FULL_DOC_LINE_THRESHOLD = 500;

// Performance Timers
let documentChangeDebounceTimer = null;
let selectionChangeDebounceTimer = null;
let scrollThrottleTimer = null;

function scheduleDocumentUpdate(editor, delayMs = 180) {
  if (documentChangeDebounceTimer) {
    clearTimeout(documentChangeDebounceTimer);
  }
  documentChangeDebounceTimer = setTimeout(() => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && editor && activeEditor.document.uri.toString() === editor.document.uri.toString()) {
      updateDecorations(activeEditor);
    }
  }, delayMs);
}

function scheduleSelectionUpdate(editor, delayMs = 50) {
  if (selectionChangeDebounceTimer) {
    clearTimeout(selectionChangeDebounceTimer);
  }
  selectionChangeDebounceTimer = setTimeout(() => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && editor && activeEditor.document.uri.toString() === editor.document.uri.toString()) {
      updateDecorations(activeEditor);
    }
  }, delayMs);
}

function formatTimeAgo(epochSeconds) {
  const diffSec = Math.floor(Date.now() / 1000) - epochSeconds;
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}

function parsePorcelainBlame(output) {
  const lines = output.split('\n');
  const firstLine = lines[0] || '';
  const hash = firstLine.split(' ')[0] || '';
  const isUncommitted = /^0+$/.test(hash) || !hash;

  if (isUncommitted) {
    return 'You (Uncommitted Changes)';
  }

  let author = 'Unknown';
  let authorTime = 0;
  let summary = '';

  for (const line of lines) {
    if (line.startsWith('author ')) {
      author = line.substring(7).trim();
    } else if (line.startsWith('author-time ')) {
      authorTime = parseInt(line.substring(12).trim(), 10) || 0;
    } else if (line.startsWith('summary ')) {
      summary = line.substring(8).trim();
    }
  }

  const shortHash = hash.substring(0, 7);
  const timeStr = authorTime > 0 ? formatTimeAgo(authorTime) : '';
  const summaryPart = summary ? ` (${summary})` : '';

  return `${author}${timeStr ? `, ${timeStr}` : ''} [${shortHash}]${summaryPart}`;
}

function fetchGitBlameForLine(filePath, lineOneIndexed, docVersion, callback) {
  if (!filePath) return null;
  const cacheKey = `${filePath}:${lineOneIndexed}:${docVersion}`;
  if (gitBlameCache.has(cacheKey)) {
    return gitBlameCache.get(cacheKey);
  }

  try {
    const cwd = path.dirname(filePath);
    child_process.execFile(
      'git',
      ['blame', '-L', `${lineOneIndexed},${lineOneIndexed}`, '--porcelain', '--', path.basename(filePath)],
      { cwd, timeout: 2000 },
      (err, stdout) => {
        if (err || !stdout) {
          gitBlameCache.set(cacheKey, null);
          return;
        }
        const blameText = parsePorcelainBlame(stdout);
        if (gitBlameCache.size >= MAX_CACHE_SIZE) {
          gitBlameCache.clear();
        }
        gitBlameCache.set(cacheKey, blameText);
        if (callback) {
          callback(blameText);
        }
      }
    );
  } catch (e) {
    gitBlameCache.set(cacheKey, null);
  }

  return null;
}

function getCurrentThemeId() {
  const workbenchConfig = vscode.workspace.getConfiguration('workbench');
  const cfgTheme = workbenchConfig.get('colorTheme');
  if (cfgTheme) return cfgTheme;

  if (vscode.window.activeColorTheme && vscode.window.activeColorTheme.kind !== undefined) {
    return vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrastLight
      ? 'high-contrast'
      : 'light';
  }

  return '';
}

function getThemePalette(themeId) {
  const tid = (themeId || '').toLowerCase();
  const isNight = tid.includes('night');

  if (tid.includes('high contrast')) {
    if (isNight) {
      return {
        oddIndentBg: '#1A1A1A',
        safe: { fg: '#6BCB7A', bg: '#0E2A14', border: '#FFFFFF' },
        caution: { fg: '#E8B85A', bg: '#2A2410', border: '#FFFFFF' },
        warning: { fg: '#E89A5A', bg: '#2A1A0E', border: '#FFFFFF' },
        panic: { fg: '#FF778A', bg: '#2A0E12', border: '#FFFFFF' },
        info: { fg: '#5B9BD6', bg: '#0F1A2A', border: '#FFFFFF' }
      };
    }
    return {
      oddIndentBg: '#EBEBEB',
      safe: { fg: '#00591E', bg: '#EBF8EE', border: '#000000' },
      caution: { fg: '#5E3800', bg: '#FEF7E2', border: '#000000' },
      warning: { fg: '#7A2E00', bg: '#FFF0E5', border: '#000000' },
      panic: { fg: '#8B0000', bg: '#FFEBEB', border: '#000000' },
      info: { fg: '#002D80', bg: '#F2F2F2', border: '#002D80' }
    };
  }

  if (tid.includes('deuteranopia')) {
    if (isNight) {
      return {
        oddIndentBg: '#14202C',
        safe: { fg: '#55A5F2', bg: '#0E1A2A', border: '#55A5F2' },
        caution: { fg: '#E8A05A', bg: '#2A1E10', border: '#E8A05A' },
        warning: { fg: '#E88A4A', bg: '#2A180E', border: '#E88A4A' },
        panic: { fg: '#FB825B', bg: '#2A120E', border: '#FB825B' },
        info: { fg: '#55A5F2', bg: '#0E1A2A', border: '#55A5F2' }
      };
    }
    return {
      oddIndentBg: '#E5EEF9',
      safe: { fg: '#0043A4', bg: '#F1F6FE', border: '#A6CEFD' },
      caution: { fg: '#733500', bg: '#FEF8F1', border: '#FED5B2' },
      warning: { fg: '#7D3800', bg: '#FFF8F1', border: '#FEC99A' },
      panic: { fg: '#8A2500', bg: '#FFF4EF', border: '#FFB899' },
      info: { fg: '#0043A4', bg: '#F1F6FE', border: '#A6CEFD' }
    };
  }

  if (tid.includes('protanopia')) {
    if (isNight) {
      return {
        oddIndentBg: '#1C1622',
        safe: { fg: '#4AD0BC', bg: '#0E2622', border: '#4AD0BC' },
        caution: { fg: '#E8B85A', bg: '#2A2410', border: '#E8B85A' },
        warning: { fg: '#E89A5A', bg: '#2A1A0E', border: '#E89A5A' },
        panic: { fg: '#F27ABA', bg: '#2A0E1E', border: '#F27ABA' },
        info: { fg: '#63A3DE', bg: '#0E1A24', border: '#63A3DE' }
      };
    }
    return {
      oddIndentBg: '#F0E5F2',
      safe: { fg: '#015D53', bg: '#F1FAF8', border: '#A3ECE0' },
      caution: { fg: '#703700', bg: '#FEF8F0', border: '#FDDDB0' },
      warning: { fg: '#7D3800', bg: '#FFF7F0', border: '#FDCD9E' },
      panic: { fg: '#8C0064', bg: '#FDF2F9', border: '#F9B7E3' },
      info: { fg: '#0A4BA0', bg: '#F4EEF5', border: '#C5A3CA' }
    };
  }

  if (tid.includes('tritanopia')) {
    if (isNight) {
      return {
        oddIndentBg: '#162024',
        safe: { fg: '#4AD0E0', bg: '#0E2226', border: '#4AD0E0' },
        caution: { fg: '#E8D05A', bg: '#2A2610', border: '#E8D05A' },
        warning: { fg: '#E87060', bg: '#2A1210', border: '#E87060' },
        panic: { fg: '#FF7594', bg: '#2A0E16', border: '#FF7594' },
        info: { fg: '#FC7291', bg: '#1A0E14', border: '#FC7291' }
      };
    }
    return {
      oddIndentBg: '#E2EFF1',
      safe: { fg: '#005D6B', bg: '#F1FAF9', border: '#A6E5EE' },
      caution: { fg: '#543D00', bg: '#FEF9EC', border: '#FCE6A8' },
      warning: { fg: '#941800', bg: '#FFF3EE', border: '#FFC8B8' },
      panic: { fg: '#A00028', bg: '#FEF1F3', border: '#FBBCC9' },
      info: { fg: '#005D6B', bg: '#EDF5F6', border: '#A6E5EE' }
    };
  }

  if (tid.includes('brown') || tid.includes('sepia')) {
    if (isNight) {
      return {
        oddIndentBg: '#1A1814',
        safe: { fg: '#BB9F83', bg: '#1A1410', border: '#BB9F83' },
        caution: { fg: '#E8B85A', bg: '#2A2410', border: '#E8B85A' },
        warning: { fg: '#DF9D77', bg: '#2A1A10', border: '#DF9D77' },
        panic: { fg: '#F97C68', bg: '#2A1210', border: '#F97C68' },
        info: { fg: '#CF9673', bg: '#1A1410', border: '#CF9673' }
      };
    }
    return {
      oddIndentBg: '#EFE6D7',
      safe: { fg: '#1F612B', bg: '#F2FAF3', border: '#B8E5BE' },
      caution: { fg: '#6A4400', bg: '#FEF8EB', border: '#FDE0A8' },
      warning: { fg: '#783A00', bg: '#FFF5EB', border: '#FDC498' },
      panic: { fg: '#8F1500', bg: '#FEF1EE', border: '#FBBDB0' },
      info: { fg: '#783A00', bg: '#F3EDE2', border: '#D5C4AE' }
    };
  }

  if (tid.includes('green') || tid.includes('forest')) {
    if (isNight) {
      return {
        oddIndentBg: '#101814',
        safe: { fg: '#74B689', bg: '#0E1A12', border: '#74B689' },
        caution: { fg: '#D3A46E', bg: '#2A2210', border: '#D3A46E' },
        warning: { fg: '#E89A5A', bg: '#2A1A0E', border: '#E89A5A' },
        panic: { fg: '#FF7772', bg: '#2A1010', border: '#FF7772' },
        info: { fg: '#6DB885', bg: '#0E1A12', border: '#6DB885' }
      };
    }
    return {
      oddIndentBg: '#E2F0E7',
      safe: { fg: '#0B6032', bg: '#EBF8EE', border: '#A6E4BE' },
      caution: { fg: '#5B4700', bg: '#FEFAEB', border: '#FCE7A6' },
      warning: { fg: '#7C3B00', bg: '#FFF6EB', border: '#FDC79B' },
      panic: { fg: '#960C1B', bg: '#FEF1F2', border: '#FBBBC2' },
      info: { fg: '#0B6032', bg: '#E8F2EB', border: '#BCD9C5' }
    };
  }

  if (tid.includes('purple') || tid.includes('plum')) {
    if (isNight) {
      return {
        oddIndentBg: '#161320',
        safe: { fg: '#6EB78A', bg: '#0E1A14', border: '#6EB78A' },
        caution: { fg: '#C79C64', bg: '#2A2210', border: '#C79C64' },
        warning: { fg: '#EE946A', bg: '#2A1A10', border: '#EE946A' },
        panic: { fg: '#FB7695', bg: '#2A0E16', border: '#FB7695' },
        info: { fg: '#BD87F4', bg: '#161220', border: '#BD87F4' }
      };
    }
    return {
      oddIndentBg: '#EDE4F4',
      safe: { fg: '#0A5E36', bg: '#EDFAF1', border: '#ABE5C2' },
      caution: { fg: '#6A4400', bg: '#FEF9ED', border: '#FDE1AB' },
      warning: { fg: '#843400', bg: '#FFF5EB', border: '#FDC395' },
      panic: { fg: '#910A3E', bg: '#FDF2F7', border: '#FAB7D2' },
      info: { fg: '#5B2188', bg: '#EDE6F3', border: '#CBBED5' }
    };
  }

  if (tid.includes('yellow') || tid.includes('sand')) {
    if (isNight) {
      return {
        oddIndentBg: '#181610',
        safe: { fg: '#84B470', bg: '#0E1A12', border: '#84B470' },
        caution: { fg: '#D7A26A', bg: '#2A2210', border: '#D7A26A' },
        warning: { fg: '#E89A5A', bg: '#2A1A0E', border: '#E89A5A' },
        panic: { fg: '#FA7C65', bg: '#2A1010', border: '#FA7C65' },
        info: { fg: '#C19F61', bg: '#181610', border: '#C19F61' }
      };
    }
    return {
      oddIndentBg: '#EFE9D2',
      safe: { fg: '#1A612D', bg: '#F1FAF3', border: '#B4E6C1' },
      caution: { fg: '#694700', bg: '#FEFAEB', border: '#FDE2A8' },
      warning: { fg: '#7D3900', bg: '#FFF5EB', border: '#FDC599' },
      panic: { fg: '#911200', bg: '#FEF1EE', border: '#FBBCB0' },
      info: { fg: '#6E4300', bg: '#F2EDDC', border: '#D0C39C' }
    };
  }

  if (tid.includes('orange') || tid.includes('terracotta')) {
    if (isNight) {
      return {
        oddIndentBg: '#1A1612',
        safe: { fg: '#71B87F', bg: '#0E1A12', border: '#71B87F' },
        caution: { fg: '#E28C60', bg: '#2A2210', border: '#E28C60' },
        warning: { fg: '#F39166', bg: '#2A1A10', border: '#F39166' },
        panic: { fg: '#FF7965', bg: '#2A1010', border: '#FF7965' },
        info: { fg: '#E9875D', bg: '#1A1612', border: '#E9875D' }
      };
    }
    return {
      oddIndentBg: '#EFE2D4',
      safe: { fg: '#186133', bg: '#F2FAF4', border: '#B3E6C3' },
      caution: { fg: '#6E4200', bg: '#FEF9ED', border: '#FDE1AA' },
      warning: { fg: '#8A3B00', bg: '#FFF5ED', border: '#FDC79E' },
      panic: { fg: '#931505', bg: '#FEF1EF', border: '#FBBCB3' },
      info: { fg: '#8A3B00', bg: '#F3E7DC', border: '#D0B9A4' }
    };
  }

  // Default: ZeroToSaaS Light (Default Cobalt-Slate) or Light Night
  if (isNight) {
    return {
      oddIndentBg: '#161C26',
      safe: { fg: '#6BCB7A', bg: '#0E2A14', border: '#6BCB7A' },
      caution: { fg: '#E8B85A', bg: '#2A2410', border: '#E8B85A' },
      warning: { fg: '#E89A5A', bg: '#2A1A0E', border: '#E89A5A' },
      panic: { fg: '#FF768A', bg: '#2A0E12', border: '#FF768A' },
      info: { fg: '#63A3DE', bg: '#0E1A24', border: '#63A3DE' }
    };
  }
  return {
    oddIndentBg: '#ECF1F9',
    safe: { fg: '#0B6229', bg: '#F1FAF3', border: '#B4E6C3' },
    caution: { fg: '#784A00', bg: '#FEF9EE', border: '#FDE4A3' },
    warning: { fg: '#8C3800', bg: '#FFF6EE', border: '#FDCBA6' },
    panic: { fg: '#990014', bg: '#FFF2F2', border: '#FCA5A5' },
    info: { fg: '#0B4F9C', bg: '#F3F6FA', border: '#D8E1ED' }
  };
}

function initDecorations(context) {
  disposeDecorations();

  const currentTheme = getCurrentThemeId();
  const palette = getThemePalette(currentTheme);
  const cfg = vscode.workspace.getConfiguration('zerotosaas');
  const wholeLineBg = cfg.get('errorLens.showEntireLineBackground', false);

  // Status Tokens with Alpha-blended backgrounds for smooth selection merging
  safeDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: palette.safe.bg + 'D9',
    borderRadius: '3px',
    border: `1px solid ${palette.safe.border}`,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  cautionDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: palette.caution.bg + 'D9',
    borderRadius: '3px',
    border: `1px solid ${palette.caution.border}`,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  warningDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: palette.warning.bg + 'D9',
    borderRadius: '3px',
    border: `1px solid ${palette.warning.border}`,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  panicDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: palette.panic.bg + 'D9',
    borderRadius: '3px',
    border: `1px solid ${palette.panic.border}`,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  // Odd-Sequence Indent Column with Alpha
  oddIndentDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: palette.oddIndentBg + 'B3',
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  // Error Lens Types
  errorLensDecorationType = vscode.window.createTextEditorDecorationType({
    isWholeLine: wholeLineBg,
    backgroundColor: wholeLineBg ? palette.panic.bg : undefined,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  warningLensDecorationType = vscode.window.createTextEditorDecorationType({
    isWholeLine: wholeLineBg,
    backgroundColor: wholeLineBg ? palette.warning.bg : undefined,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  infoLensDecorationType = vscode.window.createTextEditorDecorationType({
    isWholeLine: wholeLineBg,
    backgroundColor: wholeLineBg ? palette.info.bg : undefined,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  // Hint Lens Type — muted info-style fg/bg. Must be created here (alongside the
  // other lens types) so that updateErrorLens()'s final setDecorations call does
  // not throw on the hint path. Previously declared but never assigned, causing an
  // unhandled exception on every debounced diagnostics update that included hints.
  // Colors mirror the muted hint palette used in updateErrorLens()'s Hint branch.
  hintLensDecorationType = vscode.window.createTextEditorDecorationType({
    isWholeLine: wholeLineBg,
    backgroundColor: wholeLineBg ? '#F6F8FB' : undefined,
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  // Italic Comment Decoration Type (Guarantees italics across all languages)
  commentDecorationType = vscode.window.createTextEditorDecorationType({
    fontStyle: 'italic',
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
  });

  context.subscriptions.push(
    safeDecorationType,
    cautionDecorationType,
    warningDecorationType,
    panicDecorationType,
    commentDecorationType,
    oddIndentDecorationType,
    errorLensDecorationType,
    warningLensDecorationType,
    infoLensDecorationType,
    hintLensDecorationType
  );
}

function disposeDecorations() {
  if (safeDecorationType) safeDecorationType.dispose();
  if (cautionDecorationType) cautionDecorationType.dispose();
  if (warningDecorationType) warningDecorationType.dispose();
  if (panicDecorationType) panicDecorationType.dispose();
  if (commentDecorationType) commentDecorationType.dispose();
  if (oddIndentDecorationType) oddIndentDecorationType.dispose();
  if (errorLensDecorationType) errorLensDecorationType.dispose();
  if (warningLensDecorationType) warningLensDecorationType.dispose();
  if (infoLensDecorationType) infoLensDecorationType.dispose();
  if (hintLensDecorationType) hintLensDecorationType.dispose();
}

/**
 * Calculates the active target chunks to decorate.
 * - For files <= FULL_DOC_LINE_THRESHOLD: scans entire document (0 scroll overhead).
 * - For files > FULL_DOC_LINE_THRESHOLD: scans visible ranges + OVERSCAN_LINES buffer.
 */
function getTargetChunks(editor) {
  const doc = editor.document;
  const lineCount = doc.lineCount;

  if (lineCount <= FULL_DOC_LINE_THRESHOLD) {
    const lastLineLength = doc.lineAt(lineCount - 1).text.length;
    return [{
      startLine: 0,
      endLine: lineCount - 1,
      startOffset: 0,
      text: doc.getText(),
      range: new vscode.Range(0, 0, lineCount - 1, lastLineLength)
    }];
  }

  const visibleRanges = editor.visibleRanges || [];
  if (visibleRanges.length === 0) {
    const endLine = Math.min(lineCount - 1, OVERSCAN_LINES);
    const range = new vscode.Range(0, 0, endLine, doc.lineAt(endLine).text.length);
    return [{
      startLine: 0,
      endLine,
      startOffset: 0,
      text: doc.getText(range),
      range
    }];
  }

  // Expand each visible range by overscan buffer and merge overlaps
  const intervals = visibleRanges.map(vr => ({
    startLine: Math.max(0, vr.start.line - OVERSCAN_LINES),
    endLine: Math.min(lineCount - 1, vr.end.line + OVERSCAN_LINES)
  })).sort((a, b) => a.startLine - b.startLine);

  const merged = [];
  let current = intervals[0];

  for (let i = 1; i < intervals.length; i++) {
    const next = intervals[i];
    if (next.startLine <= current.endLine + 1) {
      current.endLine = Math.max(current.endLine, next.endLine);
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  return merged.map(m => {
    const startPos = new vscode.Position(m.startLine, 0);
    const endPos = doc.lineAt(m.endLine).range.end;
    const range = new vscode.Range(startPos, endPos);
    return {
      startLine: m.startLine,
      endLine: m.endLine,
      startOffset: doc.offsetAt(startPos),
      text: doc.getText(range),
      range
    };
  });
}

/**
 * Returns all character ranges belonging to comments across languages
 * so that comments are NEVER decorated with background highlights.
 */
function findCommentRanges(text, langId, doc, baseOffset = 0) {
  const commentRanges = [];

  // Single-line comments (// ..., # ..., -- ..., ; ...)
  const singleLineCommentPattern = /(\/\/[^\r\n]*|#[^\r\n]*|--[^\r\n]*|;[^\r\n]*)/g;
  let match;
  while ((match = singleLineCommentPattern.exec(text)) !== null) {
    const start = doc.positionAt(baseOffset + match.index);
    const end = doc.positionAt(baseOffset + match.index + match[0].length);
    commentRanges.push(new vscode.Range(start, end));
  }

  // Multi-line block comments (/* ... */)
  const blockCommentPattern = /\/\*[\s\S]*?\*\//g;
  while ((match = blockCommentPattern.exec(text)) !== null) {
    const start = doc.positionAt(baseOffset + match.index);
    const end = doc.positionAt(baseOffset + match.index + match[0].length);
    commentRanges.push(new vscode.Range(start, end));
  }

  // Python multi-line docstrings (""" ... """ or ''' ... ''')
  if (langId === 'python') {
    const docstringPattern = /("""[\s\S]*?"""|'''[\s\S]*?''')/g;
    while ((match = docstringPattern.exec(text)) !== null) {
      const start = doc.positionAt(baseOffset + match.index);
      const end = doc.positionAt(baseOffset + match.index + match[0].length);
      commentRanges.push(new vscode.Range(start, end));
    }
  }

  return commentRanges;
}

function isInsideComment(range, commentRanges) {
  return commentRanges.some(c => c.contains(range.start) || c.intersection(range));
}

/**
 * Subtracts active user selections from decoration ranges so that selecting
 * text visually shows the native editor selection highlight without being
 * obscured by decoration background badges.
 */
function subtractSelectionsFromRanges(ranges, selections) {
  const activeSelections = (selections || []).filter(s => s && !s.isEmpty);
  if (activeSelections.length === 0 || ranges.length === 0) {
    return ranges;
  }

  let current = ranges;

  for (const sel of activeSelections) {
    const next = [];
    for (const r of current) {
      const intersection = r.intersection(sel);
      if (!intersection || intersection.isEmpty) {
        next.push(r);
        continue;
      }

      // Case 1: Selection is strictly inside range -> split into two pieces (left & right)
      if (sel.start.isAfter(r.start) && sel.end.isBefore(r.end)) {
        next.push(new vscode.Range(r.start, sel.start));
        next.push(new vscode.Range(sel.end, r.end));
      }
      // Case 2: Selection starts before or at range start, and ends before range end -> keep remaining right piece
      else if (sel.start.isBeforeOrEqual(r.start) && sel.end.isBefore(r.end)) {
        next.push(new vscode.Range(sel.end, r.end));
      }
      // Case 3: Selection starts after range start, and ends at or after range end -> keep remaining left piece
      else if (sel.start.isAfter(r.start) && sel.end.isAfterOrEqual(r.end)) {
        next.push(new vscode.Range(r.start, sel.start));
      }
      // Case 4: Selection completely covers range -> omit
    }
    current = next;
  }

  return current;
}

function updateDecorations(editor) {
  if (!editor || !editor.document) return;

  const doc = editor.document;
  const langId = doc.languageId;
  const tabSize = Number(editor.options.tabSize) || 2;
  const cfg = vscode.workspace.getConfiguration('zerotosaas');

  const enableStatusBadges = cfg.get('statusBadges.enabled', true);
  const enableIndentShading = cfg.get('indentShading.enabled', true);
  const enableErrorLens = cfg.get('errorLens.enabled', true);
  const showSeverityBadge = cfg.get('errorLens.showSeverityBadge', true);
  const showGitBlame = cfg.get('errorLens.showGitBlame', true);

  const currentTheme = vscode.workspace.getConfiguration('workbench').get('colorTheme') || '';
  const palette = getThemePalette(currentTheme);

  // Compute active target chunks (Adaptive full-document or visible viewport + overscan buffer)
  const chunks = getTargetChunks(editor);
  if (chunks.length === 0) return;

  const safeRanges = [];
  const cautionRanges = [];
  const warningRanges = [];
  const panicRanges = [];
  const oddIndentRanges = [];
  const allCommentRanges = [];

  // =========================================================================
  // 1. ALTERNATING INDENT SHADING (Supports both Tabs and Spaces)
  // =========================================================================
  if (enableIndentShading) {
    for (const chunk of chunks) {
      for (let lineIdx = chunk.startLine; lineIdx <= chunk.endLine; lineIdx++) {
        const line = doc.lineAt(lineIdx);
        if (line.isEmptyOrWhitespace) continue;

        const leadingWsText = line.text.substring(0, line.firstNonWhitespaceCharacterIndex);
        let level = 0;
        let charIdx = 0;

        while (charIdx < leadingWsText.length) {
          const char = leadingWsText[charIdx];
          if (char === '\t') {
            if (level % 2 === 0) {
              oddIndentRanges.push(
                new vscode.Range(new vscode.Position(lineIdx, charIdx), new vscode.Position(lineIdx, charIdx + 1))
              );
            }
            level++;
            charIdx++;
          } else if (char === ' ') {
            const nextNonSpace = leadingWsText.slice(charIdx).search(/[^ ]/);
            const spaceCount = nextNonSpace === -1 ? leadingWsText.length - charIdx : nextNonSpace;
            const spacesForLevel = Math.min(spaceCount, tabSize > 0 ? tabSize : 2);
            if (level % 2 === 0) {
              oddIndentRanges.push(
                new vscode.Range(new vscode.Position(lineIdx, charIdx), new vscode.Position(lineIdx, charIdx + spacesForLevel))
              );
            }
            level++;
            charIdx += spacesForLevel;
          } else {
            charIdx++;
          }
        }
      }
    }
  }

  // =========================================================================
  // 2. STATUS TOKENS (Safe, Caution, Warning, Panic)
  // =========================================================================
  if (enableStatusBadges) {
    const isSourceCode = [
      'typescript', 'javascript', 'typescriptreact', 'javascriptreact',
      'python', 'rust', 'go', 'kotlin', 'swift', 'dart', 'sql', 'html'
    ].includes(langId) || /\.(ts|tsx|js|jsx|py|rs|go|kt|swift|dart|sql|html)$/i.test(doc.fileName);

    for (const chunk of chunks) {
      const text = chunk.text;
      const baseOffset = chunk.startOffset;
      let match;

      // Identify comment spans for this chunk
      const commentRanges = findCommentRanges(text, langId, doc, baseOffset);
      allCommentRanges.push(...commentRanges);

      // Collect Quoted Strings First
      const stringRanges = [];
      if (isSourceCode) {
        const stringPattern = /(["'`])(?:\\.|(?!\1)[^\\\r\n])*\1/g;
        while ((match = stringPattern.exec(text)) !== null) {
          const startPos = doc.positionAt(baseOffset + match.index);
          const endPos = doc.positionAt(baseOffset + match.index + match[0].length);
          const range = new vscode.Range(startPos, endPos);
          if (!isInsideComment(range, commentRanges)) {
            stringRanges.push(range);
          }
        }
      }

      // PANIC (🔴): UUIDs, Hex Codes, Secret Tokens, and True Regex Literals
      const uuidRegex = /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g;
      while ((match = uuidRegex.exec(text)) !== null) {
        const range = new vscode.Range(
          doc.positionAt(baseOffset + match.index),
          doc.positionAt(baseOffset + match.index + match[0].length)
        );
        if (!isInsideComment(range, commentRanges)) {
          panicRanges.push(range);
        }
      }

      const hexPattern = /(#[0-9a-fA-F]{3,8}\b|0x[0-9a-fA-F]+\b)/g;
      while ((match = hexPattern.exec(text)) !== null) {
        const range = new vscode.Range(
          doc.positionAt(baseOffset + match.index),
          doc.positionAt(baseOffset + match.index + match[0].length)
        );
        if (!isInsideComment(range, commentRanges)) {
          panicRanges.push(range);
        }
      }

      // Extended High-Entropy & Provider Secret Scanners (Human Firewall)
      const secretPatterns = [
        /\b((sk|pk)_live_[a-zA-Z0-9_]+|(postgres|postgresql|mongodb(\+srv)?|redis|amqp|mysql):\/\/[^\s"']+|SECRET[a-zA-Z0-9_]*\s*=\s*["'][^"']+["'])/gi,
        /\b(AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b/g,
        /\bgh[pousr]_[A-Za-z0-9_]{36,255}\b/g,
        /\bxox[baprs]-[0-9a-zA-Z-]{10,72}\b/g,
        /\beyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*\b/g,
        /\bAIza[0-9A-Za-z-_]{35}\b/g,
        /-----BEGIN (?:[A-Z0-9_-]+ )?PRIVATE KEY-----/g,
        /\bBearer\s+[a-zA-Z0-9_\-\.]{20,}\b/gi
      ];

      for (const pattern of secretPatterns) {
        while ((match = pattern.exec(text)) !== null) {
          const range = new vscode.Range(
            doc.positionAt(baseOffset + match.index),
            doc.positionAt(baseOffset + match.index + match[0].length)
          );
          if (!isInsideComment(range, commentRanges)) {
            panicRanges.push(range);
          }
        }
      }

      // True Regex Literals
      if (['javascript', 'typescript', 'javascriptreact', 'typescriptreact'].includes(langId)) {
        const jsRegexPattern = /(?:=|\(|\{|\[|:|,|&&|\|\||\?|!|\breturn\b|\bmatch\b|\btest\b|\bexec\b|\breplace\b|\bsearch\b)\s*(\/(?![*\/])(?:\\.|[^\\\/\r\n])+\/[gimsuy]*)/g;
        while ((match = jsRegexPattern.exec(text)) !== null) {
          const regexStr = match[1];
          const regexIndex = baseOffset + match.index + match[0].indexOf(regexStr);
          const range = new vscode.Range(doc.positionAt(regexIndex), doc.positionAt(regexIndex + regexStr.length));
          if (!isInsideComment(range, commentRanges) && !stringRanges.some(s => s.contains(range.start))) {
            panicRanges.push(range);
          }
        }
      } else if (langId === 'python') {
        const pyRegexPattern = /re\.compile\([^\)]+\)/g;
        while ((match = pyRegexPattern.exec(text)) !== null) {
          const range = new vscode.Range(
            doc.positionAt(baseOffset + match.index),
            doc.positionAt(baseOffset + match.index + match[0].length)
          );
          if (!isInsideComment(range, commentRanges)) {
            panicRanges.push(range);
          }
        }
      }

      // WARNING (🟠): Non-secret hardcoded strings
      for (const strRange of stringRanges) {
        const isAlreadyPanic = panicRanges.some(p => p.intersection(strRange));
        if (!isAlreadyPanic) {
          warningRanges.push(strRange);
        }
      }

      // CAUTION (🟡) & PANIC (🔴): Environment Files
      if (langId === 'dotenv' || /\.env(\.[a-zA-Z0-9_-]+)?$/i.test(doc.fileName)) {
        const envKeyPattern = /^[A-Z0-9_]+(?=\s*=)/gm;
        while ((match = envKeyPattern.exec(text)) !== null) {
          const keyName = match[0];
          const range = new vscode.Range(
            doc.positionAt(baseOffset + match.index),
            doc.positionAt(baseOffset + match.index + keyName.length)
          );
          if (!isInsideComment(range, commentRanges)) {
            if (/(SECRET|TOKEN|KEY|AUTH|PASSWORD|PASSWD|PASS|PRIVATE|DATABASE|CREDENTIAL|APIKEY|API_KEY|CERT|SALT|PASSPHRASE)/i.test(keyName)) {
              panicRanges.push(range);
            } else {
              cautionRanges.push(range);
            }
          }
        }

        const envSecretValuePattern = /^[A-Z0-9_]*(SECRET|TOKEN|KEY|AUTH|PASSWORD|PASSWD|PASS|PRIVATE|DATABASE|CREDENTIAL|APIKEY|API_KEY|CERT|SALT|PASSPHRASE)[A-Z0-9_]*\s*=\s*(.+)$/gim;
        while ((match = envSecretValuePattern.exec(text)) !== null) {
          const valueStr = match[2].trim();
          const valueIndex = baseOffset + match.index + match[0].indexOf(valueStr);
          const range = new vscode.Range(doc.positionAt(valueIndex), doc.positionAt(valueIndex + valueStr.length));
          if (!isInsideComment(range, commentRanges) && !panicRanges.some(p => p.contains(range.start))) {
            panicRanges.push(range);
          }
        }
      }

      // CONFIG FILES: Sensitive Key Highlighting
      if (['toml', 'yaml', 'json', 'ini'].includes(langId) || /\.(toml|yaml|yml|json|ini)$/i.test(doc.fileName)) {
        const sensitiveConfigKeyPattern = /^[ \t]*([a-zA-Z0-9_-]*(SECRET|TOKEN|KEY|AUTH|PASSWORD|PASSWD|PASS|PRIVATE|DATABASE|CREDENTIAL|APIKEY|API_KEY|CERT|SALT|PASSPHRASE)[a-zA-Z0-9_-]*)(?=\s*[:=])/gim;
        while ((match = sensitiveConfigKeyPattern.exec(text)) !== null) {
          const keyName = match[1];
          const keyIndex = baseOffset + match.index + match[0].indexOf(keyName);
          const range = new vscode.Range(doc.positionAt(keyIndex), doc.positionAt(keyIndex + keyName.length));
          if (!isInsideComment(range, commentRanges) && !panicRanges.some(p => p.contains(range.start))) {
            panicRanges.push(range);
          }
        }
      }

      // Function parameters
      if (['typescript', 'typescriptreact', 'javascript', 'javascriptreact'].includes(langId)) {
        const paramPattern = /(?<=\()([a-zA-Z0-9_]+)(?=\s*:\s*[a-zA-Z0-9_<>]+|\s*,\s*|\s*\))/g;
        while ((match = paramPattern.exec(text)) !== null) {
          const range = new vscode.Range(
            doc.positionAt(baseOffset + match.index),
            doc.positionAt(baseOffset + match.index + match[0].length)
          );
          if (!isInsideComment(range, commentRanges)) {
            cautionRanges.push(range);
          }
        }
      }

      // LOG FILES (.log)
      if (langId === 'log' || doc.fileName.endsWith('.log')) {
        const logPanicPattern = /\b(FATAL|CRITICAL|EMERGENCY|ERROR|EXCEPTION)\b/g;
        while ((match = logPanicPattern.exec(text)) !== null) {
          panicRanges.push(new vscode.Range(
            doc.positionAt(baseOffset + match.index),
            doc.positionAt(baseOffset + match.index + match[0].length)
          ));
        }

        const logWarnPattern = /\b(WARN|WARNING)\b/g;
        while ((match = logWarnPattern.exec(text)) !== null) {
          warningRanges.push(new vscode.Range(
            doc.positionAt(baseOffset + match.index),
            doc.positionAt(baseOffset + match.index + match[0].length)
          ));
        }

        const logSafePattern = /\b(INFO|SUCCESS|OK|PASSED)\b/g;
        while ((match = logSafePattern.exec(text)) !== null) {
          safeRanges.push(new vscode.Range(
            doc.positionAt(baseOffset + match.index),
            doc.positionAt(baseOffset + match.index + match[0].length)
          ));
        }

        const logCautionPattern = /\b(DEBUG|TRACE|NOTICE)\b/g;
        while ((match = logCautionPattern.exec(text)) !== null) {
          cautionRanges.push(new vscode.Range(
            doc.positionAt(baseOffset + match.index),
            doc.positionAt(baseOffset + match.index + match[0].length)
          ));
        }
      }

      // SAFE (🟢): Types, Interfaces, Structs & Markdown Code Blocks
      if (['typescript', 'typescriptreact'].includes(langId)) {
        const typeDefPattern = /\b(interface|type|class|enum)\s+([A-Za-z0-9_]+)/g;
        while ((match = typeDefPattern.exec(text)) !== null) {
          const typeName = match[2];
          const nameIndex = baseOffset + match.index + match[0].indexOf(typeName);
          const range = new vscode.Range(doc.positionAt(nameIndex), doc.positionAt(nameIndex + typeName.length));
          if (!isInsideComment(range, commentRanges)) {
            safeRanges.push(range);
          }
        }
      } else if (langId === 'python') {
        const classDefPattern = /\bclass\s+([A-Za-z0-9_]+)/g;
        while ((match = classDefPattern.exec(text)) !== null) {
          const className = match[1];
          const nameIndex = baseOffset + match.index + match[0].indexOf(className);
          const range = new vscode.Range(doc.positionAt(nameIndex), doc.positionAt(nameIndex + className.length));
          if (!isInsideComment(range, commentRanges)) {
            safeRanges.push(range);
          }
        }
      } else if (langId === 'markdown') {
        const inlineCodePattern = /(?<!`)`([^`\r\n]+)`(?!`)/g;
        while ((match = inlineCodePattern.exec(text)) !== null) {
          safeRanges.push(new vscode.Range(
            doc.positionAt(baseOffset + match.index),
            doc.positionAt(baseOffset + match.index + match[0].length)
          ));
        }
      }
    }
  }

  // Subtract active selections from decorated ranges so selection is 100% visible
  const selections = editor.selections || (editor.selection ? [editor.selection] : []);
  const renderedOddIndentRanges = subtractSelectionsFromRanges(oddIndentRanges, selections);
  const renderedSafeRanges = subtractSelectionsFromRanges(safeRanges, selections);
  const renderedCautionRanges = subtractSelectionsFromRanges(cautionRanges, selections);
  const renderedWarningRanges = subtractSelectionsFromRanges(warningRanges, selections);
  const renderedPanicRanges = subtractSelectionsFromRanges(panicRanges, selections);

  // Apply Odd-Sequence Indent Column Shading
  editor.setDecorations(oddIndentDecorationType, renderedOddIndentRanges);

  // Apply Status Token Decorations
  editor.setDecorations(safeDecorationType, renderedSafeRanges);
  editor.setDecorations(cautionDecorationType, renderedCautionRanges);
  editor.setDecorations(warningDecorationType, renderedWarningRanges);
  editor.setDecorations(panicDecorationType, renderedPanicRanges);

  // Apply Universal Italic Comment Styling
  editor.setDecorations(commentDecorationType, allCommentRanges);

  // =========================================================================
  // 3. INLINE DIAGNOSTIC LENS (ERROR LENS + GIT BLAME)
  // =========================================================================
  if (enableErrorLens) {
    updateErrorLens(editor, palette, showSeverityBadge, showGitBlame, chunks);
  } else {
    editor.setDecorations(errorLensDecorationType, []);
    editor.setDecorations(warningLensDecorationType, []);
    editor.setDecorations(infoLensDecorationType, []);
    editor.setDecorations(hintLensDecorationType, []);
  }
}

function updateErrorLens(editor, palette, showSeverityBadge, showGitBlame, chunks) {
  if (!editor || !editor.document) return;

  const doc = editor.document;
  const filePath = doc.uri.fsPath;
  const docVersion = doc.version;
  const diagnostics = vscode.languages.getDiagnostics(doc.uri);
  const errorOptions = [];
  const warningOptions = [];
  const infoOptions = [];
  const hintOptions = [];

  // Group by line to display the most critical diagnostic per line
  const diagnosticsByLine = new Map();

  for (const diag of diagnostics) {
    const line = diag.range.start.line;
    // If we have active chunks (for large files), only process diagnostics within the chunk bounds
    if (chunks && doc.lineCount > FULL_DOC_LINE_THRESHOLD) {
      const isWithinChunk = chunks.some(c => line >= c.startLine && line <= c.endLine);
      if (!isWithinChunk) continue;
    }

    const existing = diagnosticsByLine.get(line);
    if (!existing || diag.severity < existing.severity) {
      diagnosticsByLine.set(line, diag);
    }
  }

  for (const [lineIdx, diag] of diagnosticsByLine) {
    const lineEndPos = doc.lineAt(lineIdx).range.end;
    const lineEndRange = new vscode.Range(lineEndPos, lineEndPos);

    // Format inline message
    let badge = '';
    let fg = palette.info.fg;
    let bg = palette.info.bg;
    let targetOptions = infoOptions;

    switch (diag.severity) {
      case vscode.DiagnosticSeverity.Error:
        badge = showSeverityBadge ? '🔴 [Error] ' : '🔴 ';
        fg = palette.panic.fg;
        bg = palette.panic.bg;
        targetOptions = errorOptions;
        break;
      case vscode.DiagnosticSeverity.Warning:
        badge = showSeverityBadge ? '🟠 [Warning] ' : '🟠 ';
        fg = palette.warning.fg;
        bg = palette.warning.bg;
        targetOptions = warningOptions;
        break;
      case vscode.DiagnosticSeverity.Information:
        badge = showSeverityBadge ? '🔵 [Info] ' : '🔵 ';
        fg = palette.info.fg;
        bg = palette.info.bg;
        targetOptions = infoOptions;
        break;
      case vscode.DiagnosticSeverity.Hint:
        badge = showSeverityBadge ? '💡 [Hint] ' : '💡 ';
        fg = '#505A69';
        bg = '#F6F8FB';
        targetOptions = hintOptions;
        break;
    }

    const cleanMessage = diag.message.replace(/[\r\n]+/g, ' ');
    const sourceTag = diag.source ? ` (${diag.source})` : '';

    // Check Git Blame for this line if enabled
    let gitBlameSuffix = '';
    if (showGitBlame && filePath && !doc.isUntitled && doc.uri && doc.uri.scheme === 'file') {
      const lineOneIndexed = lineIdx + 1;
      const blame = fetchGitBlameForLine(filePath, lineOneIndexed, docVersion, () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (
          activeEditor &&
          activeEditor.document.uri.toString() === doc.uri.toString() &&
          activeEditor.document.version === docVersion
        ) {
          updateErrorLens(activeEditor, palette, showSeverityBadge, showGitBlame, chunks);
        }
      });

      if (blame) {
        gitBlameSuffix = `  •  👤 ${blame}`;
      }
    }

    targetOptions.push({
      range: lineEndRange,
      renderOptions: {
        after: {
          contentText: `   ${badge}${cleanMessage}${sourceTag}${gitBlameSuffix}`,
          color: fg,
          backgroundColor: bg,
          fontWeight: 'normal',
          fontStyle: 'italic',
          fontSize: '0.9em',
          margin: '0 0 0 1.5rem',
          border: `1px solid ${fg}33`,
          borderRadius: '3px'
        }
      }
    });
  }

  editor.setDecorations(errorLensDecorationType, errorOptions);
  editor.setDecorations(warningLensDecorationType, warningOptions);
  editor.setDecorations(infoLensDecorationType, infoOptions);
  editor.setDecorations(hintLensDecorationType, hintOptions);
}

// Ocular Rest Assistant (20-20-20 rule + blink reminder)
let restStatusBar = null;
let restTickInterval = null;
let restNextBreakAt = 0;
let restBreakUntil = 0;

function disposeRestAssistant() {
  if (restTickInterval) {
    clearInterval(restTickInterval);
    restTickInterval = null;
  }
  if (restStatusBar) {
    restStatusBar.dispose();
    restStatusBar = null;
  }
  restNextBreakAt = 0;
  restBreakUntil = 0;
}

function beginRestBreak(intervalMs, breakDurationMs) {
  restBreakUntil = Date.now() + breakDurationMs;
  if (restStatusBar) {
    restStatusBar.text = '$(eye) break';
    restStatusBar.tooltip = '20-20-20 eye break in progress';
  }
  const breakSeconds = Math.round(breakDurationMs / 1000);
  vscode.window.showInformationMessage(
    `20-20-20 Ergonomic Break: take a ${breakSeconds}-second break to look at an object 20 feet away and blink consciously to re-lubricate your eyes.`
  );
}

function updateRestStatusText() {
  if (!restStatusBar) return;
  const now = Date.now();
  if (restBreakUntil > 0) {
    const remaining = Math.max(0, Math.ceil((restBreakUntil - now) / 1000));
    restStatusBar.text = `$(eye) ${remaining}s break`;
    restStatusBar.tooltip = `${remaining}s of 20-20-20 eye break remaining`;
    return;
  }
  const remainingSec = Math.max(0, Math.ceil((restNextBreakAt - now) / 1000));
  const min = Math.floor(remainingSec / 60);
  const sec = remainingSec % 60;
  restStatusBar.text = `$(eye) ${min}m ${sec}s`;
  restStatusBar.tooltip = `Next 20-20-20 eye break in ${min}m ${sec}s — look 20ft away for 20s`;
}

function initRestAssistant() {
  const cfg = vscode.workspace.getConfiguration('zerotosaas.restReminder');
  const enabled = cfg.get('enabled', false);
  disposeRestAssistant();
  if (!enabled) return;

  const intervalMinutes = Math.max(1, Number(cfg.get('intervalMinutes', 20)) || 20);
  const breakSeconds = Math.max(5, Number(cfg.get('breakDurationSeconds', 20)) || 20);
  const intervalMs = intervalMinutes * 60 * 1000;
  const breakDurationMs = breakSeconds * 1000;

  restStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  restStatusBar.command = 'zerotosaas.resetRestTimer';
  restStatusBar.tooltip = 'ZeroToSaaS 20-20-20 Ocular Rest Assistant';
  restStatusBar.show();

  restNextBreakAt = Date.now() + intervalMs;

  restTickInterval = setInterval(() => {
    const now = Date.now();
    if (restBreakUntil > 0) {
      if (now >= restBreakUntil) {
        restBreakUntil = 0;
        restNextBreakAt = now + intervalMs;
      }
      updateRestStatusText();
      return;
    }
    if (now >= restNextBreakAt) {
      beginRestBreak(intervalMs, breakDurationMs);
    }
    updateRestStatusText();
  }, 1000);

  updateRestStatusText();
}

async function handleThemeSelection() {
  const lightThemes = [
    { label: 'ZeroToSaaS Light (Default)', description: 'Cobalt-slate, balanced luminance, 100% WCAG AAA' },
    { label: 'ZeroToSaaS High Contrast (ISO 9241-303)', description: 'Ultra-clear 12+:1 contrast ratios, sharp borders' },
    { label: 'ZeroToSaaS Deuteranopia (Blue / Orange)', description: 'Red-green colorblind safe (Deutan)' },
    { label: 'ZeroToSaaS Protanopia (Magenta / Teal)', description: 'Red-green colorblind safe (Protan)' },
    { label: 'ZeroToSaaS Tritanopia (Crimson / Cyan)', description: 'Blue-yellow colorblind safe (Tritan)' },
    { label: 'ZeroToSaaS Warm Sepia (Brown)', description: 'Warm paper tint, reduced blue-light eye strain' },
    { label: 'ZeroToSaaS Forest Calm (Green)', description: 'Natural moss & sage tones for calm extended coding' },
    { label: 'ZeroToSaaS Royal Plum (Purple)', description: 'Deep chromatic amethyst tones' },
    { label: 'ZeroToSaaS Golden Sand (Yellow)', description: 'Soft amber & sandstone warm palette' },
    { label: 'ZeroToSaaS Terracotta (Orange)', description: 'Earthy clay & rust energetic palette' }
  ];

  const nightThemes = [
    { label: 'ZeroToSaaS Light Night (Default)', description: 'Dark cobalt-slate, 100% WCAG AAA, glare-free' },
    { label: 'ZeroToSaaS High Contrast Night (ISO 9241-303)', description: 'Dark ultra-clear contrast, sharp white borders' },
    { label: 'ZeroToSaaS Deuteranopia Night (Blue / Orange)', description: 'Dark red-green colorblind safe (Deutan)' },
    { label: 'ZeroToSaaS Protanopia Night (Magenta / Teal)', description: 'Dark red-green colorblind safe (Protan)' },
    { label: 'ZeroToSaaS Tritanopia Night (Crimson / Cyan)', description: 'Dark blue-yellow colorblind safe (Tritan)' },
    { label: 'ZeroToSaaS Warm Sepia Night (Brown)', description: 'Dark warm espresso & walnut tones' },
    { label: 'ZeroToSaaS Forest Calm Night (Green)', description: 'Dark cypress & cedar tones for night coding' },
    { label: 'ZeroToSaaS Royal Plum Night (Purple)', description: 'Dark iris & midnight-plum tones' },
    { label: 'ZeroToSaaS Golden Sand Night (Yellow)', description: 'Dark amber bronze & sandstone' },
    { label: 'ZeroToSaaS Terracotta Night (Orange)', description: 'Dark burnt orange & rich bronze' }
  ];

  const nightLabels = new Set(nightThemes.map(t => t.label));

  const items = [
    { label: 'Light Themes', kind: vscode.QuickPickItemKind.Separator },
    ...lightThemes,
    { label: 'Night Themes', kind: vscode.QuickPickItemKind.Separator },
    ...nightThemes
  ];

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a ZeroToSaaS theme variant to apply'
  });

  if (selected && !selected.kind) {
    const isNight = nightLabels.has(selected.label);

    if (isNight) {
      // F9 de-nag: two-sentence advisory + persistent suppression. The full
      // medical rationale (astigmatic halation, myopia progression, CVS) lives
      // in docs/Guidelines.md — surfaced via the "Read Guidelines" button so the
      // picker stays calm and the health message never becomes banner noise.
      if (darkAdvisorySuppressed()) {
        // Suppressed permanently by user — apply silently.
      } else {
        const proceed = await vscode.window.showWarningMessage(
          `⚠️ "${selected.label}" is a dark theme. Prolonged dark-theme use can ` +
          `increase ocular accommodation effort and astigmatic halation, ` +
          `contributing to digital eye strain. Prefer light themes for daytime ` +
          `extended coding, and use dark themes in dim ambient lighting. ` +
          `See docs/Guidelines.md for the full medical rationale.`,
          { modal: false },
          'Apply Anyway',
          'Apply and stop advising',
          'Read Guidelines',
          'Pick a Light Theme Instead'
        );

        if (proceed === 'Pick a Light Theme Instead') {
          return handleThemeSelection();
        }
        if (proceed === 'Read Guidelines') {
          openGuidelinesDoc();
          return; // user can re-pick after reading
        }
        if (proceed === 'Apply and stop advising') {
          await setDarkAdvisorySuppressed(true);
          // fall through and apply
        } else if (proceed !== 'Apply Anyway') {
          return; // dismissed — abort theme switch
        }
      }
    }

    themeChangeByExtension = true;
    await vscode.workspace.getConfiguration('workbench').update(
      'colorTheme',
      selected.label,
      vscode.ConfigurationTarget.Global
    );
    themeChangeByExtension = false;
    vscode.window.showInformationMessage(`ZeroToSaaS Theme set to: ${selected.label}`);
  }
}

// --- Day / Night Auto-Switcher ---

let autoSwitchTimer = null;

// Tracks whether the current theme change was initiated by this extension
// (QuickPick or auto-switcher). Used to suppress the dark-theme eye health
// warning for extension-initiated changes that already showed a warning,
// and to show it for externally-initiated dark theme activations (e.g. via
// VS Code's native Ctrl+K Ctrl+T theme picker).
let themeChangeByExtension = false;

function getCurrentThemeLabel(cfg) {
  return vscode.workspace.getConfiguration('workbench').get('colorTheme') || '';
}

// --- Dark-theme eye-health advisory dedupe (Phase 0 / F9) ---
// Fires at most once per theme-label per calendar day, plus a persistent
// "Don't remind me again" suppression via zerotosaas.wellness.darkAdvisory.suppressed.
// Repetition converts a health message into noise; noise trains users to dismiss
// health UI — the opposite of the mission.
const DARK_ADVISORY_KEY_PREFIX = 'z2s.advisory.dark.';

function todayDateKey() {
  // Local date (not UTC) so the once-per-day boundary matches the user's day.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function darkAdvisorySuppressed() {
  return vscode.workspace
    .getConfiguration('zerotosaas.wellness.darkAdvisory')
    .get('suppressed', false);
}

async function setDarkAdvisorySuppressed(value) {
  await vscode.workspace
    .getConfiguration('zerotosaas.wellness.darkAdvisory')
    .update('suppressed', value, vscode.ConfigurationTarget.Global);
}

function darkAdvisoryAlreadyShownToday(context, themeLabel) {
  if (!context || !context.globalState) return false;
  const key = DARK_ADVISORY_KEY_PREFIX + (themeLabel || '') + '.' + todayDateKey();
  return context.globalState.get(key, false) === true;
}

async function markDarkAdvisoryShownToday(context, themeLabel) {
  if (!context || !context.globalState) return;
  const key = DARK_ADVISORY_KEY_PREFIX + (themeLabel || '') + '.' + todayDateKey();
  await context.globalState.update(key, true);
}

// Opens docs/Guidelines.md (full medical rationale) in the Markdown preview.
function openGuidelinesDoc() {
  const fs = require('fs');
  // Resolve relative to the extension root (extension.js lives in src/).
  const candidates = [
    path.join(__dirname, '..', 'docs', 'Guidelines.md'),
    path.join(__dirname, 'docs', 'Guidelines.md')
  ];
  const docPath = candidates.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
  if (!docPath) {
    vscode.window.showErrorMessage('Could not locate docs/Guidelines.md in the extension bundle.');
    return;
  }
  vscode.commands.executeCommand('markdown.showPreview', vscode.Uri.file(docPath));
}

function evaluateAutoSwitch() {
  const cfg = vscode.workspace.getConfiguration('zerotosaas.autoSwitch');
  if (!cfg.get('enabled', false)) return;

  const dayTheme = cfg.get('dayTheme', 'ZeroToSaaS Light (Default)');
  const nightTheme = cfg.get('nightTheme', 'ZeroToSaaS Light Night (Default)');
  const dayStart = cfg.get('dayStartHour', 7);
  const nightStart = cfg.get('nightStartHour', 18);

  const hour = new Date().getHours();
  const isDay = hour >= dayStart && hour < nightStart;
  const target = isDay ? dayTheme : nightTheme;
  const current = getCurrentThemeLabel();

  if (target !== current) {
    themeChangeByExtension = true;
    vscode.workspace.getConfiguration('workbench').update(
      'colorTheme',
      target,
      vscode.ConfigurationTarget.Global
    );
    themeChangeByExtension = false;
  }
}

function initAutoSwitch(context) {
  if (autoSwitchTimer) {
    clearInterval(autoSwitchTimer);
    autoSwitchTimer = null;
  }
  const cfg = vscode.workspace.getConfiguration('zerotosaas.autoSwitch');
  if (!cfg.get('enabled', false)) return;

  evaluateAutoSwitch();
  // Check every 5 minutes — catches hour transitions without excessive polling.
  autoSwitchTimer = setInterval(evaluateAutoSwitch, 5 * 60 * 1000);
  if (context && context.subscriptions) {
    context.subscriptions.push({ dispose: () => {
      if (autoSwitchTimer) { clearInterval(autoSwitchTimer); autoSwitchTimer = null; }
    }});
  }
}

function activate(context) {
  initDecorations(context);

  initRestAssistant();

  context.subscriptions.push(
    vscode.commands.registerCommand('zerotosaas.selectTheme', handleThemeSelection),
    vscode.commands.registerCommand('zerotosaas.switchTheme', handleThemeSelection),
    vscode.commands.registerCommand('zerotosaas.toggleErrorLens', async () => {
      const cfg = vscode.workspace.getConfiguration('zerotosaas');
      const current = cfg.get('errorLens.enabled', true);
      await cfg.update('errorLens.enabled', !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`ZeroToSaaS Error Lens ${!current ? 'enabled' : 'disabled'}.`);
    }),
    vscode.commands.registerCommand('zerotosaas.toggleStatusBadges', async () => {
      const cfg = vscode.workspace.getConfiguration('zerotosaas');
      const current = cfg.get('statusBadges.enabled', true);
      await cfg.update('statusBadges.enabled', !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`ZeroToSaaS Semantic Status Badges ${!current ? 'enabled' : 'disabled'}.`);
    }),
    vscode.commands.registerCommand('zerotosaas.toggleIndentShading', async () => {
      const cfg = vscode.workspace.getConfiguration('zerotosaas');
      const current = cfg.get('indentShading.enabled', true);
      await cfg.update('indentShading.enabled', !current, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(`ZeroToSaaS Indent Column Shading ${!current ? 'enabled' : 'disabled'}.`);
    }),
    vscode.commands.registerCommand('zerotosaas.resetRestTimer', () => {
      const cfg = vscode.workspace.getConfiguration('zerotosaas.restReminder');
      if (cfg.get('enabled', false)) {
        initRestAssistant();
        vscode.window.showInformationMessage('20-20-20 rest timer reset.');
      }
    }),
    vscode.commands.registerCommand('zerotosaas.toggleRestReminder', async () => {
      const cfg = vscode.workspace.getConfiguration('zerotosaas.restReminder');
      const next = !cfg.get('enabled', false);
      await cfg.update('enabled', next, vscode.ConfigurationTarget.Global);
      initRestAssistant();
      vscode.window.showInformationMessage(
        `20-20-20 rest reminders ${next ? 'enabled' : 'disabled'}.`
      );
    }),
    vscode.commands.registerCommand('zerotosaas.openSettings', () => {
      vscode.commands.executeCommand('workbench.action.openSettings', '@ext:zerotosaas-in.zerotosaas-theme');
    }),
    vscode.commands.registerCommand('zerotosaas.openGuidelines', () => {
      openGuidelinesDoc();
    }),
    vscode.commands.registerCommand('zerotosaas.toggleAutoSwitch', async () => {
      const cfg = vscode.workspace.getConfiguration('zerotosaas.autoSwitch');
      const next = !cfg.get('enabled', false);
      await cfg.update('enabled', next, vscode.ConfigurationTarget.Global);
      initAutoSwitch(context);
      vscode.window.showInformationMessage(
        `ZeroToSaaS Day/Night Auto-Switch ${next ? 'enabled' : 'disabled'}.`
      );
    })
  );

  initAutoSwitch(context);

  if (vscode.window.onDidChangeActiveColorTheme) {
    vscode.window.onDidChangeActiveColorTheme((newTheme) => {
      initDecorations(context);
      if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
      }

      // Warn about dark theme eye health effects when a dark theme is activated
      // externally (e.g. via VS Code's native Ctrl+K Ctrl+T picker). Extension-
      // initiated changes (QuickPick / auto-switcher) are suppressed — the
      // QuickPick already shows an advisory; the auto-switcher is opt-in.
      //
      // F9 de-nag: at most once per theme-label per calendar day, plus a
      // persistent "Don't remind me again" suppression. Repetition on every
      // native theme toggle (H1) trains users to dismiss health UI.
      if (!themeChangeByExtension && newTheme && newTheme.kind) {
        const isDark = newTheme.kind === vscode.ColorThemeKind.Dark ||
          newTheme.kind === vscode.ColorThemeKind.HighContrastDark;
        if (isDark) {
          const themeName = vscode.workspace.getConfiguration('workbench').get('colorTheme') || 'the selected dark theme';
          const alreadyShownToday = darkAdvisoryAlreadyShownToday(context, themeName);
          const suppressed = darkAdvisorySuppressed();
          if (!suppressed && !alreadyShownToday) {
            vscode.window.showWarningMessage(
              `⚠️ "${themeName}" is a dark theme. Prolonged dark-theme use can ` +
              `increase ocular accommodation effort and worsen halation for users ` +
              `with astigmatism, contributing to digital eye strain. Prefer light ` +
              `themes for daytime extended coding. See docs/Guidelines.md for details.`,
              'Switch to Light Theme',
              "Don't remind me again",
              'Dismiss'
            ).then(async (action) => {
              // Record today's showing regardless of choice so the per-day cap holds.
              await markDarkAdvisoryShownToday(context, themeName);
              if (action === 'Switch to Light Theme') {
                vscode.commands.executeCommand('zerotosaas.selectTheme');
              } else if (action === "Don't remind me again") {
                await setDarkAdvisorySuppressed(true);
                vscode.window.showInformationMessage(
                  'Dark-theme eye-health advisories turned off. Re-enable from ' +
                  'Settings: zerotosaas.wellness.darkAdvisory.suppressed.'
                );
              }
            });
          }
        }
      }
    }, null, context.subscriptions);
  }

  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) updateDecorations(editor);
  }, null, context.subscriptions);

  vscode.window.onDidChangeTextEditorVisibleRanges(event => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && event.textEditor === activeEditor) {
      if (activeEditor.document.lineCount > FULL_DOC_LINE_THRESHOLD) {
        if (scrollThrottleTimer) return;
        scrollThrottleTimer = setTimeout(() => {
          scrollThrottleTimer = null;
          updateDecorations(activeEditor);
        }, 30);
      }
    }
  }, null, context.subscriptions);

  vscode.window.onDidChangeTextEditorSelection(event => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && event.textEditor === activeEditor) {
      scheduleSelectionUpdate(activeEditor, 50);
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeTextDocument(event => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && event.document === activeEditor.document) {
      scheduleDocumentUpdate(activeEditor, 180);
    }
  }, null, context.subscriptions);

  vscode.languages.onDidChangeDiagnostics(event => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && event.uris.some(u => u.toString() === activeEditor.document.uri.toString())) {
      scheduleDocumentUpdate(activeEditor, 100);
    }
  }, null, context.subscriptions);

  vscode.workspace.onDidChangeConfiguration(event => {
    if (
      event.affectsConfiguration('workbench.colorTheme') ||
      event.affectsConfiguration('editor.tabSize') ||
      event.affectsConfiguration('zerotosaas')
    ) {
      initDecorations(context);
      initRestAssistant();
      if (vscode.window.activeTextEditor) {
        updateDecorations(vscode.window.activeTextEditor);
      }
    }
    if (event.affectsConfiguration('zerotosaas.autoSwitch')) {
      initAutoSwitch(context);
    }
  }, null, context.subscriptions);

  if (vscode.window.activeTextEditor) {
    updateDecorations(vscode.window.activeTextEditor);
  }
}

function deactivate() {
  disposeRestAssistant();
  if (documentChangeDebounceTimer) {
    clearTimeout(documentChangeDebounceTimer);
    documentChangeDebounceTimer = null;
  }
  if (selectionChangeDebounceTimer) {
    clearTimeout(selectionChangeDebounceTimer);
    selectionChangeDebounceTimer = null;
  }
  if (scrollThrottleTimer) {
    clearTimeout(scrollThrottleTimer);
    scrollThrottleTimer = null;
  }
  disposeDecorations();
  gitBlameCache.clear();
}

module.exports = {
  activate,
  deactivate
};
