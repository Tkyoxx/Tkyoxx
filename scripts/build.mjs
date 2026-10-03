import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { write } from './lib.mjs';
import { hero } from './hero.mjs';
import { radio, driver, rules, stack, footer, ctaGrid, ctaDiscord } from './cards.mjs';
import { featured, plagasync, nova } from './projects.mjs';
import { season } from './season.mjs';
import { fetchStats, telemetry } from './telemetry.mjs';
import { loadGrid, joinGrid, grid } from './grid.mjs';

const OWNER = process.env.PROFILE_LOGIN || 'Tkyoxx';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const liveDir = flag('--live');
const joiner = flag('--join');

if (liveDir) {
  const dir = path.resolve(root, liveDir);
  if (joiner) console.log(`grid: ${joinGrid(dir, joiner)} pilotos`);
  const stats = await fetchStats(OWNER, process.env.GH_TOKEN);
  console.log(write(dir, 'telemetry.svg', telemetry(stats)));
  console.log(write(dir, 'grid.svg', await grid(loadGrid(dir, OWNER), OWNER)));
} else {
  const out = path.join(root, 'assets');
  const pieces = { hero, radio, driver, rules, season, stack, featured, plagasync, nova, footer, 'cta-grid': ctaGrid, 'cta-discord': ctaDiscord };
  for (const [name, fn] of Object.entries(pieces)) console.log(write(out, `${name}.svg`, fn()));
}
