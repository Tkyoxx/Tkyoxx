import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const metrics = JSON.parse(fs.readFileSync(path.join(here, 'fonts/metrics.json'), 'utf8'));
export const icons = JSON.parse(fs.readFileSync(path.join(here, 'icons.json'), 'utf8'));

export const C = {
  bg: '#060A16',
  card: '#081024',
  panel: '#0F1730',
  line: '#1A2547',
  line2: '#26335E',
  red: '#E4002B',
  orange: '#FFC906',
  yellow: '#FFC906',
  blue: '#3671C6',
  navy: '#1B2A5C',
  text: '#F3F5FA',
  sub: '#AEB6CC',
  dim: '#6E7899',
  purple: '#B54CFF',
  green: '#22D46B',
  hand: '#FFD43B',
};

const FONTS = {
  display: { family: 'TkDisplay', file: 'display.woff', fallback: "'Arial Black', Impact, sans-serif" },
  semi: { family: 'TkSemi', file: 'sans-semi.woff', fallback: "'Segoe UI', Helvetica, Arial, sans-serif" },
  sans: { family: 'TkSans', file: 'sans.woff', fallback: "'Segoe UI', Helvetica, Arial, sans-serif" },
  mono: { family: 'TkMono', file: 'mono.woff', fallback: "Consolas, 'Courier New', monospace" },
  monob: { family: 'TkMonoB', file: 'mono-bold.woff', fallback: "Consolas, 'Courier New', monospace" },
  hand: { family: 'TkHand', file: 'hand.woff', fallback: "'Segoe Print', 'Comic Sans MS', cursive" },
};
const METRIC_KEY = { display: 'display', semi: 'sans-semi', sans: 'sans', mono: 'mono', monob: 'mono-bold', hand: 'hand' };
const fontCache = {};

let python;
function findPython() {
  if (python !== undefined) return python;
  python =
    ['python3', 'python'].find((bin) => {
      try {
        execFileSync(bin, ['-c', 'import fontTools'], { stdio: 'ignore' });
        return true;
      } catch {
        return false;
      }
    }) ?? null;
  return python;
}

function subsetFont(file, chars) {
  const src = path.join(here, 'fonts', file);
  if (!findPython()) return fs.readFileSync(src);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tk-'));
  const txt = path.join(tmp, 'chars.txt');
  const out = path.join(tmp, 'out.woff');
  fs.writeFileSync(txt, chars + ' ', 'utf8');
  execFileSync(
    python,
    ['-m', 'fontTools.subset', src, `--text-file=${txt}`, `--output-file=${out}`, '--flavor=woff', '--layout-features=kern,liga,calt', '--no-hinting', '--desubroutinize'],
    { stdio: 'ignore' },
  );
  const buf = fs.readFileSync(out);
  fs.rmSync(tmp, { recursive: true, force: true });
  return buf;
}

function fontFace(name, chars) {
  const f = FONTS[name];
  const key = `${name}|${chars}`;
  fontCache[key] ??= subsetFont(f.file, chars).toString('base64');
  return `@font-face{font-family:'${f.family}';src:url(data:font/woff;base64,${fontCache[key]}) format('woff');}`;
}

function usedChars(markup) {
  const set = new Set();
  for (const m of markup.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)) {
    const plain = m[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    for (const ch of plain) set.add(ch);
  }
  return [...set].sort().join('');
}

export function measure(text, font, size, letterSpacing = 0) {
  const m = metrics[METRIC_KEY[font]];
  let w = 0;
  for (const ch of text) w += m.adv[ch] ?? m.upm * 0.6;
  return (w / m.upm) * size + letterSpacing * [...text].length;
}

export function fit(text, font, size, max, letterSpacing = 0) {
  while (size > 8 && measure(text, font, size, letterSpacing) > max) size -= 0.5;
  return size;
}

export function wrap(text, font, size, maxW) {
  const out = [];
  let line = '';
  for (const w of text.split(' ')) {
    const next = line ? `${line} ${w}` : w;
    if (line && measure(next, font, size) > maxW) {
      out.push(line);
      line = w;
    } else line = next;
  }
  if (line) out.push(line);
  return out;
}

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const r = (n) => Math.round(n * 100) / 100;

export function t(x, y, text, { font = 'sans', size = 16, fill = C.text, ls = 0, anchor, cls, extra = '' } = {}) {
  const a = [`x="${r(x)}"`, `y="${r(y)}"`, `class="${font}${cls ? ' ' + cls : ''}"`, `font-size="${size}"`, `fill="${fill}"`];
  if (ls) a.push(`letter-spacing="${ls}"`);
  if (anchor) a.push(`text-anchor="${anchor}"`);
  return `<text ${a.join(' ')} ${extra}>${text}</text>`;
}

