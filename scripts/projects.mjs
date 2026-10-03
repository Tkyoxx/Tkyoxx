import { C, doc, t, esc, measure, fit, r, cardBg, glowDef, accentGrad, glowFilter, handText, handArrow, handCircle } from './lib.mjs';

const CSS = `
.pulse{animation:pulse 1.6s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
.up{animation:up .8s cubic-bezier(.2,.8,.2,1) both;}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.spin{animation:spin 2.4s linear infinite;}@keyframes spin{to{transform:rotate(360deg)}}
`;
const delay = (s) => `style="animation-delay:${r(s)}s"`;

function header(x, y, pos, label) {
  return `<rect x="${x}" y="${y}" width="52" height="32" rx="7" fill="${C.red}"/>
${t(x + 26, y + 24, pos, { font: 'display', size: 20, fill: '#fff', anchor: 'middle' })}
${t(x + 66, y + 21, esc(label), { font: 'monob', size: 13, fill: C.dim, ls: 3.5 })}`;
}

function chips(x, y, list, maxW) {
  let cx = x;
  let cy = y;
  let out = '';
  for (const label of list) {
    const w = measure(label, 'monob', 12, 1.4) + 24;
    if (cx + w > x + maxW) {
      cx = x;
      cy += 36;
    }
    out += `<rect x="${r(cx)}" y="${cy}" width="${r(w)}" height="28" rx="7" fill="#111A36" stroke="${C.line2}"/>${t(cx + 12, cy + 18.5, esc(label), { font: 'monob', size: 12, fill: C.sub, ls: 1.4 })}`;
    cx += w + 8;
  }
  return out;
}

function status(x, y, label, color, extra = '') {
  return `<circle class="pulse" cx="${x + 5}" cy="${y - 5}" r="5" fill="${color}"/>
${t(x + 20, y, esc(label), { font: 'monob', size: 13, fill: color, ls: 2.5 })}
${extra ? t(x + 26 + measure(label, 'monob', 13, 2.5), y, esc(extra), { font: 'mono', size: 13, fill: C.dim, ls: 2 }) : ''}`;
}

function lines(x, y, list, size, fill, lh) {
  return list.map((l, i) => t(x, y + i * lh, esc(l), { font: 'sans', size, fill })).join('');
}

