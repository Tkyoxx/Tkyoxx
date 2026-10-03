import { C, doc, t, esc, measure, r, cardBg, glowDef, accentGrad, glowFilter, handText, handCircle } from './lib.mjs';

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

async function viaGraphQL(login, token) {
  const query = `query($login:String!){user(login:$login){
    repositories(ownerAffiliations:OWNER,privacy:PUBLIC){totalCount}
    contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': login },
    body: JSON.stringify({ query, variables: { login } }),
  });
  const json = await res.json();
  if (!json.data?.user) throw new Error(JSON.stringify(json.errors ?? json));
  const u = json.data.user;
  const days = u.contributionsCollection.contributionCalendar.weeks
    .flatMap((w) => w.contributionDays)
    .map((d) => ({ date: d.date, count: d.contributionCount }));
  return { days, repos: u.repositories.totalCount };
}

async function viaPublicPage(login) {
  const html = await (await fetch(`https://github.com/users/${login}/contributions`, { headers: { 'User-Agent': login } })).text();
  const dates = {};
  for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*?id="(contribution-day-component-[\d-]+)"/g)) dates[m[2]] = m[1];
  for (const m of html.matchAll(/id="(contribution-day-component-[\d-]+)"[^>]*?data-date="(\d{4}-\d{2}-\d{2})"/g)) dates[m[1]] = m[2];
  const counts = {};
  for (const m of html.matchAll(/for="(contribution-day-component-[\d-]+)"[^>]*>([^<]*)</g)) {
    const n = m[2].match(/^(\d[\d,]*) contribution/);
    counts[m[1]] = n ? Number(n[1].replace(/,/g, '')) : 0;
  }
  const days = Object.entries(dates)
    .map(([id, date]) => ({ date, count: counts[id] ?? 0 }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const user = await (await fetch(`https://api.github.com/users/${login}`, { headers: { 'User-Agent': login } })).json();
  return { days, repos: user.public_repos ?? 0 };
}

export async function fetchStats(login, token) {
  const raw = token ? await viaGraphQL(login, token) : await viaPublicPage(login);
  const today = new Date().toISOString().slice(0, 10);
  const days = raw.days.filter((d) => d.date <= today);
  const total = days.reduce((a, d) => a + d.count, 0);
  const active = days.filter((d) => d.count > 0).length;

  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let current = 0;
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  while (i >= 0 && days[i].count > 0) {
    current++;
    i--;
  }
  const bestDay = days.reduce((b, d) => (d.count > b.count ? d : b), { count: 0, date: '' });

  const weeks = [];
  for (let k = 0; k < days.length; k += 7) weeks.push(days.slice(k, k + 7).reduce((a, d) => a + d.count, 0));

  const months = [];
  const end = new Date(today + 'T00:00:00Z');
  for (let k = 11; k >= 0; k--) {
    const m = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - k, 1));
    const key = m.toISOString().slice(0, 7);
    months.push({ label: MONTHS[m.getUTCMonth()], count: days.filter((d) => d.date.startsWith(key)).reduce((a, d) => a + d.count, 0) });
  }

  return { total, active, longest, current, bestDay, weeks, months, repos: raw.repos, updated: new Date().toISOString() };
}

