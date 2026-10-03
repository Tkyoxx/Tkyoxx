import { C, doc, t, esc, measure, wrap, r, cardBg, glowDef, accentGrad, glowFilter, handText, handArrow } from './lib.mjs';

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


const LOOP = 10;

function show(cls, on, off = 96) {
  return `.${cls}{animation:${cls} ${LOOP}s linear infinite;}
@keyframes ${cls}{0%,${r(on - 0.6)}%{opacity:0}${on}%,${off}%{opacity:1}${Math.min(off + 2, 100)}%,100%{opacity:0}}`;
}

function hide(cls, off) {
  return `.${cls}{animation:${cls} ${LOOP}s linear infinite;}
@keyframes ${cls}{0%,${r(off - 0.6)}%{opacity:1}${off}%,98%{opacity:0}100%{opacity:1}}`;
}

function qr(x, y, size, seed) {
  const n = 13;
  const m = size / n;
  let s = seed;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  let out = '';
  const finder = (fx, fy) =>
    `<rect x="${r(x + fx * m)}" y="${r(y + fy * m)}" width="${r(m * 4)}" height="${r(m * 4)}" fill="#0A1230"/><rect x="${r(x + (fx + 0.8) * m)}" y="${r(y + (fy + 0.8) * m)}" width="${r(m * 2.4)}" height="${r(m * 2.4)}" fill="#F4F6FB"/><rect x="${r(x + (fx + 1.4) * m)}" y="${r(y + (fy + 1.4) * m)}" width="${r(m * 1.2)}" height="${r(m * 1.2)}" fill="#0A1230"/>`;
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      const inF = (i < 5 && j < 5) || (i > n - 6 && j < 5) || (i < 5 && j > n - 6);
      if (!inF && rand() > 0.52) out += `<rect x="${r(x + i * m)}" y="${r(y + j * m)}" width="${r(m)}" height="${r(m)}" fill="#0A1230"/>`;
    }
  return out + finder(0, 0) + finder(n - 4, 0) + finder(0, n - 4);
}

const SIG = (x, y, k = 1) =>
  `M ${x} ${y + 10 * k} c ${6 * k} ${-14 * k} ${10 * k} ${-16 * k} ${12 * k} ${-6 * k} s ${-4 * k} ${16 * k} ${4 * k} ${8 * k} s ${10 * k} ${-14 * k} ${14 * k} ${-6 * k} s ${2 * k} ${10 * k} ${8 * k} ${4 * k} s ${8 * k} ${-6 * k} ${14 * k} ${-2 * k}`;

