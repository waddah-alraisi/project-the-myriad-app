import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { uiTags, uiOrigin } from '../scripts/ui-tags.js';

const CSS = new URL('../../oncloud-ui/dist/oncloud-ui.css', import.meta.url);

// The app's own hooks: styled in src/style.css or used only as selectors, never Tailwind classes.
const HOOKS = new Set(['field', 'field-error', 'badge', 'toast', 'toasts', 'ok', 'bad']);

function classesInSource() {
  const files = ['src/main.js', 'src/ui.js', 'src/screens/host.js', ...readdirSync('src/views').map((f) => `src/views/${f}`)];
  const found = new Map();
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(/class:\s*(['`])((?:(?!\1).)*)\1/g)) {
      for (const cls of m[2].replace(/\$\{[^}]*\}/g, ' ').split(/\s+/).filter(Boolean)) {
        if (!HOOKS.has(cls) && !cls.startsWith('stage-')) found.set(cls, file);
      }
    }
    // The badge tones and other class strings kept in constants.
    for (const m of text.matchAll(/^\s+\w+: '((?:bg|text|border)-[^']+)'/gm)) {
      for (const cls of m[1].split(/\s+/)) found.set(cls, file);
    }
  }
  return found;
}

const selector = (cls) => `.${cls.replace(/[:/.[\]%!]/g, (c) => `\\${c}`)}`;

test('every Tailwind class the app writes is in @oncloud/ui\'s stylesheet (the app kit or the components)', { skip: !existsSync(CSS) && 'needs ../oncloud-ui built' }, () => {
  const css = readFileSync(CSS, 'utf8');
  const missing = [...classesInSource()].filter(([cls]) => !css.includes(selector(cls))).map(([cls, file]) => `${cls} (${file})`);
  assert.deepEqual(missing, [], 'add them to the app kit in oncloud-ui, or use a component');
});

test('the CDN lines: integrity and crossorigin for a pinned release, crossorigin only for a dev build', () => {
  const pinned = JSON.parse(readFileSync('ui.json', 'utf8'));
  const tags = uiTags(pinned);
  assert.ok(tags.includes(`href="${pinned.base}/oncloud-ui.css" integrity="${pinned.integrity.css}" crossorigin="anonymous"`));
  assert.ok(tags.includes(`<script type="module" src="${pinned.base}/oncloud-ui.js" integrity="${pinned.integrity.js}" crossorigin="anonymous">`));
  assert.doesNotMatch(uiTags({ base: 'http://localhost:8790/ui/dev/' }), /integrity/);
  assert.match(uiTags({ base: 'http://localhost:8790/ui/dev/' }), /src="http:\/\/localhost:8790\/ui\/dev\/oncloud-ui.js"/);
  assert.equal(uiOrigin(pinned.base), new URL(pinned.base).origin);
});

test('the page CSP lets in the CDN and the workspace brand', () => {
  const headers = readFileSync('public/_headers', 'utf8');
  const csp = Object.fromEntries(/Content-Security-Policy: (.+)/.exec(headers)[1].split(';').map((d) => d.trim().split(/\s+/)).map(([k, ...v]) => [k, v]));
  const cdn = uiOrigin(JSON.parse(readFileSync('ui.json', 'utf8')).base);
  assert.ok(csp['script-src'].includes(cdn), 'script-src has the CDN');
  assert.ok(csp['style-src'].includes(cdn), 'style-src has the CDN');
  assert.ok(csp['style-src'].includes("'unsafe-inline'"), 'style-src allows the theme\'s <style> (tenant brand) and style attributes');
  // The API origin is whatever public/config.json names, so the test follows the real address once it is set.
  const api = new URL(JSON.parse(readFileSync('public/config.json', 'utf8')).api_base).origin;
  for (const d of ['connect-src', 'font-src', 'img-src']) assert.ok(csp[d].includes(api), `${d} has the API origin ${api}`);
  assert.ok(!csp['script-src'].includes("'unsafe-inline'"), 'no inline script');
});
