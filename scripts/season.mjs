import { C, doc, t, esc, fit, wrap, r, cardBg, glowDef, accentGrad, glowFilter, handText, handArrow } from './lib.mjs';

const ROUNDS = [
  { when: '11 AÑOS', title: 'El arranque', text: 'Un PC y muchos juegos. Quería saber cómo funcionaban por dentro.' },
  { when: 'EL TALLER', title: 'Romper para aprender', text: 'Modificar juegos, optimizar Windows y armar mis propias herramientas.' },
  { when: 'SA-MP', title: 'Mi escuela', text: 'Scripts con MoonLoader para roleplay, como una bodycam con /body y F10.' },
  { when: 'HOY', title: 'PlagaSync', text: 'Mi SaaS para fumigadoras en Colombia, construido de punta a punta.', live: true },
  { when: 'LA META', title: 'Vivir de lo mío', text: 'Productos propios que resuelvan problemas reales a gente real.', ghost: true },
]

const W = 1200;
const H = 350;
const Y = 132;
const X0 = 40;
const X1 = 1160;
const NX = ROUNDS.map((_, i) => 130 + (i * 940) / (ROUNDS.length - 1));
const DUR = 12;

function cubicLen(p0, p1, p2, p3) {
  let len = 0;
  let prev = p0;
  for (let i = 1; i <= 40; i++) {
    const u = i / 40;
    const a = (1 - u) ** 3;
    const b = 3 * (1 - u) ** 2 * u;
    const c = 3 * (1 - u) * u ** 2;
    const d = u ** 3;
    const pt = [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
    len += Math.hypot(pt[0] - prev[0], pt[1] - prev[1]);
    prev = pt;
  }
  return len;
}

function trackPath() {
  let d = `M ${X0} ${Y} L ${NX[0]} ${Y}`;
  const marks = [NX[0] - X0];
  let total = NX[0] - X0;
  for (let i = 0; i < NX.length - 1; i++) {
    const s = i % 2 ? 1 : -1;
    const p0 = [NX[i], Y];
    const p1 = [NX[i] + 90, Y + 26 * s];
    const p2 = [NX[i + 1] - 90, Y - 26 * s];
    const p3 = [NX[i + 1], Y];
    d += ` C ${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
    total += cubicLen(p0, p1, p2, p3);
    marks.push(total);
  }
  d += ` L ${X1} ${Y}`;
  total += X1 - NX[NX.length - 1];
  return { d, marks: marks.map((m) => m / total) };
}

export function season() {
  const { d, marks } = trackPath();
  const stops = ROUNDS.findIndex((x) => x.live);
  const travel = 7.6;
  const pause = 0.45;
  const keyT = [0];
  const keyP = [0];
  let time = 0;
  const seg = travel / (stops + 1);
  const arrive = [];
  for (let k = 0; k <= stops; k++) {
    time += seg;
    keyT.push(time);
    keyP.push(marks[k]);
    arrive.push(time);
    if (k < stops) {
      time += pause;
      keyT.push(time);
      keyP.push(marks[k]);
    }
  }
  keyT.push(DUR);
  keyP.push(marks[stops]);
  const kt = keyT.map((v) => r(v / DUR)).join(';');
  const kp = keyP.map((v) => r(v)).join(';');
  const off = keyP.map((v) => r(100 - v * 100)).join(';');

  let css = `
.pulse{animation:pulse 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.75)}}
.up{animation:up .8s cubic-bezier(.2,.8,.2,1) both;}
@keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.ring{animation:ring 1.6s ease-out infinite;transform-box:fill-box;transform-origin:center;}
@keyframes ring{from{transform:scale(.6);opacity:.9}to{transform:scale(2.2);opacity:0}}`;
  arrive.forEach((a, k) => {
    const p = r((a / DUR) * 100);
    css += `.n${k}{animation:n${k} ${DUR}s linear infinite;}
@keyframes n${k}{0%,${r(p - 0.5)}%{fill:#0F1730;stroke:${C.line2}}${p}%,97%{fill:${k === stops ? C.red : C.yellow};stroke:${k === stops ? C.red : C.yellow}}100%{fill:#0F1730;stroke:${C.line2}}}`;
  });

  const defs =
    glowDef(600, 120, 640, C.blue, 0.16) +
    accentGrad('acc') +
    glowFilter('gl', 4) +
    `<linearGradient id="drv" gradientUnits="userSpaceOnUse" x1="${X0}" y1="0" x2="${NX[stops]}" y2="0"><stop offset="0" stop-color="${C.blue}"/><stop offset=".55" stop-color="${C.red}"/><stop offset="1" stop-color="${C.yellow}"/></linearGradient>`;

  let body = cardBg(W, H);
  body += t(34, 46, 'TEMPORADA  //  MI TRAYECTO', { font: 'monob', size: 13, fill: C.red, ls: 4 });
  body += t(W - 34, 46, 'DE LOS 11 AÑOS A HOY', { font: 'mono', size: 13, fill: C.dim, ls: 3, anchor: 'end' });

  body += `<path d="${d}" stroke="#121B38" stroke-width="14" stroke-linecap="round"/>
<path d="${d}" stroke="${C.line2}" stroke-width="1.5" stroke-dasharray="6 8"/>
<path d="${d}" pathLength="100" stroke="url(#drv)" stroke-width="4" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="100" filter="url(#gl)">
<animate attributeName="stroke-dashoffset" values="${off}" keyTimes="${kt}" dur="${DUR}s" repeatCount="indefinite"/></path>`;

  ROUNDS.forEach((rd, i) => {
    const x = NX[i];
    const colW = 210;
    if (rd.ghost) {
      body += `<circle cx="${x}" cy="${Y}" r="11" fill="#081024" stroke="${C.dim}" stroke-width="2" stroke-dasharray="3 4"/>`;
    } else if (rd.live) {
      body += `<circle class="ring" cx="${x}" cy="${Y}" r="11" stroke="${C.red}" stroke-width="2"/>
<circle class="n${i}" cx="${x}" cy="${Y}" r="11" stroke-width="3"/>`;
    } else {
      body += `<circle class="n${i}" cx="${x}" cy="${Y}" r="9" stroke-width="3"/>`;
    }
    const whenCol = rd.live ? C.red : rd.ghost ? C.dim : C.yellow;
    let g = '';
    if (rd.live) g += `<circle class="pulse" cx="${r(x - 44)}" cy="${Y + 43}" r="4" fill="${C.red}"/>`;
    g += t(rd.live ? x + 6 : x, Y + 48, `<tspan fill="#4A5680">R${String(i + 1).padStart(2, '0')} · </tspan>${esc(rd.when)}`, { font: 'monob', size: 12, fill: whenCol, ls: 2, anchor: 'middle' });
    const ts = fit(rd.title, 'display', 20, colW);
    g += t(x, Y + 80, esc(rd.title), { font: 'display', size: ts, fill: rd.ghost ? C.sub : C.text, anchor: 'middle' });
    wrap(rd.text, 'sans', 15.5, colW).forEach((ln, k) => {
      g += t(x, Y + 108 + k * 22, esc(ln), { font: 'sans', size: 15.5, fill: rd.ghost ? C.dim : C.sub, anchor: 'middle' });
    });
    body += `<g class="up" style="animation-delay:${r(0.15 + i * 0.12)}s">${g}</g>`;
  });

  body += `<g filter="url(#gl)">
<animateMotion dur="${DUR}s" repeatCount="indefinite" rotate="auto" keyTimes="${kt}" keyPoints="${kp}" calcMode="linear" path="${d}"/>
<rect x="-13" y="-4" width="25" height="8" rx="4" fill="#22337A"/>
<rect x="-9" y="-1.2" width="16" height="2.4" rx="1.2" fill="${C.red}"/>
<circle cx="11.5" cy="0" r="2.3" fill="${C.yellow}"/>
<rect x="9" y="-7.5" width="3.5" height="15" rx="1" fill="${C.red}"/>
<rect x="-15" y="-6.5" width="3.5" height="13" rx="1" fill="${C.red}"/>
</g>`;

  body += handText(NX[0] + 24, 86, 'aquí empezó todo', { size: 26, delay: 1.2, rotate: -4 });
  body += handArrow(NX[0] + 20, 80, NX[0] + 3, 112, { bend: 0.4, delay: 2.0, head: 10 });
  const last = NX[NX.length - 1];
  body += handText(last - 26, 86, 'a donde voy', { size: 26, delay: 2.6, rotate: -3, anchor: 'end' });
  body += handArrow(last - 20, 76, last - 2, 112, { bend: -0.4, delay: 3.4, head: 10 });

  return doc({ w: W, h: H, title: 'Temporada — mi trayecto, de los 11 años a hoy', fonts: ['display', 'sans', 'mono', 'monob', 'hand'], css, defs, body });
}