export function plagasync() {
  const W = 1200;
  const H = 430;
  const px = 640;
  const py = 92;
  const pw = 156;
  const ph = 296;
  const dx = 880;
  const dy = 76;
  const dw = 266;
  const dh = 318;

  let css = CSS + `
.sig{stroke-dasharray:120;animation:sig ${LOOP}s linear infinite;}
@keyframes sig{0%,18%{stroke-dashoffset:120}32%,96%{stroke-dashoffset:0}100%{stroke-dashoffset:120}}
.sig2{stroke-dasharray:120;animation:sig2 ${LOOP}s linear infinite;}
@keyframes sig2{0%,74%{stroke-dashoffset:120}80%,96%{stroke-dashoffset:0}100%{stroke-dashoffset:120}}
.rip{animation:rip ${LOOP}s ease-out infinite;transform-box:fill-box;transform-origin:center;}
@keyframes rip{0%,37.9%{transform:scale(.2);opacity:0}38%{opacity:.9}44%,100%{transform:scale(1.8);opacity:0}}
.paper{animation:paper ${LOOP}s cubic-bezier(.2,.8,.2,1) infinite;transform-box:fill-box;transform-origin:center;}
@keyframes paper{0%,61%{opacity:.22;transform:scale(.96)}64%,96%{opacity:1;transform:none}100%{opacity:.22;transform:scale(.96)}}
.stamp{animation:stamp ${LOOP}s cubic-bezier(.3,1.6,.4,1) infinite;transform-box:fill-box;transform-origin:center;}
@keyframes stamp{0%,85.9%{opacity:0;transform:scale(1.9) rotate(-14deg)}88%,96%{opacity:1;transform:scale(1) rotate(-14deg)}100%{opacity:0}}
.spin{animation:spin 1s linear infinite;}@keyframes spin{to{transform:rotate(360deg)}}`;
  css += hide('off', 44) + show('sync', 44, 54) + show('on', 54);
  css += show('c1', 6) + show('c2', 10) + show('c3', 14) + hide('btn', 40) + show('done', 40);
  css += show('pc', 64) + show('k1', 66) + show('k2', 68.5) + show('k3', 71) + show('k4', 73.5) + show('qr', 82);
  css += hide('wait', 63);

  const defs =
    glowDef(900, 240, 520, C.blue, 0.2) +
    accentGrad('acc') +
    glowFilter('gl', 3) +
    `<clipPath id="ph"><rect x="${px + 6}" y="${py + 6}" width="${pw - 12}" height="${ph - 12}" rx="20"/></clipPath>`;

  let body = cardBg(W, H);
  body += `<rect x="0" y="0" width="7" height="${H}" fill="url(#acc)"/>`;
  body += `<g class="up">${header(40, 30, 'P1', 'PROYECTO PRINCIPAL · EN LANZAMIENTO')}</g>`;
  body += t(40, 128, 'PlagaSync', { font: 'display', size: 54, fill: C.text, cls: 'up', extra: delay(0.1) });
  body += t(42, 160, 'SAAS PARA FUMIGADORAS · COLOMBIA', { font: 'monob', size: 14, fill: C.yellow, ls: 3, cls: 'up', extra: delay(0.15) });
  const desc = wrap('Reemplaza WhatsApp, Excel y el formulario de papel: clientes, órdenes, inventario químico, reportes PDF y certificados con QR. Con app Android para técnicos que funciona sin señal.', 'sans', 18, 520);
  body += `<g class="up" ${delay(0.2)}>${lines(42, 202, desc, 18, '#C3CAE0', 27)}</g>`;
  const cy = 202 + desc.length * 27 + 8;
  body += `<g class="up" ${delay(0.3)}>${chips(42, cy, ['MULTI-EMPRESA', 'OFFLINE-FIRST', 'PDF + QR', 'APP ANDROID', 'GPS'], 540)}</g>`;
  body += `<g class="up" ${delay(0.4)}>${status(42, H - 32, 'GRATIS EN LANZAMIENTO', C.green, '·  PLAGASYNC.APP')}</g>`;

  let phone = `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="26" fill="#0C1329" stroke="#2C3A6B" stroke-width="2"/>
<g clip-path="url(#ph)">
<rect x="${px}" y="${py}" width="${pw}" height="40" fill="#101934"/>
${t(px + 16, py + 28, 'OS-04219', { font: 'monob', size: 10, fill: C.dim, ls: 1 })}
<g class="off">${t(px + pw - 14, py + 28, 'SIN SEÑAL', { font: 'monob', size: 9, fill: C.red, ls: 1, anchor: 'end' })}</g>
<g class="sync"><g class="spin" style="transform-origin:${px + pw - 20}px ${py + 24}px;transform-box:view-box"><path d="M ${px + pw - 26} ${py + 24} a 6 6 0 1 1 6 6" stroke="${C.yellow}" stroke-width="2" stroke-linecap="round"/></g></g>
<g class="on">${t(px + pw - 14, py + 28, 'ONLINE', { font: 'monob', size: 9, fill: C.green, ls: 1, anchor: 'end' })}</g>
${t(px + 16, py + 66, 'Almacenes La Cruz', { font: 'semi', size: 12.5, fill: C.text })}
${t(px + 16, py + 82, 'Control de roedores', { font: 'sans', size: 11, fill: C.dim })}`;
  ['Cebado revisado', 'Trampas adhesivas', 'Evidencias foto'].forEach((label, i) => {
    const y = py + 104 + i * 26;
    phone += `<rect x="${px + 16}" y="${y}" width="14" height="14" rx="3" stroke="#384A80" stroke-width="1.5"/>
<path class="c${i + 1}" d="M ${px + 19} ${y + 7} l 3 3 l 6 -7" stroke="${C.green}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
${t(px + 38, y + 11.5, label, { font: 'sans', size: 11, fill: C.sub })}`;
  });
  phone += `${t(px + 16, py + 196, 'FIRMA DEL CLIENTE', { font: 'monob', size: 8.5, fill: C.dim, ls: 1 })}
<rect x="${px + 16}" y="${py + 202}" width="${pw - 32}" height="38" rx="6" fill="#0F1834" stroke="#26335E" stroke-dasharray="3 3"/>
<path class="sig" d="${SIG(px + 30, py + 212)}" stroke="#E9EDF7" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<g class="btn"><rect x="${px + 16}" y="${py + 252}" width="${pw - 32}" height="30" rx="8" fill="${C.red}"/>${t(px + pw / 2, py + 271, 'CERRAR VISITA', { font: 'monob', size: 10, fill: '#fff', ls: 1, anchor: 'middle' })}</g>
<g class="done"><rect x="${px + 16}" y="${py + 252}" width="${pw - 32}" height="30" rx="8" fill="${C.green}"/>${t(px + pw / 2, py + 271, 'VISITA CERRADA', { font: 'monob', size: 10, fill: '#04210F', ls: 1, anchor: 'middle' })}</g>
<circle class="rip" cx="${px + pw / 2}" cy="${py + 267}" r="16" fill="#fff" fill-opacity=".35"/>
</g>`;
  body += phone;

  const pathD = `M ${px + pw + 6} ${py + 150} C ${px + pw + 40} ${py + 90}, ${dx - 40} ${py + 90}, ${dx - 6} ${py + 150}`;
  body += `<path d="${pathD}" stroke="${C.line2}" stroke-width="2" stroke-dasharray="4 6"/>
<g filter="url(#gl)" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;.54;.55;.62;.63;1" dur="${LOOP}s" repeatCount="indefinite"/>
<circle r="6" fill="${C.yellow}"><animateMotion dur="${LOOP}s" repeatCount="indefinite" keyPoints="0;0;1;1" keyTimes="0;.54;.62;1" calcMode="linear" path="${pathD}"/></circle></g>
${t((px + pw + dx) / 2, py + 112, 'SYNC', { font: 'monob', size: 10, fill: '#4A5680', ls: 2, anchor: 'middle' })}`;

  let paper = `<g transform="rotate(2.2 ${dx + dw / 2} ${dy + dh / 2})"><g class="paper">
<rect x="${dx}" y="${dy}" width="${dw}" height="${dh}" rx="6" fill="#F4F6FB"/>
<rect x="${dx}" y="${dy}" width="${dw}" height="46" rx="6" fill="#E6EAF4"/>
${t(dx + 16, dy + 22, 'REPORTE DE SERVICIOS', { font: 'monob', size: 10.5, fill: '#0A1230', ls: 1 })}
${t(dx + 16, dy + 37, 'Control integrado de plagas', { font: 'sans', size: 10, fill: '#56628C' })}
${t(dx + dw - 14, dy + 28, 'No. 04219', { font: 'monob', size: 10, fill: C.red, anchor: 'end' })}
<g class="wait">${t(dx + dw / 2, dy + dh / 2, 'esperando cierre…', { font: 'mono', size: 11, fill: '#8E98B8', anchor: 'middle' })}</g>
<g class="pc">
${t(dx + 16, dy + 70, 'CLIENTE', { font: 'monob', size: 8, fill: '#8E98B8', ls: 1 })}${t(dx + 16, dy + 84, 'Almacenes La Cruz', { font: 'semi', size: 11, fill: '#0A1230' })}
${t(dx + 150, dy + 70, 'TÉCNICO', { font: 'monob', size: 8, fill: '#8E98B8', ls: 1 })}${t(dx + 150, dy + 84, 'R. Pérez', { font: 'semi', size: 11, fill: '#0A1230' })}
<line x1="${dx + 16}" y1="${dy + 96}" x2="${dx + dw - 16}" y2="${dy + 96}" stroke="#D5DAEA"/>
${t(dx + 16, dy + 116, 'CONTROL QUÍMICO', { font: 'monob', size: 8, fill: '#8E98B8', ls: 1 })}
</g>`;
  ['Aspersión', 'Cebado', 'Espolvoreo', 'Trampas'].forEach((label, i) => {
    const x = dx + 16 + (i % 2) * 120;
    const y = dy + 128 + Math.floor(i / 2) * 22;
    paper += `<g class="pc"><rect x="${x}" y="${y}" width="12" height="12" rx="2" stroke="#8E98B8"/>${t(x + 18, y + 10, label, { font: 'sans', size: 10.5, fill: '#334375' })}</g>
<path class="k${i + 1}" d="M ${x + 2.5} ${y + 6} l 2.5 3 l 5 -6" stroke="${C.red}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  });
  paper += `<g class="pc">
${t(dx + 16, dy + 194, 'PRODUCTO', { font: 'monob', size: 8, fill: '#8E98B8', ls: 1 })}${t(dx + 150, dy + 194, 'DOSIS', { font: 'monob', size: 8, fill: '#8E98B8', ls: 1 })}
${t(dx + 16, dy + 210, 'Cipermetrina 25', { font: 'sans', size: 10.5, fill: '#334375' })}${t(dx + 150, dy + 210, '0.5% · 250ml', { font: 'sans', size: 10.5, fill: '#334375' })}
<line x1="${dx + 16}" y1="${dy + 222}" x2="${dx + dw - 16}" y2="${dy + 222}" stroke="#D5DAEA"/>
<line x1="${dx + 16}" y1="${dy + 284}" x2="${dx + 130}" y2="${dy + 284}" stroke="#8E98B8"/>
${t(dx + 16, dy + 298, 'FIRMA CLIENTE', { font: 'monob', size: 8, fill: '#8E98B8', ls: 1 })}
</g>
<path class="sig2" d="${SIG(dx + 26, dy + 262, 1.1)}" stroke="#0A1230" stroke-width="1.8" stroke-linecap="round" fill="none"/>
<g class="qr">${qr(dx + dw - 86, dy + 230, 70, 7)}${t(dx + dw - 51, dy + 312, 'VERIFICABLE', { font: 'monob', size: 7, fill: '#56628C', ls: 1, anchor: 'middle' })}</g>
</g>
<g class="stamp"><rect x="${dx + 120}" y="${dy + 128}" width="124" height="40" rx="6" stroke="${C.red}" stroke-width="3" fill="rgba(228,0,43,.06)"/>${t(dx + 182, dy + 155, 'FIRMADO', { font: 'display', size: 20, fill: C.red, anchor: 'middle' })}</g>
</g>`;
  body += paper;

  body += handText(640, 62, 'así trabaja en campo', { size: 25, delay: 1.4, rotate: -3 });
  body += handArrow(830, 52, 856, 76, { bend: -0.4, delay: 2.3, head: 10 });
  body += handText(40 + measure('PlagaSync', 'display', 54) + 18, 104, 'hecho solo', { size: 26, delay: 2.8, rotate: -8 });

  return doc({ w: W, h: H, title: 'P1 — PlagaSync, SaaS para fumigadoras en Colombia', fonts: ['display', 'semi', 'sans', 'mono', 'monob', 'hand'], css, defs, body });
}

export function garage() {
  const W = 1200;
  const H = 330;
  const tiles = [
    { k: 'MOTOS', title: 'R6 · MT-09', sub: 'S1000RR · Ninja H2', vis: 'moto' },
    { k: 'PIANO', title: 'Golden Hour', sub: 'aprendida en 4 días', vis: 'piano' },
    { k: 'GAMING', title: 'GTA · SA-MP', sub: 'Phasmo · Minecraft · ARK', vis: 'game' },
    { k: 'TINKERING', title: 'Windows ligero', sub: 'BIOS, debloat y tuning', vis: 'cpu' },
  ];
  const gap = 16;
  const tw = (W - 68 - gap * 3) / 4;
  let css = CSS + `
.needle{animation:needle 3.2s cubic-bezier(.5,0,.3,1) infinite;}
@keyframes needle{0%,100%{transform:rotate(-110deg)}45%,60%{transform:rotate(85deg)}}
.key{animation:key 2.4s ease-in-out infinite;}
@keyframes key{0%,100%{fill:#F4F6FB}8%,22%{fill:${C.yellow}}}
.bar{animation:bar 4s ease-in-out infinite;transform-box:fill-box;transform-origin:bottom;}
@keyframes bar{0%,15%{transform:scaleY(1)}55%,85%{transform:scaleY(.28)}100%{transform:scaleY(1)}}
.blink{animation:blink 1.1s steps(1) infinite;}@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:.25}}`;
  const defs = glowDef(600, 330, 620, C.red, 0.14) + accentGrad('acc') + glowFilter('gl', 3);
  let body = cardBg(W, H);
  body += t(34, 46, 'BOXES  //  FUERA DE PISTA', { font: 'monob', size: 13, fill: C.red, ls: 4 });
  tiles.forEach((tile, i) => {
    const x = 34 + i * (tw + gap);
    const y = 72;
    const h = 220;
    const cx = x + tw / 2;
    let v = '';
    if (tile.vis === 'moto') {
      const cy = y + 92;
      const ticks = Array.from({ length: 11 }, (_, k) => {
        const a = ((-200 + k * 22) * Math.PI) / 180;
        return `<line x1="${r(cx + Math.cos(a) * 46)}" y1="${r(cy + Math.sin(a) * 46)}" x2="${r(cx + Math.cos(a) * (k > 7 ? 38 : 41))}" y2="${r(cy + Math.sin(a) * (k > 7 ? 38 : 41))}" stroke="${k > 7 ? C.red : '#56628C'}" stroke-width="2"/>`;
      }).join('');
      v = `<path d="M ${r(cx - 50)} ${cy + 18} A 54 54 0 1 1 ${r(cx + 50)} ${cy + 18}" stroke="#1F2B52" stroke-width="6" stroke-linecap="round"/>${ticks}
<g class="needle" style="transform-origin:${r(cx)}px ${cy}px;transform-box:view-box"><line x1="${r(cx)}" y1="${cy}" x2="${r(cx)}" y2="${cy - 40}" stroke="${C.yellow}" stroke-width="3" stroke-linecap="round" filter="url(#gl)"/></g>
<circle cx="${r(cx)}" cy="${cy}" r="6" fill="${C.red}"/>${t(cx, cy + 34, 'RPM ×1000', { font: 'monob', size: 9, fill: '#56628C', ls: 1.5, anchor: 'middle' })}`;
    } else if (tile.vis === 'piano') {
      const kw = 20;
      const kx = cx - (kw * 9) / 2;
      const ky = y + 50;
      for (let k = 0; k < 9; k++) v += `<rect class="key" x="${r(kx + k * kw)}" y="${ky}" width="${kw - 2}" height="80" rx="3" fill="#F4F6FB" style="animation-delay:${r([0, 0.6, 1.2, 0.3, 1.5, 0.9, 1.8, 0.45, 1.35][k])}s"/>`;
      [0, 1, 3, 4, 5, 7].forEach((k) => (v += `<rect x="${r(kx + k * kw + 13)}" y="${ky}" width="12" height="48" rx="2" fill="#0A1230"/>`));
    } else if (tile.vis === 'game') {
      const gy = y + 92;
      v = `<rect x="${r(cx - 62)}" y="${gy - 30}" width="124" height="62" rx="31" fill="#121B38" stroke="#2C3A6B" stroke-width="2"/>
<rect x="${r(cx - 42)}" y="${gy - 4}" width="24" height="8" rx="2" fill="#56628C"/><rect x="${r(cx - 34)}" y="${gy - 12}" width="8" height="24" rx="2" fill="#56628C"/>
<circle class="blink" cx="${r(cx + 30)}" cy="${gy - 8}" r="6" fill="${C.red}"/><circle class="blink" cx="${r(cx + 44)}" cy="${gy + 4}" r="6" fill="${C.yellow}" style="animation-delay:.35s"/><circle class="blink" cx="${r(cx + 18)}" cy="${gy + 4}" r="6" fill="${C.green}" style="animation-delay:.7s"/><circle class="blink" cx="${r(cx + 30)}" cy="${gy + 16}" r="6" fill="${C.blue}" style="animation-delay:1s"/>`;
    } else {
      const by = y + 130;
      [0.9, 0.7, 1, 0.8, 0.95, 0.75].forEach((b, k) => {
        const bh = 74 * b;
        v += `<rect class="bar" x="${r(cx - 66 + k * 23)}" y="${r(by - bh)}" width="16" height="${r(bh)}" rx="3" fill="url(#acc)" style="animation-delay:${r(k * 0.12)}s"/>`;
      });
      v += t(cx, by + 20, 'RAM · CPU EN REPOSO', { font: 'monob', size: 9, fill: '#56628C', ls: 1.5, anchor: 'middle' });
    }
    body += `<g class="up" ${delay(0.15 + i * 0.12)}>
<rect x="${r(x)}" y="${y}" width="${r(tw)}" height="${h}" rx="14" fill="#0F1730" stroke="${C.line}"/>
${t(x + 18, y + 28, tile.k, { font: 'monob', size: 11, fill: C.dim, ls: 3 })}
${v}
${t(x + 18, y + h - 38, esc(tile.title), { font: 'display', size: 19, fill: C.text })}
${t(x + 18, y + h - 16, esc(tile.sub), { font: 'sans', size: 13.5, fill: C.sub })}
</g>`;
  });
  const lastX = 34 + 3 * (tw + gap);
  body += handText(lastX + tw - 10, 52, 'Windows 11 ni loco jsjs', { size: 23, delay: 1.8, rotate: -3, anchor: 'end' });
  const pianoX = 34 + (tw + gap);
  body += handText(pianoX + tw - 12, 102, 'sí, en serio', { size: 22, delay: 2.6, rotate: 6, anchor: 'end' });
  return doc({ w: W, h: H, title: 'Boxes — fuera de pista', fonts: ['display', 'sans', 'mono', 'monob', 'hand'], css, defs, body });
}