export function featured() {
  const W = 1200;
  const H = 340;
  const fx = 640;
  const fy = 28;
  const fw = 528;
  const fh = 284;
  const bars = [0.42, 0.55, 0.38, 0.66, 0.6, 0.78, 0.52, 0.84, 0.7, 0.9, 0.74, 0.95, 0.82, 1];
  const chartX = 772;
  const chartY = 248;
  const chartH = 80;
  let css = CSS + `
.bar{transform-box:fill-box;transform-origin:bottom;animation:bar 4.8s cubic-bezier(.3,.7,.2,1) infinite;}
@keyframes bar{0%{transform:scaleY(.08)}22%,80%{transform:scaleY(1)}100%{transform:scaleY(.08)}}
.ln{animation:ln 4.8s ease-in-out infinite;}
@keyframes ln{0%,8%{stroke-dashoffset:600}40%,80%{stroke-dashoffset:0}100%{stroke-dashoffset:-600}}
.nav{animation:nav 8s cubic-bezier(.7,0,.3,1) infinite;}
@keyframes nav{0%,22%{transform:translateY(0)}25%,47%{transform:translateY(30px)}50%,72%{transform:translateY(90px)}75%,97%{transform:translateY(60px)}100%{transform:translateY(0)}}
.shm{animation:shm 2.6s linear infinite;}
@keyframes shm{from{transform:translateX(-120px)}to{transform:translateX(420px)}}
.sp{animation:sp 3s ease-in-out infinite;}
@keyframes sp{0%{stroke-dashoffset:120}50%,100%{stroke-dashoffset:0}}
.clk{animation:clk 8s ease-out infinite;transform-box:fill-box;transform-origin:center;}
@keyframes clk{0%,30%{transform:scale(0);opacity:0}31%{opacity:.8}38%{transform:scale(1);opacity:0}100%{opacity:0}}`;
  const defs =
    glowDef(980, 120, 520, C.red, 0.16) +
    accentGrad('acc') +
    glowFilter('gl', 3) +
    `<linearGradient id="barG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.orange}"/><stop offset="1" stop-color="${C.red}" stop-opacity=".55"/></linearGradient>
<linearGradient id="shG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="frame"><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="14"/></clipPath>`;

  const title = 'SaaS de gestión operativa';
  const ts = fit(title, 'display', 40, 560);
  let body = cardBg(W, H);
  body += `<rect x="0" y="0" width="7" height="${H}" fill="url(#acc)"/>`;
  body += `<g class="up">${header(40, 30, 'P1', 'PROYECTO PRINCIPAL')}</g>`;
  body += t(40, 118, esc(title), { font: 'display', size: ts, fill: C.text, cls: 'up', extra: delay(0.1) });
  body += t(42, 148, 'PLATAFORMA WEB  ·  MERCADO LATAM', { font: 'monob', size: 14, fill: C.orange, ls: 3, cls: 'up', extra: delay(0.15) });
  body += `<g class="up" ${delay(0.2)}>${lines(42, 192, ['Diseñada, construida y operada en solitario:', 'del esquema en Postgres al último pixel.'], 19, '#C3CAE0', 28)}</g>`;
  body += `<g class="up" ${delay(0.3)}>${chips(42, 238, ['NEXT.JS 14', 'SUPABASE', 'CLERK', 'TAILWIND', 'MOTION'], 560)}</g>`;
  body += `<g class="up" ${delay(0.4)}>${status(42, 306, 'EN DESARROLLO ACTIVO', C.green, '·  FOUNDER / FULL-STACK')}</g>`;

  let ui = `<rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="14" fill="#0C1329"/>
<rect x="${fx}" y="${fy}" width="${fw}" height="34" fill="#101934"/>
<line x1="${fx}" y1="${fy + 34}" x2="${fx + fw}" y2="${fy + 34}" stroke="${C.line}"/>
<circle cx="${fx + 20}" cy="${fy + 17}" r="5" fill="${C.red}"/><circle cx="${fx + 37}" cy="${fy + 17}" r="5" fill="${C.orange}"/><circle cx="${fx + 54}" cy="${fy + 17}" r="5" fill="#384A80"/>
<rect x="${fx + 150}" y="${fy + 8}" width="228" height="18" rx="9" fill="#131C3A"/>
${t(fx + 264, fy + 21, 'app  /  dashboard', { font: 'mono', size: 11, fill: C.dim, anchor: 'middle' })}
<rect x="${fx}" y="${fy + 35}" width="104" height="${fh - 35}" fill="#091025"/>
<line x1="${fx + 104}" y1="${fy + 35}" x2="${fx + 104}" y2="${fy + fh}" stroke="${C.line}"/>
<rect x="${fx + 16}" y="${fy + 50}" width="24" height="24" rx="6" fill="url(#acc)"/>
<rect x="${fx + 48}" y="${fy + 58}" width="40" height="8" rx="4" fill="#2A3866"/>
<rect class="nav" x="${fx + 8}" y="${fy + 92}" width="88" height="24" rx="6" fill="rgba(228,0,43,.16)" stroke="rgba(228,0,43,.45)"/>`;
  for (let i = 0; i < 6; i++) {
    ui += `<rect x="${fx + 18}" y="${fy + 100 + i * 30}" width="8" height="8" rx="2" fill="#334375"/><rect x="${fx + 34}" y="${fy + 101 + i * 30}" width="${[46, 38, 52, 34, 44, 30][i]}" height="6" rx="3" fill="#26335E"/>`;
  }
  const kx = fx + 120;
  const kw = 122;
  [64, 52, 44].forEach((vw, i) => {
    const x = kx + i * (kw + 12);
    const y = fy + 50;
    const sp = `M ${x + 66} ${y + 50} l 10 -6 l 9 3 l 10 -10 l 9 4 l 10 -12`;
    ui += `<rect x="${x}" y="${y}" width="${kw}" height="70" rx="10" fill="#0F1834" stroke="${C.line}"/>
<rect x="${x + 12}" y="${y + 13}" width="50" height="6" rx="3" fill="#2A3866"/>
<rect x="${x + 12}" y="${y + 30}" width="${vw}" height="13" rx="4" fill="#C9CFE2"/>
<rect x="${x + 12}" y="${y + 52}" width="26" height="6" rx="3" fill="${C.green}"/>
<path class="sp" d="${sp}" stroke="${C.orange}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="120" style="animation-delay:${i * 0.3}s"/>`;
  });
  ui += `<rect x="${kx}" y="${fy + 132}" width="390" height="108" rx="10" fill="#0F1834" stroke="${C.line}"/>`;
  const bw = 17;
  const gap = (370 - bars.length * bw) / (bars.length - 1);
  const pts = [];
  bars.forEach((b, i) => {
    const x = chartX - 6 + i * (bw + gap);
    const h = b * chartH;
    pts.push(`${r(x + bw / 2)},${r(chartY - h - 8)}`);
    ui += `<rect class="bar" x="${r(x)}" y="${r(chartY - h)}" width="${bw}" height="${r(h)}" rx="3" fill="url(#barG)" style="animation-delay:${r(i * 0.06)}s"/>`;
  });
  ui += `<polyline class="ln" points="${pts.join(' ')}" stroke="#FFF1B8" stroke-width="2" stroke-linejoin="round" stroke-dasharray="600" filter="url(#gl)"/>`;
  for (let i = 0; i < 2; i++) {
    const y = fy + 252 + i * 16;
    ui += `<circle cx="${kx + 8}" cy="${y + 4}" r="4" fill="${i ? C.orange : C.green}"/><rect x="${kx + 20}" y="${y}" width="${[150, 110][i]}" height="8" rx="4" fill="#24305A"/><rect x="${kx + 300}" y="${y}" width="${[90, 70][i]}" height="8" rx="4" fill="#1B2648"/>`;
  }
  ui += `<rect class="shm" x="${kx}" y="${fy + 246}" width="90" height="34" fill="url(#shG)"/>`;
  ui += `<g>
<animateMotion dur="8s" repeatCount="indefinite" keyTimes="0;.28;.36;.6;.8;1" keyPoints="0;.3;.3;.62;.85;1" calcMode="spline" keySplines=".6 0 .3 1;0 0 1 1;.6 0 .3 1;.6 0 .3 1;.6 0 .3 1" path="M ${fx + 470} ${fy + 270} L ${fx + 60} ${fy + 114} L ${fx + 60} ${fy + 114} L ${fx + 300} ${fy + 95} L ${fx + 420} ${fy + 200} L ${fx + 470} ${fy + 270}"/>
<circle class="clk" r="14" fill="none" stroke="${C.orange}" stroke-width="2"/>
<path d="M0 0 L0 17 L4.5 13 L7.5 20 L10 19 L7 12 L13 12 Z" fill="#fff" stroke="#060A16" stroke-width="1.2" stroke-linejoin="round"/>
</g>`;
  body += `<g clip-path="url(#frame)">${ui}</g><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}" rx="14" stroke="#26335E"/>`;
  body += handText(352, 60, 'en esto estoy ahora mismo', { size: 25, delay: 1.5, rotate: -3 });
  body += handArrow(586, 50, 632, 74, { bend: -0.4, delay: 2.5, head: 11 });
  return doc({ w: W, h: H, title: 'P1 — SaaS de gestión operativa', fonts: ['display', 'sans', 'mono', 'monob', 'hand'], css, defs, body });
}

