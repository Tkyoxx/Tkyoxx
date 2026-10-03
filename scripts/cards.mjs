import { C, doc, t, esc, measure, fit, r, cardBg, glowDef, accentGrad, glowFilter, icon, handCircle, handArrow, handText, handUnderline } from './lib.mjs';

const BASE_CSS = `
.pulse{animation:pulse 1.6s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
.in{animation:in .8s cubic-bezier(.2,.8,.2,1) both;}
@keyframes in{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:none}}
.up{animation:up .8s cubic-bezier(.2,.8,.2,1) both;}
@keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
`;
const delay = (s) => `style="animation-delay:${r(s)}s"`;

const RADIO = [
  ['ING', 'Box, box. ¿Cómo va ese deploy?'],
  ['P', 'Todo verde en producción. Simply lovely.'],
  ['ING', 'Copy. ¿Quién te enseñó a manejar así?'],
  ['P', 'Nadie. Tutoriales, docs y mucho prueba y error.'],
  ['ING', '¿Y si alguien quiere construir algo contigo?'],
  ['P', 'Que me escriba. Siempre hay sitio en la parrilla.'],
]

export function radio() {
  const W = 1200;
  const H = 150;
  const SLOT = 4.2;
  const TOTAL = SLOT * RADIO.length;
  const size = 24;
  const cw = measure('M', 'mono', size);
  const mx = 372;
  const my = 106;
  const kt = (s) => r(s / TOTAL);

  let css = BASE_CSS + `
.wv{animation:wv 1s ease-in-out infinite;transform-box:fill-box;transform-origin:center;}
@keyframes wv{0%,100%{transform:scaleY(.2)}50%{transform:scaleY(1)}}
.cb{animation:cb .9s steps(1) infinite;}@keyframes cb{0%,49%{opacity:1}50%,100%{opacity:0}}`;

  let speakers = '';
  let msgs = '';
  let defs = glowDef(240, 75, 420, C.red, 0.12);
  RADIO.forEach(([who, text], i) => {
    const msg = text;
    const chars = [...msg].length + 2;
    const s0 = i * SLOT + 0.25;
    const typeEnd = s0 + Math.min(1.7, chars * 0.04);
    const s1 = (i + 1) * SLOT - 0.3;
    const sEnd = (i + 1) * SLOT - 0.05;
    const visT = [0, kt(s0), kt(s0 + 0.01), kt(s1), kt(sEnd), 1].join(';');
    const visV = '0;0;1;1;0;0';
    const times = [0, kt(s0)];
    const widths = [0, 0];
    for (let k = 1; k <= chars; k++) {
      times.push(kt(s0 + ((typeEnd - s0) * k) / chars));
      widths.push(r(k * cw + 2));
    }
    const fullW = r(chars * cw + 4);
    const isP = who === 'P';
    defs += `<clipPath id="ty${i}"><rect x="${mx}" y="${my - 30}" height="44" width="0">
<animate attributeName="width" values="${widths.join(';')};${fullW}" keyTimes="${times.join(';')};1" calcMode="discrete" dur="${TOTAL}s" repeatCount="indefinite"/></rect></clipPath>`;
    msgs += `<g opacity="0"><animate attributeName="opacity" values="${visV}" keyTimes="${visT}" dur="${TOTAL}s" repeatCount="indefinite"/>
<g clip-path="url(#ty${i})">${t(mx, my, `<tspan fill="${C.dim}">“</tspan>${esc(msg)}<tspan fill="${C.dim}">”</tspan>`, { font: 'mono', size, fill: isP ? C.text : '#C9CFE2' })}</g>
<rect class="cb" y="${my - 21}" width="${r(cw * 0.6)}" height="26" fill="${isP ? C.red : '#E4E4EA'}" x="${mx}">
<animate attributeName="x" values="${widths.map((w) => r(mx + w + 2)).join(';')};${r(mx + fullW + 2)}" keyTimes="${times.join(';')};1" calcMode="discrete" dur="${TOTAL}s" repeatCount="indefinite"/></rect>
</g>`;
    const name = isP ? 'TKYO_0X' : 'INGENIERO';
    const color = isP ? C.red : '#E4E4EA';
    speakers += `<g opacity="0"><animate attributeName="opacity" values="${visV}" keyTimes="${visT}" dur="${TOTAL}s" repeatCount="indefinite"/>
<rect x="0" y="0" width="8" height="${H}" fill="${color}"/>
${t(36, 58, name, { font: 'display', size: 30, fill: isP ? C.text : '#E4E4EA' })}
${t(mx, 56, isP ? 'PILOTO → MURO DE BOXES' : 'MURO DE BOXES → PILOTO', { font: 'monob', size: 13, fill: color, ls: 3 })}
</g>`;
  });

  let wave = '';
  const bars = 34;
  for (let i = 0; i < bars; i++) {
    const h = 6 + Math.abs(Math.sin(i * 1.7) * 26) + (i % 3) * 3;
    const d = 0.55 + ((i * 37) % 60) / 100;
    wave += `<rect class="wv" x="${36 + i * 7.6}" y="${r(112 - h / 2)}" width="4" height="${r(h)}" rx="2" fill="url(#wvg)" style="animation-duration:${r(d)}s;animation-delay:-${r((i * 0.13) % 1)}s"/>`;
  }
  defs += `<linearGradient id="wvg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.red}"/><stop offset="1" stop-color="${C.orange}"/></linearGradient>`;

  const body = `${cardBg(W, H)}
<rect x="0" y="0" width="334" height="${H}" fill="#0D1430"/>
<line x1="334" y1="0" x2="334" y2="${H}" stroke="${C.line}"/>
${t(36, 82, 'TEAM RADIO', { font: 'mono', size: 13, fill: C.dim, ls: 5 })}
${wave}
${speakers}
${msgs}
<circle class="pulse" cx="1120" cy="51" r="5" fill="${C.red}"/>
${t(1134, 56, 'CH·0X', { font: 'monob', size: 13, fill: C.dim, ls: 2 })}
<rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="17.5" stroke="${C.line}" stroke-width="1.5"/>`;

  return doc({ w: W, h: H, title: 'Team radio — Tkyo_0x', fonts: ['display', 'mono', 'monob'], css, defs, body });
}

