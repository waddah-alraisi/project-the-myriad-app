// The app's building blocks, drawn with @oncloud/ui (loaded by index.html, on globalThis.OnCloudUI). Read lazily, so
// modules that only need candidateName() or explain() still load in Node tests.
import { el, fill } from './dom.js';
import { explain } from './errors.js';
import { t } from './i18n.js';

export function UI() {
  const ui = globalThis.OnCloudUI;
  if (!ui) throw new Error('oncloud_ui_not_loaded');
  return ui;
}

// ---- buttons --------------------------------------------------------------

export function button(label, onClick, { variant = 'primary', size = 'md', icon = null, disabled = false, type = 'button', title = null } = {}) {
  return UI().ButtonComponent.new({ label, variant, size, icon, disabled, type, title, onClick }).element;
}

export function linkButton(label, href, { variant = 'secondary', size = 'md' } = {}) {
  return el('a', { href, class: UI().buttonClass(variant, size) }, label);
}

// A button that shows it is working while `run` does, and comes back if it fails.
export function actionButton(label, run, options = {}) {
  const b = UI().ButtonComponent.new({ label, variant: options.variant ?? 'primary', size: options.size ?? 'md', icon: options.icon ?? null, disabled: options.disabled ?? false,
    onClick: async () => {
      b.setLoading(true);
      try { await run(); } finally { b.setLoading(false); }
    } });
  return b.element;
}

// ---- fields: the shell's own field classes on plain elements, so a 422 maps onto them by name ----------------

// `wrap`: a long label (a question someone wrote) wraps instead of being cut, in its own direction.
export function field(label, control, { size = '', wrap = false } = {}) {
  return el('div', { class: `field ${size}` },
    el('label', { class: wrap ? UI().LABEL.replace('truncate', 'break-words') : UI().LABEL, for: control.id || null, dir: wrap ? 'auto' : null }, label),
    el('div', { class: 'mt-2' }, control));
}

const controlClass = (extra = '') => `${UI().CONTROL} py-1.5 ${extra}`;
// Every control gets an id, so its <label for> names it (screen readers, and getByLabel in the browser tests).
let ids = 0;
const idFor = (name) => `f-${name}-${(ids += 1)}`;
export const input = (name, attrs = {}) => el('input', { name, id: idFor(name), class: controlClass(), ...attrs });
export const textarea = (name, attrs = {}) => el('textarea', { name, id: idFor(name), rows: 2, class: controlClass('resize-y'), ...attrs });
export const select = (name, children, attrs = {}) => el('select', { name, id: idFor(name), class: controlClass(), ...attrs }, children);

export function form({ onSubmit, cols = 'md:grid-cols-4' }, ...children) {
  const node = el('form', { class: `grid grid-cols-1 ${cols} gap-4 items-end` }, ...children);
  node.addEventListener('submit', (e) => { e.preventDefault(); onSubmit(node); });
  return node;
}

// Field errors from a 422 onto the form's inputs; anything else into a toast.
export function showErrors(formNode, error, toast) {
  const { key, fields, general } = explain(error);
  for (const n of formNode.querySelectorAll('.field-error')) n.remove();
  for (const n of formNode.querySelectorAll('[aria-invalid="true"]')) n.setAttribute('aria-invalid', 'false');

  let placed = false;
  for (const [name, message] of Object.entries(fields)) {
    const target = formNode.elements.namedItem(name);
    if (!target) continue;
    target.setAttribute('aria-invalid', 'true');
    target.closest('.field')?.append(el('p', { class: `field-error ${UI().ERROR.replace('hidden', '')}` }, message));
    placed = true;
  }
  const leftover = Object.keys(fields).filter((name) => !formNode.elements.namedItem(name)).map((name) => `${name}: ${fields[name]}`);
  if (!placed || general.length || leftover.length) toast(error, [...general, ...leftover]);
  return key;
}

// ---- layout ---------------------------------------------------------------

export function page({ title, back = null, actions = null, note = null }, ...body) {
  return el('div', { class: 'space-y-6' },
    back ? el('p', { class: 'text-sm' }, back) : null,
    el('div', { class: 'flex flex-wrap items-start justify-between gap-4' },
      el('div', { class: 'min-w-0' },
        el('h1', { class: UI().SECTION_HEADING }, title),
        note ? el('p', { class: UI().SECTION_NOTE }, note) : null),
      actions ? el('div', { class: 'flex flex-wrap items-center gap-2' }, actions) : null),
    ...body);
}

export function card({ title = null, note = null, actions = null }, ...body) {
  return el('section', { class: UI().GROUP_BOX },
    title || actions ? el('div', { class: 'flex flex-wrap items-center justify-between gap-3 mb-4' },
      el('div', {}, title ? el('h2', { class: UI().GROUP_HEADING }, title) : null, note ? el('p', { class: UI().GROUP_NOTE }, note) : null),
      actions ? el('div', { class: 'flex flex-wrap items-center gap-2' }, actions) : null) : null,
    ...body);
}