export function plagasync() {
  const W = 600;
  const H = 340;
  const px = 418;
  const py = 46;
  const pw = 136;
  const ph = 262;
  const CYCLE = 7;
  let css = CSS + `
.off{animation:off ${CYCLE}s steps(1) infinite;}@keyframes off{0%,49.9%{opacity:1}50%,100%{opacity:0}}
.on{animation:on ${CYCLE}s steps(1) infinite;}@keyframes on{0%,49.9%{opacity:0}50%,100%{opacity:1}}
.syncing{animation:syncing ${CYCLE}s linear infinite;}
@keyframes syncing{0%,49%{opacity:.15}52%,100%{opacity:1}}`;
  const rows = 5;
  for (let i = 0; i < rows; i++) {
    const at = 54 + i * 7;
    css += `.d${i}{animation:d${i} ${CYCLE}s linear infinite;}
@keyframes d${i}{0%,${at}%{fill:${C.orange}}${at + 1.5}%,98%{fill:${C.green}}100%{fill:${C.orange}}}`;
  }
  const defs = glowDef(490, 170, 300, C.orange, 0.14) + accentGrad('acc') + glowFilter('gl', 3);
  let body = cardBg(W, H);
  body += `<g class="up">${header(32, 30, 'P2', 'APP MÓVIL')}</g>`;
  body += t(32, 112, 'PlagaSync', { font: 'display', size: 38, fill: C.text, cls: 'up', extra: delay(0.1) });
  body += t(34, 140, 'EXPO  ·  REACT NATIVE', { font: 'monob', size: 13, fill: C.orange, ls: 3, cls: 'up', extra: delay(0.15) });
  body += `<g class="up" ${delay(0.2)}>${lines(34, 180, ['App móvil offline-first: funciona', 'sin señal y sincroniza los datos', 'en cuanto vuelve la conexión.'], 17, '#C3CAE0', 25)}</g>`;
  body += `<g class="up" ${delay(0.3)}>${chips(34, 252, ['OFFLINE-FIRST', 'SYNC', 'APK'], 360)}</g>`;
  body += `<g class="up" ${delay(0.4)}>${status(34, 312, 'RELEASES', C.green, '·  ANDROID')}</g>`;

  let ph_ = `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="22" fill="#0C1329" stroke="#2C3A6B" stroke-width="2"/>
<rect x="${px + 48}" y="${py + 9}" width="40" height="8" rx="4" fill="#1A2547"/>
<g class="off">${t(px + 16, py + 40, 'SIN SEÑAL', { font: 'monob', size: 10, fill: C.dim, ls: 1.5 })}<g fill="#334375"><rect x="${px + 102}" y="${py + 33}" width="3" height="5"/><rect x="${px + 107}" y="${py + 30}" width="3" height="8"/><rect x="${px + 112}" y="${py + 27}" width="3" height="11"/></g><line x1="${px + 100}" y1="${py + 26}" x2="${px + 118}" y2="${py + 40}" stroke="${C.red}" stroke-width="2"/></g>
<g class="on">${t(px + 16, py + 40, 'ONLINE', { font: 'monob', size: 10, fill: C.green, ls: 1.5 })}<g fill="${C.green}"><rect x="${px + 102}" y="${py + 33}" width="3" height="5"/><rect x="${px + 107}" y="${py + 30}" width="3" height="8"/><rect x="${px + 112}" y="${py + 27}" width="3" height="11"/><rect x="${px + 117}" y="${py + 24}" width="3" height="14"/></g></g>
<line x1="${px + 10}" y1="${py + 52}" x2="${px + pw - 10}" y2="${py + 52}" stroke="${C.line}"/>`;
  for (let i = 0; i < rows; i++) {
    const y = py + 66 + i * 30;
    ph_ += `<rect x="${px + 12}" y="${y}" width="${pw - 24}" height="22" rx="6" fill="#111A36"/>
<circle class="d${i}" cx="${px + 24}" cy="${y + 11}" r="4"/>
<rect x="${px + 34}" y="${y + 6}" width="${[60, 48, 70, 54, 40][i]}" height="4" rx="2" fill="#2F3E70"/><rect x="${px + 34}" y="${y + 13}" width="${[36, 50, 30, 44, 56][i]}" height="3" rx="1.5" fill="#24305A"/>`;
  }
  const sx = px + pw / 2;
  const sy = py + ph - 34;
  ph_ += `<g class="off">${t(sx, sy + 4, '5 EN COLA', { font: 'monob', size: 10, fill: C.orange, ls: 1.5, anchor: 'middle' })}</g>
<g class="on"><g class="syncing"><g class="spin" filter="url(#gl)">
<path d="M ${sx - 11} ${sy} A 11 11 0 0 1 ${sx + 9} ${sy - 6}" stroke="${C.green}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M ${sx + 11} ${sy} A 11 11 0 0 1 ${sx - 9} ${sy + 6}" stroke="${C.green}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M ${sx + 9} ${sy - 12} L ${sx + 10} ${sy - 5} L ${sx + 3} ${sy - 5}" stroke="${C.green}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M ${sx - 9} ${sy + 12} L ${sx - 10} ${sy + 5} L ${sx - 3} ${sy + 5}" stroke="${C.green}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</g></g></g>`;
  body += ph_;
  body += handText(196, 60, 'sin señal también funciona', { size: 23, delay: 1.5, rotate: -4 });
  body += handArrow(398, 56, 428, 80, { bend: -0.4, delay: 2.5, head: 10 });
  return doc({ w: W, h: H, title: 'P2 — PlagaSync', fonts: ['display', 'sans', 'mono', 'monob', 'hand'], css, defs, body });
}

