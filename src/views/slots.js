import { el } from '../dom.js';
import { t } from '../i18n.js';
import { create, get, list } from '../data.js';
import { badge, button, card, field, form, input, showErrors, table } from '../ui.js';

const when = (iso) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '');

// The checks a proposed window must pass before it is sent (the server checks again).
export function windowError(start, end) {
  if (!start || !end) return 'errInvalid';
  return new Date(end) > new Date(start) ? null : 'endAfterStart';
}

// A request's entry times: what was proposed, by whom, which one the resident approved — and a new one to propose.
export async function slotsView(ctx) {
  const request = await get('maintenance_request', ctx.params.id);
  const slots = await list('entry_slot', { filters: { request_id: request.id }, sort: 'created_at' });

  const rows = table({
    id: 'slots',
    rows: slots,
    search: false,
    columns: [
      { key: 'start', label: t('start'), value: (s) => when(s.start) },
      { key: 'end', label: t('end'), value: (s) => when(s.end) },
      { key: 'by', label: t('proposedBy'), value: (s) => badge(t(`by.${s.proposed_by}`), s.proposed_by) },
      { key: 'ok', label: t('approvedTime'), value: (s) => (request.approved_slot === s.id ? badge(t('approvedTime'), 'approved') : '') },
    ],
    empty: t('noTimes'),
  });

  const closed = ['done', 'cancelled'].includes(request.status);
  const proposing = closed ? null : form({
    cols: 'md:grid-cols-3',
    onSubmit: async (node) => {
      const start = node.elements.namedItem('start').value;
      const end = node.elements.namedItem('end').value;
      const problem = windowError(start, end);
      if (problem) { ctx.toast(new Error(problem === 'endAfterStart' ? t('endAfterStart') : t('errInvalid'))); return; }
      try {
        await create('entry_slot', { request_id: request.id, start: new Date(start).toISOString(), end: new Date(end).toISOString(), proposed_by: 'team' });
        ctx.toast(t('timeProposed'));
        ctx.refresh();
      } catch (e) {
        showErrors(node, e, ctx.toast);
      }
    },
  },
  field(t('start'), input('start', { type: 'datetime-local', required: true, dir: 'ltr' })),
  field(t('end'), input('end', { type: 'datetime-local', required: true, dir: 'ltr' })),
  el('div', {}, button(t('proposeTime'), null, { type: 'submit' })));

  return el('div', { class: 'space-y-4' }, card({ title: t('entryTimes') }, rows), proposing ? card({ title: t('proposeTime') }, proposing) : null);
}

