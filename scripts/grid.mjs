import fs from 'node:fs';
import path from 'node:path';
import { C, doc, t, esc, fit, measure, r, cardBg, glowDef, glowFilter, handText, handArrow } from './lib.mjs';

const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
const SLOTS = 10;
export const LOGIN_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;

export function loadGrid(dir, owner) {
  const file = path.join(dir, 'grid.json');
  let list = [];
  try {
    list = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {}
  list = list.filter((e) => e && LOGIN_RE.test(e.login));
  if (!list.length) list = [{ login: owner, date: new Date().toISOString().slice(0, 10) }];
  return list;
}

export function joinGrid(dir, login) {
  if (!LOGIN_RE.test(login)) throw new Error(`invalid login: ${login}`);
  const file = path.join(dir, 'grid.json');
  let list = [];
  try {
    list = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {}
  list = list.filter((e) => e && e.login.toLowerCase() !== login.toLowerCase());
  list.unshift({ login, date: new Date().toISOString().slice(0, 10) });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(list.slice(0, 200), null, 2));
  return list.length;
}

async function avatar(login) {
  try {
    const res = await fetch(`https://avatars.githubusercontent.com/${login}?s=88`, { headers: { 'User-Agent': 'profile-grid' } });
    if (!res.ok) return null;
    const type = res.headers.get('content-type') || 'image/png';
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`;
  } catch {
    return null;
  }
}

const fmt = (iso) => {
  const [, m, d] = iso.split('-');
  return `${d} ${MONTHS[Number(m) - 1]}`;
};

export async function grid(entries, owner) {
  const W = 1200;
  const H = 520;
  const shown = entries.slice(0, SLOTS);
  const pics = await Promise.all(shown.map((e) => avatar(e.login)));
  const css = `
.pulse{animation:pulse 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.75)}}
.arrive{animation:arrive 1s cubic-bezier(.15,.85,.25,1) both;}
@keyframes arrive{from{opacity:0;transform:translateX(120px)}to{opacity:1;transform:none}}
.pole{animation:pole 2.4s ease-in-out infinite;}
@keyframes pole{0%,100%{stroke-opacity:.35}50%{stroke-opacity:1}}
.dash{animation:dash 1.2s linear infinite;}
@keyframes dash{to{stroke-dashoffset:-28}}`;
  let defs = glowDef(600, 80, 640, C.blue, 0.15) + glowFilter('gl', 4);

  let body = cardBg(W, H);
  body += t(34, 46, 'PARRILLA DE VISITANTES', { font: 'monob', size: 13, fill: C.red, ls: 4 });
  const n = entries.length;
  body += t(W - 34, 46, `${n} ${n === 1 ? 'PILOTO HA PASADO' : 'PILOTOS HAN PASADO'} POR AQUÍ`, { font: 'mono', size: 13, fill: C.dim, ls: 2.5, anchor: 'end' });
  body += `<line class="dash" x1="600" y1="78" x2="600" y2="${H - 40}" stroke="${C.line2}" stroke-width="3" stroke-dasharray="14 14"/>`;

  for (let i = 0; i < SLOTS; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col ? 640 : 70;
    const y = 96 + row * 74 + col * 37;
    const w = 490;
    const h = 58;
    const e = shown[i];
    const first = i === 0;
    let g = `<path d="M ${x} ${y + h} L ${x} ${y} L ${x + 150} ${y}" stroke="#E9EDF7" stroke-opacity=".55" stroke-width="3"/>`;
    if (e) {
      g += `<rect x="${x + 8}" y="${y + 6}" width="${w - 8}" height="${h - 6}" rx="12" fill="#0F1730" stroke="${first ? C.yellow : C.line2}" ${first ? 'class="pole"' : ''}/>`;
      g += t(x + 30, y + 44, `P${i + 1}`, { font: 'display', size: 22, fill: first ? C.yellow : C.text });
      const ax = x + 112;
      const ay = y + 35;
      defs += `<clipPath id="av${i}"><circle cx="${ax}" cy="${ay}" r="20"/></clipPath>`;
      g += pics[i]
        ? `<image href="${pics[i]}" x="${ax - 20}" y="${ay - 20}" width="40" height="40" clip-path="url(#av${i})"/>`
        : `<circle cx="${ax}" cy="${ay}" r="20" fill="${C.navy}"/>${t(ax, ay + 7, esc(e.login[0].toUpperCase()), { font: 'display', size: 18, fill: C.text, anchor: 'middle' })}`;
      g += `<circle cx="${ax}" cy="${ay}" r="20.5" stroke="${first ? C.yellow : C.line2}" stroke-width="2"/>`;
      const host = e.login.toLowerCase() === owner.toLowerCase();
      const ns = fit(e.login, 'semi', 20, host ? 180 : 250);
      g += t(x + 146, y + 42, esc(e.login), { font: 'semi', size: ns, fill: C.text });
      if (host) {
        const bx = x + 146 + measure(e.login, 'semi', ns) + 12;
        g += `<rect x="${r(bx)}" y="${y + 24}" width="84" height="22" rx="5" fill="rgba(54,113,198,.18)" stroke="rgba(54,113,198,.6)"/>${t(bx + 42, y + 39.5, 'ANFITRIÓN', { font: 'monob', size: 10, fill: '#8FB3EA', ls: 1, anchor: 'middle' })}`;
      }
      g += t(x + w - 14, y + 41, fmt(e.date), { font: 'mono', size: 12, fill: C.dim, ls: 1.5, anchor: 'end' });
    } else {
      g += `<rect x="${x + 8}" y="${y + 6}" width="${w - 8}" height="${h - 6}" rx="12" stroke="${C.line2}" stroke-dasharray="5 6"/>`;
      g += t(x + 30, y + 44, `P${i + 1}`, { font: 'display', size: 22, fill: '#2F3E70' });
      g += t(x + 100, y + 41, 'LIBRE', { font: 'monob', size: 13, fill: '#4A5680', ls: 3 });
    }
    body += `<g class="arrive" style="animation-delay:${r(0.15 + i * 0.09)}s">${g}</g>`;
  }

  const empty = shown.length;
  if (empty < SLOTS) {
    const col = empty % 2;
    const row = Math.floor(empty / 2);
    const x = col ? 640 : 70;
    const y = 96 + row * 74 + col * 37;
    body += handText(x + 190, y + 44, '¿tú?', { size: 34, delay: 2.2, rotate: -6 });
  }
  body += handText(250, 84, 'el último en llegar sale primero', { size: 24, delay: 1.6, rotate: -2 });
  body += handArrow(244, 76, 196, 100, { bend: 0.35, delay: 2.6, head: 10 });
  body += t(600, H - 14, 'Abre un issue con un clic desde el README y tu avatar aparece aquí.', { font: 'mono', size: 12, fill: C.dim, anchor: 'middle' });

  return doc({ w: W, h: H, title: `Parrilla de visitantes — ${n} pilotos`, fonts: ['display', 'semi', 'mono', 'monob', 'hand'], css, defs, body });
}