export function doc({ w, h, title, fonts = [], css = '', defs = '', body }) {
  const chars = usedChars(defs + body);
  const faces = fonts.map((k) => fontFace(k, chars)).join('');
  const families = fonts.map((k) => `.${k}{font-family:'${FONTS[k].family}',${FONTS[k].fallback};}`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>${faces}${families}
text{font-kerning:normal;}
.spin,.grow,.pulse,.fb{transform-box:fill-box;transform-origin:center;}
${css}
@media (prefers-reduced-motion: reduce){*{animation:none!important;}}
</style>
<defs>
<clipPath id="card"><rect width="${w}" height="${h}" rx="18"/></clipPath>
${defs}
</defs>
<g clip-path="url(#card)">
${body}
</g>
</svg>
`;
}

export function cardBg(w, h, { glow = true } = {}) {
  return `<rect width="${w}" height="${h}" fill="${C.card}"/>
${glow ? `<rect width="${w}" height="${h}" fill="url(#glowR)"/>` : ''}
<rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="17.5" stroke="${C.line}" stroke-width="1.5"/>`;
}

export function glowDef(cx, cy, rad, color = C.red, op = 0.18) {
  return `<radialGradient id="glowR" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${rad}">
<stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
}

export const accentGrad = (id, x1 = 0, x2 = 1, y1 = 0, y2 = 0) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${C.red}"/><stop offset="1" stop-color="${C.yellow}"/></linearGradient>`;

export const glowFilter = (id, sd = 4) =>
  `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

export function icon(name, x, y, s, fill) {
  return `<path transform="translate(${r(x)} ${r(y)}) scale(${r(s / 24)})" d="${icons[name]}" fill="${fill}"/>`;
}

export function write(dir, name, content) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), content);
  return `${name} (${(Buffer.byteLength(content) / 1024).toFixed(1)} KB)`;
}

function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function smooth(pts) {
  let d = `M ${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${r(c1[0])} ${r(c1[1])} ${r(c2[0])} ${r(c2[1])} ${r(p2[0])} ${r(p2[1])}`;
  }
  return d;
}

const ink = (d, color, width, delay, dur) =>
  `<path pathLength="100" d="${d}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-dasharray="100" stroke-dashoffset="100"><animate attributeName="stroke-dashoffset" from="100" to="0" begin="${r(delay)}s" dur="${r(dur)}s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".6 .05 .3 1"/></path>`;

export function handCircle(cx, cy, rx, ry, { seed = 1, color = C.hand, width = 2.6, delay = 0.6, dur = 0.8 } = {}) {
  const rand = rng(seed);
  const start = -Math.PI * (0.6 + rand() * 0.3);
  const pts = [];
  const n = 36;
  for (let i = 0; i <= n; i++) {
    const a = start + (i / n) * Math.PI * 2 * 1.14;
    const k = 1 + (rand() - 0.5) * 0.06 + (i / n) * 0.09;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return ink(smooth(pts), color, width, delay, dur);
}

export function handArrow(x1, y1, x2, y2, { bend = 0.25, color = C.hand, width = 2.4, delay = 0.6, dur = 0.6, head = 13 } = {}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const qx = (x1 + x2) / 2 - dy * bend;
  const qy = (y1 + y2) / 2 + dx * bend;
  const ang = Math.atan2(y2 - qy, x2 - qx);
  const h1 = [x2 - Math.cos(ang - 0.5) * head, y2 - Math.sin(ang - 0.5) * head];
  const h2 = [x2 - Math.cos(ang + 0.45) * head, y2 - Math.sin(ang + 0.45) * head];
  return (
    ink(`M ${r(x1)} ${r(y1)} Q ${r(qx)} ${r(qy)} ${r(x2)} ${r(y2)}`, color, width, delay, dur) +
    ink(`M ${r(h1[0])} ${r(h1[1])} L ${r(x2)} ${r(y2)} L ${r(h2[0])} ${r(h2[1])}`, color, width, delay + dur, 0.25)
  );
}

export function handUnderline(x, y, w, { seed = 3, color = C.hand, width = 2.6, delay = 0.6, dur = 0.5 } = {}) {
  const rand = rng(seed);
  const top = [];
  for (let i = 0; i <= 8; i++) top.push([x + (w * i) / 8, y + (rand() - 0.5) * 3 - (i / 8) * 2]);
  const back = [];
  for (let i = 8; i >= 2; i--) back.push([x + (w * i) / 8 - 6, y + 5 + (rand() - 0.5) * 3]);
  return ink(smooth(top), color, width, delay, dur) + ink(smooth(back), color, width * 0.8, delay + dur, dur * 0.8);
}

let clipSeq = 0;
export function handText(x, y, text, { size = 28, color = C.hand, delay = 0.8, dur, rotate = -4, anchor = 'start' } = {}) {
  const id = `hw${++clipSeq}`;
  const w = measure(text, 'hand', size);
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  const d = dur ?? Math.max(0.5, [...text].length * 0.045);
  return `<g transform="rotate(${rotate} ${r(x)} ${r(y)})">
<clipPath id="${id}"><rect x="${r(x0 - 4)}" y="${r(y - size)}" width="0" height="${r(size * 1.5)}"><animate attributeName="width" from="0" to="${r(w + 10)}" begin="${r(delay)}s" dur="${r(d)}s" fill="freeze"/></rect></clipPath>
<text x="${r(x0)}" y="${r(y)}" class="hand" font-size="${size}" fill="${color}" clip-path="url(#${id})">${esc(text)}</text>
</g>`;
}
