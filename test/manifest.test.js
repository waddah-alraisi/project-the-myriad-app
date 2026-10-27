import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { myriadManifest } from '../src/manifest.js';

const VALIDATE = new URL('../../oncloud-ui/src/from-shell/app/validate.js', import.meta.url);
const SCHEMA = new URL('../../oncloud-fly/examples/myriad.schema.json', import.meta.url);

test('the manifest passes OnCloud\'s own validator (the runtime refuses to boot otherwise)', { skip: !existsSync(VALIDATE) && 'needs ../oncloud-ui' }, async () => {
  globalThis.window ??= globalThis;
  globalThis.location ??= new URL('http://localhost/');
  const { validate } = await import(VALIDATE.href);
  assert.deepEqual(validate(myriadManifest()).errors, []);
});

test('every app screen names a component the app supplies, and every resource sends its revision', async () => {
  const { COMPONENTS } = await import('../src/screens/index.js');
  const m = myriadManifest();
  const named = Object.values(m.screens).filter((s) => s.kind === 'app').map((s) => s.component);
  assert.deepEqual([...new Set(named)].sort(), Object.keys(COMPONENTS).sort());
  for (const r of Object.values(m.resources)) assert.equal(r.concurrency, 'revision');
});

test('every column the screens read is a field of Myriad\'s published schema, and only the team\'s fields are writable',
  { skip: !existsSync(SCHEMA) && 'needs ../oncloud-fly' }, () => {
    const schema = JSON.parse(readFileSync(SCHEMA, 'utf8')).collections;
    const SYSTEM = new Set(['id', 'revision', 'created_at']);
    for (const [name, r] of Object.entries(myriadManifest().resources)) {
      const collection = r.endpoint.replace('/data/', '');
      assert.ok(schema[collection], `${name}: no collection ${collection}`);
      for (const [key, f] of Object.entries(r.fields)) {
        if (SYSTEM.has(key)) continue;
        assert.ok(schema[collection].fields[f.column], `${name}.${key}: no field ${f.column} in ${collection}`);
        if (schema[collection].fields[f.column].computed) assert.equal(f.readOnly, true, `${name}.${key} is computed: read only`);
      }
    }
  });

test('a list fixed to one resident filters on an indexed field (the API filters on nothing else)', { skip: !existsSync(SCHEMA) && 'needs ../oncloud-fly' }, () => {
  const schema = JSON.parse(readFileSync(SCHEMA, 'utf8')).collections;
  const m = myriadManifest();
  for (const [key, s] of Object.entries(m.screens)) {
    if (s.kind !== 'list' || !s.filterParams) continue;
    const collection = m.resources[s.resource].endpoint.replace('/data/', '');
    for (const field of Object.keys(s.filterParams)) {
      assert.ok((schema[collection].indexes ?? []).some((i) => i[0] === field), `${key}: ${collection}.${field} is not indexed`);
    }
  }
});
