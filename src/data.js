// The app's data calls: /api/v1/connected/data (Myriad's collections) and the file handshake. Thin on purpose — the
// rules live in OnCloud (row access, locks, notify), so a refusal comes back as the server's words.
import { api, request } from './oncloud.js';

const qs = (params) => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') q.set(k, v);
  const s = q.toString();
  return s ? `?${s}` : '';
};

export async function list(collection, { filters = {}, sort = '-created_at', perPage = 100 } = {}) {
  const params = { sort, per_page: perPage };
  for (const [k, v] of Object.entries(filters)) params[`filters[${k}]`] = v;
  return api(`/connected/data/${collection}${qs(params)}`);
}

export const get = (collection, id) => api(`/connected/data/${collection}/${id}`);
export const create = (collection, body) => api(`/connected/data/${collection}`, { method: 'POST', body });
// A change carries the revision it was made on: someone else's change in between is refused, not overwritten.
export const update = (collection, row, changes) => api(`/connected/data/${collection}/${row.id}`, { method: 'PATCH', body: { ...changes, revision: row.revision } });

// A file of a record, as the person may see it: { url, filename, pages[] }.
export const fileOf = (collection, id, field) => api(`/connected/data/${collection}/${id}/files/${field}`);

// OnCloud's storage handshake: begin (the upload address), the bytes straight to storage, confirm. Answers the file id.
export async function upload(file) {
  const begun = await api('/connected/files', { method: 'POST', body: { original_name: file.name, content_type: file.type || 'application/octet-stream', size: file.size } });
  const up = begun.upload;
  const form = new FormData();
  for (const [k, v] of Object.entries(up.fields || {})) form.append(k, v);
  form.append('file', file);
  const sent = await fetch(up.url, { method: up.method || 'POST', body: form });
  if (!sent.ok) throw new Error(`storage_refused_${sent.status}`);
  const confirmed = await api(`/connected/files/${begun.file}/confirm`, { method: 'POST' });
  return confirmed.id ?? begun.file;
}

export const forms = () => api('/connected/forms');
export const submissions = (formId, status) => request(`/connected/forms/${formId}/submissions${qs({ status, per_page: 100 })}`);
export const markSubmission = (formId, id, body) => api(`/connected/forms/${formId}/submissions/${id}`, { method: 'PATCH', body });
export const invite = (body) => api('/connected/invitations', { method: 'POST', body });
export const sendLink = (body) => api('/connected/links', { method: 'POST', body });