export function telemetry(s) {
  const W = 1200;
  const H = 478;
  const css = `
.pulse{animation:pulse 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}
.roll{animation:roll .9s cubic-bezier(.2,.9,.2,1) both;}
@keyframes roll{from{transform:translateY(34px);opacity:0}to{transform:none;opacity:1}}
.draw{animation:draw 2.6s cubic-bezier(.4,0,.2,1) .3s both;}
@keyframes draw{from{stroke-dashoffset:3000}to{stroke-dashoffset:0}}
.area{animation:area 1.6s ease 1.6s both;}
@keyframes area{from{opacity:0}to{opacity:1}}
.sec{animation:sec .6s cubic-bezier(.2,.8,.2,1) both;transform-box:fill-box;transform-origin:bottom;}
@keyframes sec{from{transform:scaleY(0);opacity:0}to{transform:none;opacity:1}}
.fast{animation:fast 2s ease-in-out infinite;}
@keyframes fast{0%,100%{opacity:1}50%{opacity:.45}}`;

  const rows = [
    ['CONTRIBUCIONES', s.total, '', C.red],
    ['DÍAS EN PISTA', s.active, '', C.orange],
    ['RACHA ACTUAL', s.current, s.current === 1 ? 'día' : 'días', C.green],
    ['RACHA MÁXIMA', s.longest, s.longest === 1 ? 'día' : 'días', C.purple],
    ['MEJOR DÍA', s.bestDay.count, s.bestDay.date ? fmtDate(s.bestDay.date) : '', C.yellow],
    ['REPOS PÚBLICOS', s.repos, '', '#E4E4EA'],
  ];

  const defs =
    glowDef(800, 200, 600, C.red, 0.12) +
    accentGrad('acc') +
    glowFilter('gl', 3) +
    `<linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.red}" stop-opacity=".45"/><stop offset="1" stop-color="${C.red}" stop-opacity="0"/></linearGradient>
<clipPath id="rows">${rows.map((_, i) => `<rect x="34" y="${84 + i * 58}" width="350" height="50" rx="10"/>`).join('')}</clipPath>`;

  let body = cardBg(W, H);
  const stamp = s.updated.slice(0, 16).replace('T', ' · ') + ' UTC';
  body += t(34, 46, 'TELEMETRÍA EN VIVO  //  ÚLTIMOS 12 MESES', { font: 'monob', size: 13, fill: C.red, ls: 4 });
  body += `<circle class="pulse" cx="${W - 34 - measure('SYNC ' + stamp, 'mono', 13, 2) - 14}" cy="41" r="4.5" fill="${C.green}"/>`;
  body += t(W - 34, 46, `SYNC ${esc(stamp)}`, { font: 'mono', size: 13, fill: C.dim, ls: 2, anchor: 'end' });

  rows.forEach(([label, value, unit, color], i) => {
    const y = 84 + i * 58;
    body += `<rect x="34" y="${y}" width="350" height="50" rx="10" fill="#0F1730" stroke="${C.line}"/>
<rect x="34" y="${y}" width="5" height="50" rx="2" fill="${color}"/>
${t(54, y + 31, String(i + 1).padStart(2, '0'), { font: 'monob', size: 14, fill: '#4A5680' })}
${t(88, y + 31, label, { font: 'mono', size: 13, fill: C.sub, ls: 2 })}`;
    body += `<g clip-path="url(#rows)"><g class="roll" style="animation-delay:${r(0.2 + i * 0.1)}s">
${t(370 - (unit ? measure(unit, 'mono', 11) + 8 : 0), y + 35, String(value), { font: 'monob', size: 26, fill: C.text, anchor: 'end' })}
${unit ? t(370, y + 35, esc(unit), { font: 'mono', size: 11, fill: C.dim, anchor: 'end' }) : ''}
</g></g>`;
  });

  const cx0 = 420;
  const cy0 = 84;
  const cw = 746;
  const ch = 232;
  body += `<rect x="${cx0}" y="${cy0}" width="${cw}" height="${ch}" rx="12" fill="#0C1329" stroke="${C.line}"/>`;
  body += t(cx0 + 20, cy0 + 30, 'LAP CHART  ·  CONTRIBUCIONES POR SEMANA', { font: 'mono', size: 12, fill: C.dim, ls: 2.5 });
  const px0 = cx0 + 24;
  const px1 = cx0 + cw - 24;
  const py0 = cy0 + 56;
  const py1 = cy0 + ch - 34;
  const max = Math.max(1, ...s.weeks);
  const n = s.weeks.length;
  const X = (k) => px0 + ((px1 - px0) * k) / Math.max(1, n - 1);
  const Y = (v) => py1 - ((py1 - py0) * v) / max;
  for (let g = 0; g <= 3; g++) {
    const gy = py0 + ((py1 - py0) * g) / 3;
    body += `<line x1="${px0}" y1="${r(gy)}" x2="${px1}" y2="${r(gy)}" stroke="#1A2547" stroke-dasharray="${g === 3 ? '0' : '3 6'}"/>`;
  }
  body += t(px1, py0 - 8, `máx ${max}/sem`, { font: 'mono', size: 11, fill: '#56628C', anchor: 'end' });

  const pts = s.weeks.map((v, k) => [X(k), Y(v)]);
  let d = `M ${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let k = 1; k < pts.length; k++) {
    const [x0, y0] = pts[k - 1];
    const [x1, y1] = pts[k];
    const mx = (x0 + x1) / 2;
    d += ` C ${r(mx)} ${r(y0)} ${r(mx)} ${r(y1)} ${r(x1)} ${r(y1)}`;
  }
  const area = `${d} L ${r(px1)} ${py1} L ${px0} ${py1} Z`;
  body += `<path class="area" d="${area}" fill="url(#areaG)"/>
<path class="draw" d="${d}" stroke="url(#acc)" stroke-width="2.6" stroke-linejoin="round" stroke-dasharray="3000" filter="url(#gl)"/>
<g filter="url(#gl)"><circle r="5" fill="#FFF1B8"><animateMotion dur="9s" begin="2.8s" repeatCount="indefinite" path="${d}"/></circle></g>`;

  const bestIdx = s.weeks.indexOf(Math.max(...s.weeks));
  if (s.weeks[bestIdx] > 0) {
    const [bx, by] = pts[bestIdx];
    const label = `VUELTA RÁPIDA · ${s.weeks[bestIdx]}`;
    const lw = measure(label, 'monob', 11, 1.5) + 18;
    const lx = Math.min(Math.max(bx - lw / 2, px0), px1 - lw);
    body += `<g class="fast"><line x1="${r(bx)}" y1="${r(by)}" x2="${r(bx)}" y2="${py1}" stroke="${C.purple}" stroke-dasharray="2 4"/>
<circle cx="${r(bx)}" cy="${r(by)}" r="6" fill="${C.purple}" filter="url(#gl)"/>
${handCircle(bx, by, 20, 16, { seed: 5, delay: 3.2, width: 2.4 })}
<rect x="${r(lx)}" y="${r(by - 36)}" width="${r(lw)}" height="22" rx="5" fill="rgba(181,76,255,.16)" stroke="rgba(181,76,255,.6)"/>
${t(lx + lw / 2, by - 21, label, { font: 'monob', size: 11, fill: C.purple, ls: 1.5, anchor: 'middle' })}</g>`;
  }
  const monthsStep = (px1 - px0) / 12;
  s.months.forEach((m, k) => {
    body += t(px0 + monthsStep * (k + 0.5), py1 + 22, m.label, { font: 'mono', size: 11, fill: '#56628C', ls: 1.5, anchor: 'middle' });
  });

  const sy = 336;
  body += t(cx0, sy + 4, 'SECTORES MENSUALES', { font: 'mono', size: 12, fill: C.dim, ls: 2.5 });
  const legend = [['MÁS RÁPIDO', C.purple], ['SOBRE MEDIA', C.green], ['EN PISTA', C.yellow], ['BOXES', '#2A3866']];
  let lgx = cx0 + cw;
  for (let k = legend.length - 1; k >= 0; k--) {
    const [lab, col] = legend[k];
    const w = measure(lab, 'mono', 11, 1.5);
    lgx -= w;
    body += t(lgx, sy + 4, lab, { font: 'mono', size: 11, fill: C.dim, ls: 1.5 });
    lgx -= 16;
    body += `<rect x="${r(lgx)}" y="${sy - 6}" width="10" height="10" rx="2" fill="${col}"/>`;
    lgx -= 18;
  }
  const mmax = Math.max(...s.months.map((m) => m.count));
  const active = s.months.filter((m) => m.count > 0);
  const avg = active.length ? active.reduce((a, m) => a + m.count, 0) / active.length : 0;
  const gap = 8;
  const bw = (cw - gap * 11) / 12;
  s.months.forEach((m, k) => {
    const x = cx0 + k * (bw + gap);
    const col = m.count === 0 ? '#1C2850' : m.count === mmax ? C.purple : m.count >= avg ? C.green : C.yellow;
    body += `<g class="sec" style="animation-delay:${r(0.4 + k * 0.06)}s">
<rect x="${r(x)}" y="${sy + 18}" width="${r(bw)}" height="54" rx="8" fill="#0F1730" stroke="${C.line}"/>
<rect x="${r(x + 8)}" y="${sy + 26}" width="${r(bw - 16)}" height="5" rx="2.5" fill="${col}"/>
${t(x + bw / 2, sy + 50, m.label, { font: 'mono', size: 11, fill: C.dim, ls: 1.5, anchor: 'middle' })}
${t(x + bw / 2, sy + 66, String(m.count), { font: 'monob', size: 13, fill: m.count ? C.text : '#4A5680', anchor: 'middle' })}
</g>`;
  });

  body += handText(40, H - 20, 'ojo: casi todo mi código vive en repos privados', { size: 25, delay: 2.4, rotate: -1.5 });
  body += t(W - 34, H - 22, 'actualizado solo, cada 8 horas', { font: 'mono', size: 11, fill: '#4A5680', anchor: 'end' });

  return doc({ w: W, h: H, title: `Telemetría — ${s.total} contribuciones en 12 meses`, fonts: ['mono', 'monob', 'hand'], css, defs, body });
}

function fmtDate(iso) {
  const [, m, d] = iso.split('-');
  return `${Number(d)} ${MONTHS[Number(m) - 1].toLowerCase()}`;
}