export function nova() {
  const W = 600;
  const H = 340;
  const cx = 484;
  const cy = 178;
  const R = 96;
  const SWEEP = 4;
  const blips = [
    [40, 0.62, 'MOD'],
    [130, 0.8, '0.3.7'],
    [215, 0.45, 'NEWS'],
    [300, 0.72, 'SKIN'],
  ];
  let css = CSS + `
.sweep{animation:spin ${SWEEP}s linear infinite;transform-origin:${cx}px ${cy}px;transform-box:view-box;}`;
  let blipSvg = '';
  blips.forEach(([deg, dist, label], i) => {
    const a = ((deg - 90) * Math.PI) / 180;
    const x = cx + Math.cos(a) * R * dist;
    const y = cy + Math.sin(a) * R * dist;
    const p = r((deg / 360) * 100);
    css += `.b${i}{animation:b${i} ${SWEEP}s linear infinite;}
@keyframes b${i}{0%{opacity:${deg > 300 ? 0.5 : 0.15}}${p}%{opacity:.15}${r(Math.min(p + 1.5, 99.9))}%{opacity:1}${r(Math.min(p + 45, 100))}%{opacity:.15}100%{opacity:.15}}`;
    const lw = measure(label, 'monob', 10, 1) + 12;
    const lx = x > cx + 30 ? x - 10 - lw : x + 10;
    blipSvg += `<g class="b${i}"><circle cx="${r(x)}" cy="${r(y)}" r="4.5" fill="${C.orange}" filter="url(#gl)"/>
<rect x="${r(lx)}" y="${r(y - 9)}" width="${r(lw)}" height="18" rx="4" fill="#121B38" stroke="#4A3A1A"/>${t(lx + 6, y + 4, label, { font: 'monob', size: 10, fill: C.orange, ls: 1 })}</g>`;
  });
  const defs =
    glowDef(cx, cy, 260, C.orange, 0.13) +
    accentGrad('acc') +
    glowFilter('gl', 3) +
    `<linearGradient id="sw" gradientUnits="userSpaceOnUse" x1="${cx}" y1="${cy - R}" x2="${cx - R * 0.7}" y2="${cy - R * 0.4}"><stop offset="0" stop-color="${C.orange}" stop-opacity=".55"/><stop offset="1" stop-color="${C.orange}" stop-opacity="0"/></linearGradient>
<clipPath id="rad"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>`;
  const a2 = (-50 * Math.PI) / 180 - Math.PI / 2;
  const wedge = `M ${cx} ${cy} L ${cx} ${cy - R} A ${R} ${R} 0 0 0 ${r(cx + Math.cos(a2) * R)} ${r(cy + Math.sin(a2) * R)} Z`;
  let body = cardBg(W, H);
  body += `<g class="up">${header(32, 30, 'P3', 'COMUNIDAD SA-MP')}</g>`;
  body += t(32, 112, 'Nova.mp', { font: 'display', size: 38, fill: C.text, cls: 'up', extra: delay(0.1) });
  body += t(34, 140, 'CONTENT HUB', { font: 'monob', size: 13, fill: C.orange, ls: 3, cls: 'up', extra: delay(0.15) });
  body += `<g class="up" ${delay(0.2)}>${lines(34, 180, ['Hub de contenido para la comunidad', 'SA-MP: mods, versiones y noticias', 'reunidos en un solo lugar.'], 17, '#C3CAE0', 25)}</g>`;
  body += `<g class="up" ${delay(0.3)}>${chips(34, 252, ['MODS', 'VERSIONES', 'NOTICIAS'], 330)}</g>`;
  body += `<g class="up" ${delay(0.4)}>${status(34, 312, 'ONLINE', C.green, '·  GTA SAN ANDREAS MP')}</g>`;
  body += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#0A1127" stroke="#2A3866"/>
<g stroke="#1F2B52">${[R * 0.66, R * 0.33].map((rr) => `<circle cx="${cx}" cy="${cy}" r="${r(rr)}"/>`).join('')}
<line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}"/><line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy + R}"/></g>
<g clip-path="url(#rad)"><g class="sweep"><path d="${wedge}" fill="url(#sw)"/><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - R}" stroke="${C.orange}" stroke-width="2" filter="url(#gl)"/></g></g>
<circle cx="${cx}" cy="${cy}" r="${R + 10}" stroke="${C.line}" stroke-dasharray="2 6"/>
<circle cx="${cx}" cy="${cy}" r="4" fill="${C.orange}"/>
${blipSvg}`;
  body += handText(232, 104, 'hecho para la comunidad', { size: 23, delay: 1.5, rotate: -4 });
  body += handArrow(400, 88, 392, 128, { bend: -0.5, delay: 2.5, head: 10 });
  return doc({ w: W, h: H, title: 'P3 — Nova.mp', fonts: ['display', 'sans', 'mono', 'monob', 'hand'], css, defs, body });
}