export const muted = (...text) => el('p', { class: 'text-sm text-gray-600 dark:text-gray-400' }, ...text);
export const notice = (...text) => el('p', { class: 'rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-white/10 dark:bg-amber-500/10 dark:text-amber-200' }, ...text);
export const errorText = (...text) => el('p', { class: 'text-sm text-red-700 dark:text-red-300' }, ...text);
export const link = (href, label) => el('a', { href, class: 'font-medium text-brand-700 hover:underline dark:text-brand-300' }, label);

// The shell table's badge colours.
const TONES = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-400/10 dark:text-gray-300',
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  blue: 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
};
export const TONE_OF = {
  ok: 'green', bad: 'red', new: 'blue', processed: 'green', discarded: 'gray', team: 'brand', resident: 'blue', approved: 'green', signed: 'green',
};
export const badge = (text, tone = '') => el('span', { class: `badge inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tone} ${TONES[TONE_OF[tone] ?? tone] ?? TONES.gray}` }, text);

// ---- money: this app's API always speaks minor units (baisa) --------------------------------------
// OnCloud's list cell reads a fixed-currency amount as whole units (its own older APIs send them so); here every
// amount is minor, as the record screens already read it. 250000 → "250.000 OMR".
export function registerMinorMoney() {
  const digits = (code) => { try { return new Intl.NumberFormat('en', { style: 'currency', currency: code }).resolvedOptions().maximumFractionDigits; } catch { return 2; } };
  UI().registerFormatter('money', (v, col, row) => {
    const amount = v && typeof v === 'object' ? v.amount : v;
    if (amount == null || amount === '') return document.createTextNode('');
    const code = String((v && typeof v === 'object' ? v.currency : null) || (typeof col?.currency === 'string' ? col.currency : row?.currency) || 'OMR').toUpperCase();
    const d = code === 'OMR' ? 3 : digits(code);
    const major = (Number(amount) / 10 ** d).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    return document.createTextNode(`${major} ${code}`);
  });
  // Latin digits in both languages: @oncloud/ui 1.1.0's number cells follow the browser's locale ("٠" in an Arabic
  // browser). Fixed in oncloud-shell; this stays until the app moves to the release that carries it.
  UI().registerFormatter('number', (v) => document.createTextNode(v == null || v === '' ? '' : Number(v).toLocaleString('en-US')));
}

// ---- tables: @oncloud/ui's TableComponent over rows already in hand ------------------------------

let registered = false;
function registerNodeFormatter() {
  if (registered) return;
  UI().registerFormatter('node', (v) => (v instanceof Node ? v : document.createTextNode(v == null ? '' : String(v))));
  registered = true;
}

// columns: [{ key, label, value?: row => text|Node, align?, primary?, search?: row => text }]
export function table({ id, rows, columns, onOpen = null, perPage = 25, search = true, empty = null }) {
  if (rows.length === 0) return muted(empty ?? t('empty'));
  registerNodeFormatter();
  const haystack = (row) => columns.map((c) => (c.search ? c.search(row) : typeof c.value === 'function' ? '' : row[c.key])).join(' ').toLowerCase();
  const tableNode = UI().TableComponent.new({
    id,
    search: search && rows.length > 8,
    perPage,
    chrome: 'card',
    columns: columns.map((c) => ({ key: c.key, label: c.label, align: c.align, primary: c.primary, format: 'node', value: c.value ?? ((row) => row[c.key]) })),
    rowClick: onOpen ? { onClick: (e, { row }) => { if (!e.target.closest('a,button,input,select')) onOpen(row); } } : undefined,
    fetch: async (q) => {
      const words = (q.search || '').toLowerCase().trim();
      const found = words ? rows.filter((r) => haystack(r).includes(words)) : rows;
      return { rows: found.slice((q.page - 1) * q.perPage, q.page * q.perPage), total: found.length };
    },
  });
  tableNode.refresh();
  return tableNode.element;
}

// ---- confirm, toasts, downloads -------------------------------------------

export function confirmDelete() {
  return UI().confirmModal({ title: t('confirmDelete'), danger: true, confirmLabel: t('delete'), cancelLabel: t('cancel') });
}

export function toaster(region) {
  return (errorOrText, extra = []) => {
    const isText = typeof errorOrText === 'string';
    const info = isText ? null : explain(errorOrText);
    // An error this app wrote itself (a sentence, no server envelope) is said as written.
    const own = !isText && !errorOrText?.envelope && info.key === 'errGeneric' && /\s/.test(String(errorOrText?.message ?? ''));
    const lines = isText ? [errorOrText] : [own ? errorOrText.message : t(info.key), ...extra, ...(extra.length ? [] : info.general)];
    const node = el('div', {
      class: `toast rounded-lg px-4 py-3 text-sm shadow-md ${isText ? 'ok bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200' : 'bad bg-red-50 text-red-800 dark:bg-red-500/15 dark:text-red-200'}`,
      role: isText ? 'status' : 'alert',
    }, lines.map((l) => el('p', {}, l)));
    region.append(node);
    setTimeout(() => node.remove(), isText ? 2500 : 7000);
  };
}

// Open a tab during the click (popup blockers allow only that), then point it at a URL that arrives later.
export async function openWhenReady(urlPromise, toast) {
  const tab = window.open('', '_blank');
  try {
    const url = await urlPromise;
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else {
      location.assign(url);
    }
  } catch (e) {
    tab?.close();
    toast(e);
  }
}

export { fill };
