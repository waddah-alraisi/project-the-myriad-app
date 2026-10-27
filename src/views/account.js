import { el } from '../dom.js';
import { t } from '../i18n.js';
import { get, invite } from '../data.js';
import { card, field, form, input, muted, showErrors, button } from '../ui.js';

// A resident's OnCloud account: linked (they sign in to the resident app as themselves), or an invitation to send.
export async function accountView(ctx) {
  const resident = await get('resident', ctx.params.id);
  if (resident.person_id) return card({ title: t('account') }, muted(t('linked')));

  const result = el('div', { class: 'mt-4' });
  const sending = form({
    cols: 'md:grid-cols-3',
    onSubmit: async (node) => {
      try {
        const r = await invite({ collection: 'resident', id: resident.id, email: node.elements.namedItem('email').value.trim() });
        result.replaceChildren(muted(r.status === 'bound' ? t('boundNow')
          : `${t('invited')} ${r.email} — ${t('invitedUntil')} ${new Date(r.expires_at).toLocaleDateString('en-GB')}`));
        if (r.status === 'bound') ctx.refreshAll?.();
      } catch (e) {
        showErrors(node, e, ctx.toast);
      }
    },
  },
  field(t('inviteEmail'), input('email', { type: 'email', required: true, value: resident.email ?? '', dir: 'ltr', autocomplete: 'off' }), { size: 'md:col-span-2' }),
  el('div', {}, button(t('invite'), null, { type: 'submit' })));

  return card({ title: t('account'), note: t('notLinked') }, sending, result);
}