export function driver() {
  const W = 600;
  const H = 380;
  const rows = [
    ['PAÍS', 'Colombia — Cúcuta', true],
    ['FORMACIÓN', 'Autodidacta'],
    ['ESPECIALIDAD', 'SaaS de punta a punta'],
    ['MONOPLAZA', 'Next.js · Supabase · Expo'],
    ['REFERENTE', 'Max Verstappen'],
  ];
  const css = BASE_CSS + `
.trace{animation:trace 5s linear infinite;}@keyframes trace{from{stroke-dashoffset:0}to{stroke-dashoffset:-520}}`;
  const defs = glowDef(560, 40, 380, C.red, 0.16) + accentGrad('acc') + glowFilter('gl', 3);
  let body = cardBg(W, H);
  body += `<rect x="0" y="0" width="7" height="${H / 2}" fill="#FCD116"/><rect x="0" y="${H / 2}" width="7" height="${H / 4}" fill="#003893"/><rect x="0" y="${(H * 3) / 4}" width="7" height="${H / 4}" fill="#CE1126"/>`;
  body += `<text x="572" y="172" text-anchor="end" class="display" font-size="168" stroke="#1F2B52" stroke-width="2">0X</text>
<text x="572" y="172" text-anchor="end" class="display trace" font-size="168" stroke="url(#acc)" stroke-width="2.2" stroke-dasharray="70 190" filter="url(#gl)">0X</text>`;
  body += t(34, 48, 'FICHA DEL PILOTO', { font: 'monob', size: 13, fill: C.red, ls: 4, cls: 'in' });
  body += t(34, 104, 'TKYO_0X', { font: 'display', size: 50, fill: C.text, cls: 'in', extra: delay(0.1) });
  body += t(36, 134, '@Tkyoxx  ·  Full-stack  ·  Founder', { font: 'mono', size: 15, fill: C.dim, cls: 'in', extra: delay(0.2) });
  body += `<line x1="34" y1="158" x2="566" y2="158" stroke="${C.line}"/>`;
  rows.forEach(([k, v, flag], i) => {
    const y = 196 + i * 40;
    body += `<g class="in" ${delay(0.3 + i * 0.1)}>`;
    body += t(34, y, k, { font: 'mono', size: 13, fill: C.dim, ls: 2.5 });
    let vx = 196;
    if (flag) {
      body += `<g transform="translate(${vx} ${y - 15})"><rect width="28" height="18" rx="3" fill="#CE1126"/><rect width="28" height="13.5" rx="3" fill="#003893"/><rect width="28" height="9" rx="3" fill="#FCD116"/><rect y="6" width="28" height="3" fill="#FCD116"/></g>`;
      vx += 40;
    }
    body += t(vx, y, esc(v), { font: 'semi', size: 19, fill: C.text });
    body += `</g>`;
    if (i < rows.length - 1) body += `<line x1="34" y1="${y + 15}" x2="566" y2="${y + 15}" stroke="${C.line}" stroke-opacity=".6" stroke-dasharray="2 5"/>`;
  });
  const aw = measure('Autodidacta', 'semi', 19);
  body += handCircle(196 + aw / 2, 230, aw / 2 + 16, 19, { seed: 7, delay: 1.3 });
  body += handArrow(398, 210, 196 + aw + 24, 226, { bend: -0.3, delay: 2.2 });
  body += handText(404, 212, 'nadie me enseñó', { size: 26, delay: 2.9, rotate: -6 });
  return doc({ w: W, h: H, title: 'Ficha del piloto — Tkyo_0x', fonts: ['display', 'semi', 'mono', 'monob', 'hand'], css, defs, body });
}

