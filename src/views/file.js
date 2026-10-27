import { el } from '../dom.js';
import { t } from '../i18n.js';
import { fileOf, get } from '../data.js';
import { card, linkButton, muted } from '../ui.js';

// One file field of a record, shown as it is (an image) or opened (anything else). props: { collection, field }.
export async function fileView(ctx) {
  const { collection, field } = ctx.props;
  const row = await get(collection, ctx.params.id);
  if (!row[field]) return card({}, muted(t('noPhoto')));
  const file = await fileOf(collection, row.id, field);
  const image = String(file.content_type || '').startsWith('image/');
  return card({ actions: file.url ? linkButton(t('openFile'), file.url) : null },
    image && file.url
      ? el('img', { src: file.url, alt: file.filename || t('photo'), class: 'max-w-2xl rounded-lg', loading: 'lazy' })
      : muted(file.filename || ''));
}
