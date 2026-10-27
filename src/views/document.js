import { el } from '../dom.js';
import { num, t } from '../i18n.js';
import { fileOf, get, update, upload } from '../data.js';
import { actionButton, card, linkButton, muted, notice } from '../ui.js';

export const isPdf = (file) => Boolean(file) && (file.type === 'application/pdf' || /\.pdf$/i.test(file.name || ''));

// A contract's PDF: its pages as OnCloud renders them for the resident, and the upload — until it is signed.
export async function documentView(ctx) {
  const contract = await get('contract', ctx.params.id);
  const doc = contract.pdf_file ? await fileOf('contract', contract.id, 'pdf_file') : null;

  const picker = el('input', { type: 'file', accept: 'application/pdf', class: 'hidden', 'aria-label': t('uploadPdf') });
  picker.addEventListener('change', async () => {
    const file = picker.files?.[0];
    if (!file) return;
    if (!isPdf(file)) { ctx.toast(new Error(t('onlyPdf'))); return; }
    try {
      ctx.toast(t('uploading'));
      const id = await upload(file);
      await update('contract', contract, { pdf_file: id });
      ctx.toast(t('uploaded'));
      ctx.refreshAll?.();
    } catch (e) {
      ctx.toast(e);
    }
  });

  const actions = [
    doc?.url ? linkButton(t('openFile'), doc.url) : null,
    contract.signed ? null : actionButton(doc ? t('replacePdf') : t('uploadPdf'), async () => picker.click(), { variant: doc ? 'secondary' : 'primary' }),
  ];

  return card({ title: t('document'), actions },
    picker,
    contract.signed ? notice(t('lockedSigned')) : null,
    doc ? muted(`${doc.filename ?? ''}${doc.pages?.length ? ` · ${num(doc.pages.length)} ${t('pages')}` : ''}`) : muted(t('noDocument')),
    doc?.pages?.length ? el('div', { class: 'mt-4 grid grid-cols-2 gap-4 md:grid-cols-4' },
      doc.pages.slice(0, 8).map((p, i) => el('img', { src: p.url, alt: `${i + 1}`, loading: 'lazy', class: 'rounded-lg border border-gray-200 dark:border-white/10' }))) : null);
}