const RULES = [
  ['Iterar rápido', 'Prefiero algo vivo hoy que perfecto nunca.'],
  ['Cuidar el detalle', 'La diferencia entre P1 y P2 está en las décimas.'],
  ['Enviar', 'Si no está en producción, no cuenta.'],
];

export function rules() {
  const W = 600;
  const H = 380;
  const css = BASE_CSS + `
.trace{animation:trace 4s linear infinite;}@keyframes trace{from{stroke-dashoffset:0}to{stroke-dashoffset:-300}}`;
  const defs = glowDef(80, 360, 380, C.blue, 0.2) + accentGrad('acc') + glowFilter('gl', 3);
  let body = cardBg(W, H);
  body += t(34, 48, 'CÓMO MANEJO', { font: 'monob', size: 13, fill: C.red, ls: 4 });
  body += t(566, 48, 'REGLAS DEL PILOTO', { font: 'mono', size: 13, fill: C.dim, ls: 3, anchor: 'end' });
  body += `<line x1="34" y1="70" x2="566" y2="70" stroke="${C.line}"/>`;
  RULES.forEach(([title, line], i) => {
    const y = 122 + i * 92;
    const num = String(i + 1).padStart(2, '0');
    body += `<g class="up" ${delay(0.2 + i * 0.15)}>
<text x="34" y="${y + 18}" class="display" font-size="58" stroke="${C.line2}" stroke-width="1.5">${num}</text>
<text x="34" y="${y + 18}" class="display trace" font-size="58" stroke="url(#acc)" stroke-width="1.8" stroke-dasharray="40 110" style="animation-delay:-${i * 1.3}s">${num}</text>
${t(132, y - 4, esc(title.toUpperCase()), { font: 'display', size: 25, fill: C.text })}
${t(133, y + 24, esc(line), { font: 'sans', size: 17, fill: C.sub })}
</g>`;
    if (i < RULES.length - 1) body += `<line x1="132" y1="${y + 46}" x2="566" y2="${y + 46}" stroke="${C.line}" stroke-dasharray="2 5"/>`;
  });
  const ew = measure('ENVIAR', 'display', 25);
  body += handUnderline(132, 309, ew + 6, { seed: 11, delay: 1.4, color: C.red, width: 3 });
  body += handArrow(400, 292, 132 + ew + 22, 300, { bend: 0.25, delay: 2.0 });
  body += handText(408, 290, 'la que más importa', { size: 25, delay: 2.6, rotate: -5 });
  return doc({ w: W, h: H, title: 'Cómo manejo — reglas del piloto', fonts: ['display', 'sans', 'mono', 'monob', 'hand'], css, defs, body });
}

