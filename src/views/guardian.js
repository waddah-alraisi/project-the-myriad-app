import { t } from '../i18n.js';
import { get, sendLink } from '../data.js';
import { actionButton, card, muted, notice } from '../ui.js';

// The guardian signs with a one-time link (no account): emailed from here, to the consent screen of the resident app.
export async function guardianLinkView(ctx) {
  const consent = await get('guardian_consent', ctx.params.id);
  if (consent.signed) return card({ title: t('signingLink') }, notice(t('alreadySigned')));
  if (!consent.guardian_email) return card({ title: t('signingLink') }, muted(t('noGuardianEmail')));

  return card({ title: t('signingLink'), note: t('consentDetails') },
    muted(consent.guardian_email),
    actionButton(t('sendLink'), async () => {
      try {
        await sendLink({ collection: 'guardian_consent', id: consent.id, route: `/consent/${consent.id}`, email: consent.guardian_email, ttl_hours: 72 });
        ctx.toast(t('linkSent'));
      } catch (e) {
        ctx.toast(e);
      }
    }));
}
