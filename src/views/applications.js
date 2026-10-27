import { el, options } from '../dom.js';
import { pick, t } from '../i18n.js';
import { create, forms, invite, markSubmission, submissions } from '../data.js';
import { actionButton, badge, card, notice, page, select, table } from '../ui.js';

const sent = (iso) => (iso ? new Date(iso).toLocaleDateString('en-GB', { dateStyle: 'medium' }) : '');

// What a submission becomes: the resident's record. Only what the applicant gave; the team fills the room later.
export function residentFrom(sub) {
  const out = { full_name: String(sub.name || '').trim() || String(sub.email || '').trim() };
  if (sub.email) out.email = String(sub.email).trim();
  if (sub.phone) out.phone = String(sub.phone).trim();
  return out;
}

// A submission's answers, as "Question: answer" lines, labels in the reader's language.
export function answerLines(form, sub) {
  const questions = new Map((form?.questions ?? []).map((q) => [q.key, q]));
  return Object.entries(sub.answers ?? {}).filter(([, v]) => v !== null && v !== '' && v !== false).map(([key, v]) => {
    const q = questions.get(key);
    const label = q ? pick(q.label) : key;
    const value = q?.type === 'file' ? '📎' : q?.options ? pick(q.options.find((o) => o.value === v)?.label) || String(v) : v === true ? t('yes') : String(v);
    return `${label}: ${value}`;
  });
}

// Applications from the public form: make one a resident (and invite them to the app), or discard it.
export async function applicationsView(ctx) {
  const all = await forms();
  if (!all.length) return page({ title: t('applications'), note: t('applicationsNote') }, notice(t('noForm')));

  const formId = ctx.query.get('form') || all[0].id;
  const form = all.find((f) => f.id === formId) ?? all[0];
  const showDone = ctx.query.get('done') === '1';
  const subs = (await submissions(form.id, showDone ? null : 'new')).data ?? [];

  const makeResident = (sub) => async () => {
    let resident;
    try {
      resident = await create('resident', residentFrom(sub));
    } catch (e) { ctx.toast(e); return; }
    // The resident exists from here on: an invitation that fails is sent again from the resident's Account tab.
    if (sub.email) {
      try { await invite({ collection: 'resident', id: resident.id, email: sub.email }); } catch (e) { ctx.toast(e); }
    }
    try { await markSubmission(form.id, sub.id, { status: 'processed', record_id: resident.id }); } catch (e) { ctx.toast(e); }
    ctx.toast(t('madeResident'));
    ctx.go(`/residents/${resident.id}`);
  };
  const discard = (sub) => async () => {
    try { await markSubmission(form.id, sub.id, { status: 'discarded' }); ctx.refresh(); } catch (e) { ctx.toast(e); }
  };

  const chooser = all.length > 1 ? select('form', options(all.map((f) => f.id), form.id, (id) => pick(all.find((f) => f.id === id)?.title)), {
    onchange: (e) => ctx.go(`/applications?form=${e.target.value}`), 'aria-label': t('form'),
  }) : null;
  const toggle = el('label', { class: 'inline-flex items-center gap-2 text-sm' },
    el('input', { type: 'checkbox', checked: showDone, onchange: (e) => ctx.go(`/applications?form=${form.id}${e.target.checked ? '&done=1' : ''}`) }), t('showDone'));

  return page({ title: t('applications'), note: `${pick(form.title)} — ${t('applicationsNote')}`, actions: [chooser, toggle] },
    card({}, table({
      id: 'applications',
      rows: subs,
      columns: [
        { key: 'name', label: t('fullName'), primary: true, value: (s) => s.name || s.email || '—', search: (s) => `${s.name} ${s.email} ${s.phone}` },
        { key: 'contact', label: t('email'), value: (s) => el('span', { dir: 'ltr' }, [s.email, s.phone].filter(Boolean).join(' · ')) },
        { key: 'answers', label: t('answers'), value: (s) => el('div', { class: 'space-y-0.5 text-sm' }, answerLines(form, s).map((l) => el('p', {}, l))) },
        { key: 'sent', label: t('submitted'), value: (s) => sent(s.created_at) },
        { key: 'status', label: t('status'), value: (s) => badge(t(`sub.${s.status}`), s.status) },
        { key: 'actions', label: t('actions'), align: 'end', value: (s) => (s.status !== 'new' ? '' : el('span', { class: 'inline-flex gap-2' },
          actionButton(t('makeResident'), makeResident(s), { size: 'sm' }),
          actionButton(t('discard'), discard(s), { variant: 'secondary', size: 'sm' }))) },
      ],
      empty: t('empty'),
    })));
}