const COMPOUNDS = [
  {
    key: 'S', name: 'SOFT', color: '#FF2A1F', note: ['Máximo grip.', 'Lo uso a diario.'], speed: 2.2,
    items: [['typescript', 'TypeScript', '#3178C6'], ['nextdotjs', 'Next.js', '#FFFFFF'], ['react', 'React', '#61DAFB'], ['supabase', 'Supabase', '#3FCF8E']],
  },
  {
    key: 'M', name: 'MEDIUM', color: '#FFD12E', note: ['Rendimiento', 'constante.'], speed: 3.2,
    items: [['postgresql', 'PostgreSQL', '#6F94F2'], ['tailwindcss', 'Tailwind', '#22C3E6'], ['clerk', 'Clerk', '#8B6CFF'], ['framer', 'Motion', '#FFFFFF']],
  },
  {
    key: 'H', name: 'HARD', color: '#F2F2F5', note: ['Larga distancia,', 'cero degradación.'], speed: 4.4,
    items: [['expo', 'Expo / RN', '#FFFFFF'], ['nodedotjs', 'Node.js', '#6CC24A'], ['python', 'Python', '#FFD43B'], ['vercel', 'Vercel', '#FFFFFF']],
  },
];

function tyre(cx, cy, color, letter, speed) {
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return `<line x1="${r(cx + Math.cos(a) * 44)}" y1="${r(cy + Math.sin(a) * 44)}" x2="${r(cx + Math.cos(a) * 50)}" y2="${r(cy + Math.sin(a) * 50)}"/>`;
  }).join('');
  return `<g>
<circle cx="${cx}" cy="${cy}" r="52" fill="#04060E" stroke="#1B2648" stroke-width="2"/>
<g class="spin" style="animation-duration:${speed}s">
  <g stroke="#1F2B52" stroke-width="3">${ticks}</g>
  <circle cx="${cx}" cy="${cy}" r="35" stroke="${color}" stroke-width="5" stroke-dasharray="40 15" />
  <circle cx="${cx}" cy="${cy}" r="29" stroke="#2A3866" stroke-width="1" stroke-dasharray="3 4"/>
</g>
<circle cx="${cx}" cy="${cy}" r="22" fill="#111A33" stroke="#2C3A6B"/>
${t(cx, cy + 9, letter, { font: 'display', size: 24, fill: color, anchor: 'middle' })}
</g>`;
}

