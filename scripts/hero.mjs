import { C, doc, t, esc, measure, fit, r, glowFilter, handText, handArrow } from './lib.mjs';

const W = 1200;
const H = 400;
const LOOP = 10;
const LAP = 6;

const TRACK =
  'M 850 338 L 1050 338 Q 1125 338 1125 280 L 1125 215 Q 1125 165 1080 165 L 1035 165 ' +
  'C 1000 165 1000 212 965 212 L 915 212 Q 885 212 875 185 Q 865 160 835 160 ' +
  'Q 795 160 795 200 L 795 290 Q 795 338 850 338 Z';

const STACK = ['TYPESCRIPT', 'NEXT.JS 14', 'REACT', 'SUPABASE', 'POSTGRESQL', 'CLERK', 'TAILWIND', 'MOTION', 'EXPO', 'REACT NATIVE', 'NODE.JS', 'PYTHON', 'VERCEL'];

const pct = (s, total = LOOP) => r((s / total) * 100);

export function hero() {
  let css = '';
  let defs = `
<radialGradient id="g1" gradientUnits="userSpaceOnUse" cx="80" cy="420" r="620"><stop offset="0" stop-color="${C.red}" stop-opacity=".22"/><stop offset="1" stop-color="${C.red}" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" gradientUnits="userSpaceOnUse" cx="960" cy="230" r="420"><stop offset="0" stop-color="${C.blue}" stop-opacity=".22"/><stop offset="1" stop-color="${C.blue}" stop-opacity="0"/></radialGradient>
<linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.red}"/><stop offset="1" stop-color="${C.orange}"/></linearGradient>
<pattern id="chk" width="24" height="24" patternUnits="userSpaceOnUse">
  <rect width="24" height="24" fill="#060A16"/><rect width="12" height="12" fill="#E9E9EE"/><rect x="12" y="12" width="12" height="12" fill="#E9E9EE"/>
  <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 24" dur="1.6s" repeatCount="indefinite"/>
</pattern>
<clipPath id="tick"><rect x="104" y="356" width="1068" height="44"/></clipPath>
${glowFilter('glow', 4)}
${glowFilter('glowL', 7)}
<filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>`;

  const nx = 58;
  const ny = 204;
  const n1 = 'TKYO_';
  const n2 = '0X';
  const NS = fit(n1 + n2, 'display', 116, 680);
  const w1 = measure(n1, 'display', NS);
  const w2 = measure(n2, 'display', NS);
  defs += `<linearGradient id="hot" gradientUnits="userSpaceOnUse" x1="${r(nx + w1)}" y1="0" x2="${r(nx + w1 + w2)}" y2="0"><stop offset="0" stop-color="${C.red}"/><stop offset="1" stop-color="${C.orange}"/></linearGradient>`;
  defs += `<linearGradient id="sweep" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="190" y2="0">
<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
<animateTransform attributeName="gradientTransform" type="translate" values="-260 0;-260 0;860 0;860 0" keyTimes="0;.46;.62;1" dur="${LOOP}s" repeatCount="indefinite"/></linearGradient>`;

  const nameText = `<tspan fill="${C.text}">${n1}</tspan><tspan fill="url(#hot)">${n2}</tspan>`;
  const sub = 'Full-stack developer  ·  SaaS de punta a punta para LATAM';
  const subSize = fit(sub, 'semi', 25, 700);

  const pillsY = 316;
  let px = nx;
  const pills = [
    { label: 'STATUS: SHIPPING', color: C.green, dot: C.green },
    { label: 'CÚCUTA · CO', color: C.sub },
    { label: 'UTC−05:00', color: C.sub },
    { label: 'LAP ∞', color: C.orange },
  ]
    .map((p) => {
      const tw = measure(p.label, 'monob', 13, 1.5);
      const w = tw + 26 + (p.dot ? 16 : 0);
      const g = `<rect x="${r(px)}" y="${pillsY}" width="${r(w)}" height="30" rx="15" fill="#0F1730" stroke="${p.dot ? 'rgba(34,212,107,.35)' : C.line2}"/>
${p.dot ? `<circle class="pulse" cx="${r(px + 17)}" cy="${pillsY + 15}" r="4.5" fill="${p.dot}"/>` : ''}
${t(px + 13 + (p.dot ? 16 : 0), pillsY + 19.7, esc(p.label), { font: 'monob', size: 13, fill: p.color, ls: 1.5 })}`;
      px += w + 10;
      return g;
    })
    .join('\n');

  css += `
.pulse{animation:pulse 1.6s ease-in-out infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
.cur{animation:blink 1s steps(1) infinite;}
@keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
.fade{animation:fadeUp .9s cubic-bezier(.2,.8,.2,1) both;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
`;

  const left = `
${t(nx, 72, '<tspan fill="' + C.red + '">■</tspan>  RACE CONTROL  //  FULL-STACK DEVELOPER', { font: 'mono', size: 15, fill: '#8E98B8', ls: 3.5, cls: 'fade' })}
<g class="fade" style="animation-delay:.15s">
  <text x="${nx}" y="${ny}" class="display" font-size="${NS}" fill="${C.red}" opacity=".35" filter="url(#soft)">${n1}${n2}</text>
  <text x="${nx}" y="${ny}" class="display" font-size="${NS}">${nameText}</text>
  <text x="${nx}" y="${ny}" class="display" font-size="${NS}" fill="url(#sweep)">${n1}${n2}</text>
  <rect class="cur" x="${r(nx + w1 + w2 + 10)}" y="${ny - 14}" width="${r(NS * 0.42)}" height="14" fill="${C.red}"/>
</g>
${t(nx, 256, esc(sub), { font: 'semi', size: subSize, fill: '#D5DAEA', cls: 'fade', extra: 'style="animation-delay:.3s"' })}
${t(nx, 292, `P1 mindset — <tspan fill="${C.orange}">build fast</tspan>, ship clean.`, { font: 'mono', size: 18, fill: '#9AA3C2', cls: 'fade', extra: 'style="animation-delay:.45s"' })}
<g class="fade" style="animation-delay:.6s">${pills}</g>
${handText(nx + w1 + w2 - 64, 112, 'ese soy yo', { size: 32, delay: 1.4, rotate: -5, anchor: 'end' })}
${handArrow(nx + w1 + w2 - 58, 100, nx + w1 + w2 - 26, 126, { bend: -0.45, delay: 2.0, head: 11 })}`;

  let streaks = '';
  [
    [98, 220, 0],
    [150, 160, 0.02],
    [232, 280, 0.01],
    [276, 140, 0.035],
    [338, 200, 0.015],
    [120, 120, 0.05],
  ].forEach(([y, len, d], i) => {
    const a = 46 + d * 100;
    css += `.sk${i}{animation:sk${i} ${LOOP}s linear infinite;}
@keyframes sk${i}{0%,${r(a - 0.1)}%{transform:translateX(-320px);opacity:0}${r(a)}%{opacity:1}${r(a + 12)}%{transform:translateX(1250px);opacity:0}100%{transform:translateX(1250px);opacity:0}}`;
    streaks += `<rect class="sk${i}" x="0" y="${y}" width="${len}" height="2" rx="1" fill="url(#streak)"/>`;
  });
  defs += `<linearGradient id="streak" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.orange}" stop-opacity="0"/><stop offset="1" stop-color="${C.orange}" stop-opacity=".9"/></linearGradient>`;

  const gx = 822;
  const gy = 26;
  let lights = `<rect x="${gx - 14}" y="${gy + 34}" width="${5 * 46 + 4 * 12 + 28}" height="14" rx="4" fill="#121B38" stroke="${C.line}"/>`;
  for (let i = 0; i < 5; i++) {
    const x = gx + i * 58;
    const on = 0.7 + i * 0.75;
    css += `.l${i}{animation:l${i} ${LOOP}s infinite;}
@keyframes l${i}{0%,${r(pct(on) - 0.2)}%{opacity:0}${pct(on)}%,45.9%{opacity:1}46%,100%{opacity:0}}`;
    lights += `<rect x="${x}" y="${gy}" width="46" height="84" rx="11" fill="#0D1430" stroke="#26335E"/>
<circle cx="${x + 23}" cy="${gy + 22}" r="13" fill="#18224A"/><circle cx="${x + 23}" cy="${gy + 60}" r="13" fill="#18224A"/>
<g class="l${i}" filter="url(#glowL)"><circle cx="${x + 23}" cy="${gy + 22}" r="12" fill="#FF1E3C"/><circle cx="${x + 23}" cy="${gy + 60}" r="12" fill="#FF1E3C"/></g>`;
  }
  css += `.lo{animation:lo ${LOOP}s infinite;}
@keyframes lo{0%,45.9%{opacity:0;transform:translateY(6px)}47%,74%{opacity:1;transform:none}80%,100%{opacity:0}}
.lc{animation:lc ${LOOP}s infinite;}
@keyframes lc{0%,45.9%{opacity:1}46%,100%{opacity:0}}`;
  const gcx = gx + (5 * 46 + 4 * 12) / 2;
  lights += t(gcx, gy + 112, 'LIGHTS OUT AND AWAY WE GO', { font: 'monob', size: 14, fill: C.orange, ls: 3, anchor: 'middle', cls: 'lo' });
  lights += t(gcx, gy + 112, 'FORMATION LAP · STANDBY', { font: 'mono', size: 13, fill: '#56628C', ls: 3, anchor: 'middle', cls: 'lc' });

  css += `
.s1{animation:s1 ${LAP}s linear infinite;}.s2{animation:s2 ${LAP}s linear infinite;}.s3{animation:s3 ${LAP}s linear infinite;}
@keyframes s1{0%,32.5%{opacity:0}34%,93%{opacity:1}100%{opacity:0}}
@keyframes s2{0%,65.8%{opacity:0}67.3%,97%{opacity:1}100%{opacity:0}}
@keyframes s3{0%,30%{opacity:1}34%,100%{opacity:0}}
.fl{animation:fl ${LAP}s linear infinite;}
@keyframes fl{0%,26%{opacity:1}30%,100%{opacity:0}}
.lt{animation:lt ${LAP}s linear infinite;}
@keyframes lt{0%,26%{fill:${C.purple}}30%,100%{fill:${C.text}}}`;
  const trackLen = 999;
  const seg = 333;
  const circuit = `
<path d="${TRACK}" stroke="#121B38" stroke-width="16" stroke-linejoin="round"/>
<path d="${TRACK}" stroke="#22305A" stroke-width="1.5" stroke-dasharray="7 9"/>
<path d="${TRACK}" pathLength="${trackLen}" stroke="${C.purple}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${seg} ${trackLen - seg}" class="s1" filter="url(#glow)"/>
<path d="${TRACK}" pathLength="${trackLen}" stroke="${C.green}" stroke-width="4" stroke-linecap="round" stroke-dasharray="0 ${seg} ${seg} ${trackLen - 2 * seg}" class="s2" filter="url(#glow)"/>
<path d="${TRACK}" pathLength="${trackLen}" stroke="${C.purple}" stroke-width="4" stroke-linecap="round" stroke-dasharray="0 ${2 * seg} ${trackLen - 2 * seg} 0" class="s3" filter="url(#glow)"/>
<rect x="846" y="330" width="8" height="16" fill="url(#chk2)"/>
<path d="${TRACK}" pathLength="${trackLen}" stroke="${C.orange}" stroke-opacity=".35" stroke-width="7" stroke-linecap="round" stroke-dasharray="130 ${trackLen - 130}">
  <animate attributeName="stroke-dashoffset" from="130" to="${130 - trackLen}" dur="${LAP}s" repeatCount="indefinite"/>
</path>
<path d="${TRACK}" pathLength="${trackLen}" stroke="#FFF1B8" stroke-width="3" stroke-linecap="round" stroke-dasharray="45 ${trackLen - 45}" filter="url(#glow)">
  <animate attributeName="stroke-dashoffset" from="45" to="${45 - trackLen}" dur="${LAP}s" repeatCount="indefinite"/>
</path>
<g filter="url(#glow)">
  <animateMotion dur="${LAP}s" repeatCount="indefinite" rotate="auto" path="${TRACK}"/>
  <rect x="-13" y="-4" width="25" height="8" rx="4" fill="#22337A"/>
  <rect x="-9" y="-1.2" width="16" height="2.4" rx="1.2" fill="${C.red}"/>
  <circle cx="11.5" cy="0" r="2.3" fill="${C.yellow}"/>
  <rect x="9" y="-7.5" width="3.5" height="15" rx="1" fill="${C.red}"/>
  <rect x="-15" y="-6.5" width="3.5" height="13" rx="1" fill="${C.red}"/>
  <circle cx="-3" cy="0" r="2.2" fill="#060A16"/>
</g>
${t(960, 250, 'CIRCUITO CÚCUTA', { font: 'mono', size: 12, fill: '#56628C', ls: 3, anchor: 'middle' })}
${t(960, 288, '1:21.0X', { font: 'monob', size: 30, fill: C.text, anchor: 'middle', cls: 'lt' })}
${t(960, 312, 'FASTEST LAP', { font: 'monob', size: 12, fill: C.purple, ls: 3, anchor: 'middle', cls: 'fl' })}
<g font-size="11">
  ${t(1137, 248, 'S1', { font: 'monob', size: 11, fill: '#56628C' })}
  ${t(948, 205, 'S2', { font: 'monob', size: 11, fill: '#56628C' })}
  ${t(770, 248, 'S3', { font: 'monob', size: 11, fill: '#56628C' })}
</g>`;
  defs += `<pattern id="chk2" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#060A16"/><rect width="2" height="2" fill="#fff"/><rect x="2" y="2" width="2" height="2" fill="#fff"/></pattern>`;

  const tickSize = 14;
  const tickLs = 2;
  const sep = '   /   ';
  const copyW = measure(STACK.join(sep) + sep, 'mono', tickSize, tickLs);
  const copy = STACK.map((s) => esc(s)).join(`<tspan fill="${C.red}">${sep}</tspan>`) + `<tspan fill="${C.red}">${sep}</tspan>`;
  css += `.tk{animation:tk 38s linear infinite;}@keyframes tk{from{transform:translateX(0)}to{transform:translateX(-${r(copyW)}px)}}
.live{animation:pulse 1.2s ease-in-out infinite;}`;
  const ticker = `
<rect x="0" y="356" width="${W}" height="44" fill="#0A1026"/>
<line x1="0" y1="356.5" x2="${W}" y2="356.5" stroke="${C.line}"/>
<g clip-path="url(#tick)"><g class="tk">
  ${[0, 1, 2].map((k) => t(110 + k * copyW, 383, copy, { font: 'mono', size: tickSize, fill: '#8E98B8', ls: tickLs, extra: 'xml:space="preserve"' })).join('\n  ')}
</g></g>
<rect x="18" y="365" width="74" height="26" rx="5" fill="${C.red}"/>
<circle class="pulse" cx="33" cy="378" r="4" fill="#fff"/>
${t(43, 383, 'LIVE', { font: 'monob', size: 13, fill: '#fff', ls: 2.5 })}`;

  const body = `
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<rect width="${W}" height="${H}" fill="url(#g1)"/>
<rect width="${W}" height="${H}" fill="url(#g2)"/>
<g stroke="#fff" stroke-opacity=".028">${[120, 240, 360, 480, 600, 720].map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="356"/>`).join('')}</g>
${streaks}
${left}
${lights}
${circuit}
${ticker}
<rect x="0" y="0" width="6" height="356" fill="url(#bar)"/>
<rect x="1176" y="0" width="24" height="356" fill="url(#chk)"/>
<rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="17.5" stroke="${C.line}" stroke-width="1.5"/>`;

  return doc({
    w: W,
    h: H,
    title: 'Tkyo_0x — Full-stack developer · SaaS de punta a punta para LATAM',
    fonts: ['display', 'semi', 'mono', 'monob', 'hand'],
    css,
    defs,
    body,
  });
}