export function stack() {
  const W = 1200;
  const top = 66;
  const rowH = 128;
  const H = top + rowH * 3 + 14;
  const chipX = 372;
  const chipW = (W - 30 - chipX - 3 * 14) / 4;
  const chipH = 76;
  let css = BASE_CSS + `
.spin{animation:spin 3s linear infinite;}@keyframes spin{to{transform:rotate(360deg)}}
.sw{animation:sw 5s ease-in-out infinite;}
@keyframes sw{0%,55%{transform:translateX(-200px)}100%{transform:translateX(1000px)}}`;
  let defs = glowDef(80, 230, 420, C.red, 0.13) +
    `<linearGradient id="sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  let body = cardBg(W, H);
  body += t(34, 42, 'PIT WALL  //  SELECCIÓN DE COMPUESTOS', { font: 'monob', size: 13, fill: C.red, ls: 4 });
  body += t(W - 34, 42, '3 COMPUESTOS · 12 HERRAMIENTAS', { font: 'mono', size: 13, fill: C.dim, ls: 3, anchor: 'end' });
  COMPOUNDS.forEach((c, ri) => {
    const y0 = top + ri * rowH;
    const cy = y0 + rowH / 2;
    if (ri > 0) body += `<line x1="34" y1="${y0}" x2="${W - 34}" y2="${y0}" stroke="${C.line}" stroke-dasharray="2 6"/>`;
    body += tyre(96, cy, c.color, c.key, c.speed);
    body += t(172, cy - 8, c.name, { font: 'display', size: 30, fill: c.color });
    body += t(173, cy + 18, esc(c.note[0]), { font: 'mono', size: 14, fill: C.sub });
    body += t(173, cy + 38, esc(c.note[1]), { font: 'mono', size: 14, fill: C.dim });
    let clip = '';
    c.items.forEach(([ic, label, col], i) => {
      const x = chipX + i * (chipW + 14);
      const y = cy - chipH / 2;
      clip += `<rect x="${r(x)}" y="${r(y)}" width="${r(chipW)}" height="${chipH}" rx="14"/>`;
      const ls = fit(label, 'semi', 19, chipW - 82);
      body += `<g class="up" ${delay(0.15 + ri * 0.18 + i * 0.07)}>
<rect x="${r(x)}" y="${r(y)}" width="${r(chipW)}" height="${chipH}" rx="14" fill="#0F1730" stroke="${C.line2}"/>
<rect x="${r(x + 14)}" y="${r(y + chipH - 3)}" width="${r(chipW - 28)}" height="3" rx="1.5" fill="${c.color}" opacity=".85"/>
<rect x="${r(x + 16)}" y="${r(y + 16)}" width="44" height="44" rx="11" fill="#131D3B" stroke="#24305A"/>
${icon(ic, x + 26, y + 26, 24, col)}
${t(x + 74, cy + 7, esc(label), { font: 'semi', size: ls, fill: C.text })}
</g>`;
    });
    defs += `<clipPath id="row${ri}">${clip}</clipPath>`;
    body += `<g clip-path="url(#row${ri})"><rect class="sw" style="animation-delay:${ri * 0.6}s" x="${chipX}" y="${y0}" width="180" height="${rowH}" fill="url(#sh)" transform="skewX(-20)"/></g>`;
  });
  body += handText(560, 50, 'lo que más uso', { size: 26, delay: 1.6, rotate: -3 });
  body += handArrow(712, 44, 760, 84, { bend: -0.35, delay: 2.3 });
  return doc({ w: W, h: H, title: 'Stack técnico — compuestos de neumáticos', fonts: ['display', 'semi', 'mono', 'monob', 'hand'], css, defs, body });
}

function flag(x0, y0, mirror) {
  const cols = 10;
  const rows = 6;
  const s = 17;
  let g = '';
  for (let c = 0; c < cols; c++) {
    const cc = mirror ? cols - 1 - c : c;
    let cells = '';
    for (let rr = 0; rr < rows; rr++) {
      cells += `<rect x="${x0 + c * s}" y="${y0 + rr * s}" width="${s}" height="${s}" fill="${(cc + rr) % 2 ? '#060A16' : '#EDEDF1'}"/>`;
    }
    g += `<g class="wave" style="animation-delay:-${r(cc * 0.12)}s;opacity:${r(1 - (cc % 3) * 0.06)}">${cells}</g>`;
  }
  const poleX = mirror ? x0 + cols * s + 2 : x0 - 8;
  return `<rect x="${poleX}" y="${y0 - 8}" width="6" height="${rows * s + 70}" rx="3" fill="#C9C9D0"/>${g}`;
}

export function footer() {
  const W = 1200;
  const H = 200;
  const css = BASE_CSS + `
.wave{animation:wave 1.4s ease-in-out infinite;}
@keyframes wave{0%,100%{transform:translateY(-6px)}50%{transform:translateY(6px)}}
.run{animation:run 3.5s linear infinite;}@keyframes run{from{stroke-dashoffset:0}to{stroke-dashoffset:-1400}}`;
  const defs = glowDef(600, 220, 520, C.red, 0.2) + accentGrad('acc') + glowFilter('gl', 4) +
    `<linearGradient id="ggt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C3CAE0"/></linearGradient>`;
  const body = `${cardBg(W, H)}
${flag(74, 40, false)}
${flag(W - 74 - 170, 40, true)}
${t(600, 104, 'GG · SHIP IT', { font: 'display', size: 56, fill: 'url(#ggt)', anchor: 'middle' })}
${t(600, 140, 'Gracias por pasar por el pit — nos vemos en la próxima vuelta.', { font: 'mono', size: 15, fill: C.sub, anchor: 'middle' })}
${t(600, 170, 'TKYO_0X  ·  CÚCUTA, CO  ·  2026', { font: 'monob', size: 12, fill: C.red, ls: 4, anchor: 'middle' })}
<line x1="0" y1="196" x2="${W}" y2="196" stroke="url(#acc)" stroke-width="3" stroke-dasharray="180 520" class="run" filter="url(#gl)"/>`;
  return doc({ w: W, h: H, title: 'GG · Ship it', fonts: ['display', 'mono', 'monob'], css, defs, body });
}

function button({ w, h, label, sub, iconName, fill, glow, title }) {
  const css = `
.sh{animation:sh 3.6s ease-in-out infinite;}
@keyframes sh{0%,55%{transform:translateX(-160px)}100%{transform:translateX(${w + 160}px)}}
.pulse{animation:pulse 1.6s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}`;
  const defs = `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">${fill}</linearGradient>
<linearGradient id="shg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="glowR" cx=".15" cy="0" r="1.1"><stop offset="0" stop-color="${glow}" stop-opacity=".55"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>`;
  const ls = fit(label, 'display', 22, w - 120);
  const body = `<rect width="${w}" height="${h}" fill="url(#bg)"/>
<rect width="${w}" height="${h}" fill="url(#glowR)"/>
<rect class="sh" x="-140" y="0" width="120" height="${h}" fill="url(#shg)" transform="skewX(-20)"/>
<rect x="18" y="${h / 2 - 22}" width="44" height="44" rx="12" fill="rgba(0,0,0,.22)"/>
${icon(iconName, 28, h / 2 - 12, 24, '#fff')}
${t(78, h / 2 + 1, esc(label), { font: 'display', size: ls, fill: '#fff' })}
${t(79, h / 2 + 21, esc(sub), { font: 'monob', size: 11, fill: 'rgba(255,255,255,.75)', ls: 2 })}
<circle class="pulse" cx="${w - 26}" cy="${h / 2}" r="5" fill="#fff"/>
<rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="17.25" stroke="rgba(255,255,255,.18)" stroke-width="1.5"/>`;
  return doc({ w, h, title, fonts: ['display', 'monob'], css, defs, body });
}

export const ctaGrid = () =>
  button({
    w: 520,
    h: 84,
    label: 'TOMA TU LUGAR EN LA PARRILLA',
    sub: 'UN CLIC · TU AVATAR APARECE AQUÍ',
    iconName: 'github',
    fill: `<stop offset="0" stop-color="${C.red}"/><stop offset="1" stop-color="#9E0020"/>`,
    glow: C.yellow,
    title: 'Toma tu lugar en la parrilla',
  });

export const ctaDiscord = () =>
  button({
    w: 520,
    h: 84,
    label: 'BOX, BOX: ESCRÍBEME',
    sub: 'DISCORD · TKYO_0X',
    iconName: 'discord',
    fill: `<stop offset="0" stop-color="#2B3FA8"/><stop offset="1" stop-color="#16225E"/>`,
    glow: C.blue,
    title: 'Escríbeme por Discord',
  });
