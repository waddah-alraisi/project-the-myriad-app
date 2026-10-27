// The team's screens, declared the way OnCloud declares its own (the shell's manifest format, checked by the same
// validator). Lists and records are OnCloud's own screens over /api/v1/connected/data; `kind: "app"` sections are this
// app's code (src/views/). Data: Myriad's published schema (oncloud-fly/examples/myriad.schema.json).
import { both as L } from './i18n.js';

const ro = { readOnly: true };
const size = (md) => ({ base: 12, md });
const TONES = {
  open: 'blue', scheduled: 'amber', in_progress: 'amber', done: 'green', cancelled: 'gray',
  due: 'amber', overdue: 'red', paid: 'green',
  accepted: 'green', declined: 'red', expired: 'gray',
  requested: 'blue', inspected: 'amber', refunded: 'green', closed: 'gray',
  urgent: 'red', normal: 'gray', low: 'gray',
};
const options = (values, prefix) => values.map((v) => ({ value: v, label: L(`${prefix}.${v}`), ...(TONES[v] ? { tone: TONES[v] } : {}) }));

const id = { type: 'string', column: 'id', ...ro, label: L('id') };
const revision = { type: 'integer', column: 'revision', ...ro, label: L('version') };
const createdAt = { type: 'date', column: 'created_at', ...ro, query: { sortable: true }, label: L('added') };
const resident = (extra = {}) => ({ type: 'reference', column: 'resident_id', source: 'm_residents', label: L('resident'), query: { filterable: true }, ...extra });
const money = (column, label, extra = {}) => ({ type: 'money', column, currency: 'OMR', label: L(label), ...extra });
const both = (column, label, extra = {}) => ({ type: 'string', column, i18n: true, writeKey: column, label: L(label), ...extra });
const bothText = (column, label, extra = {}) => ({ type: 'text', column, i18n: true, writeKey: column, label: L(label), ...extra });
const enumOf = (column, values, prefix, label, extra = {}) => ({ type: 'enum', column, options: options(values, prefix), label: L(label), ...extra });
const datetime = (column, label, extra = {}) => ({ type: 'date', column, mode: 'datetime', label: L(label), ...extra });

const resource = (name, endpoint, titleField, fields, label = name) => ({
  endpoint, key: 'id', label: L(label), titleField, permission: `myriad.${name}`, concurrency: 'revision',
  fields: { id, ...fields, revision, created_at: createdAt },
});

// Open, create, back, save, delete — the same five for every collection the team writes.
function crud(name, path, { create, label, deleted, del = true, key = name }) {
  return {
    [`m.${key}.open`]: { kind: 'navigate', to: `${path}/:id`, label: L('open') },
    [`m.${key}.create`]: { kind: 'navigate', to: `${path}/new`, label: L(create), icon: 'plus', variant: 'primary' },
    [`m.${key}.back`]: { kind: 'navigate', to: path, label: L('back'), icon: 'back', variant: 'ghost' },
    [`m.${key}.createSave`]: { kind: 'request', method: 'POST', endpoint: `/data/${name}`, body: 'record', label: L(label), variant: 'primary', shortcut: 'mod+s', then: { navigate: `${path}/:id`, toast: L('created') } },
    [`m.${key}.save`]: { kind: 'request', method: 'PATCH', endpoint: `/data/${name}/:id`, body: 'record', label: L('save'), variant: 'primary', shortcut: 'mod+s', then: { refresh: true, toast: L('saveDone') } },
    ...(del ? { [`m.${key}.delete`]: { kind: 'request', method: 'DELETE', endpoint: `/data/${name}/:id`, label: L('delete'), icon: 'trash', variant: 'danger', confirm: { type: 'warning', title: L(deleted) }, then: { navigate: path } } } : {}),
  };
}
// A list's row open and back, for what residents create and the team only moves on.
const view = (name, path, key = name) => ({
  [`m.${key}.open`]: { kind: 'navigate', to: `${path}/:id`, label: L('open') },
  [`m.${key}.back`]: { kind: 'navigate', to: path, label: L('back'), icon: 'back', variant: 'ghost' },
  [`m.${key}.save`]: { kind: 'request', method: 'PATCH', endpoint: `/data/${name}/:id`, body: 'record', label: L('save'), variant: 'primary', shortcut: 'mod+s', then: { refresh: true, toast: L('saveDone') } },
});

const items = (pairs) => pairs.map(([field, md]) => ({ field, size: size(md) }));
const list = (resourceName, title, columns, open, extra = {}) => ({
  kind: 'list', resource: resourceName, title: L(title), columns, search: true, perPage: 25,
  defaultSort: { field: 'created_at', dir: 'desc' }, rowClick: open, rowActions: [open], ...extra,
});
// One resident's records, as a tab of the resident: the same list, fixed to them.
const ofResident = (resourceName, columns, open, extra = {}) => ({
  kind: 'list', resource: resourceName, columns, perPage: 10, filters: ['resident_id'], filterParams: { resident_id: 'id' },
  defaultSort: { field: 'created_at', dir: 'desc' }, rowClick: open, rowActions: [open], ...extra,
});

export function myriadManifest() {
  return {
    version: 1,
    app: { name: L('title'), basePath: '/', apiBase: '/api/v1/connected', defaultRoute: '/residents', notFound: 'm.notfound', forbidden: 'm.notfound', locales: ['ar', 'en'], defaultLocale: 'ar' },
    theme: {},
    sidebar: { brand: { route: '/residents' } },
    shape: { topbar: true, sidebar: { base: 'drawer', lg: 'fixed' }, content: { mode: true, padding: { base: 'sm', sm: 'lg' } }, bottombar: { base: true, lg: false } },
    lookups: {
      m_residents: { endpoint: '/data/resident', value: 'id', label: 'full_name', search: 'client', cache: 'none' },
    },
    resources: {
      m_resident: resource('resident', '/data/resident', 'full_name', {
        full_name: { type: 'string', column: 'full_name', rules: { required: true, maxLength: 200 }, label: L('fullName') },
        room: { type: 'string', column: 'room', label: L('room') },
        email: { type: 'email', column: 'email', label: L('email') },
        phone: { type: 'phone', column: 'phone', label: L('phone') },
        contract_end: { type: 'date', column: 'contract_end', label: L('contractEnd') },
        balance: money('balance', 'balance', ro),
        open_requests: { type: 'integer', column: 'open_requests', ...ro, label: L('openRequests') },
        next_due_date: { type: 'date', column: 'next_due_date', ...ro, label: L('nextDue') },
        contract_signed: { type: 'boolean', column: 'contract_signed', ...ro, label: L('contractSigned') },
        myriad_id: { type: 'string', column: 'myriad_id', ...ro, label: L('myriadId') },
      }),
      m_request: resource('maintenance_request', '/data/maintenance_request', 'title', {
        title: { type: 'string', column: 'title', ...ro, label: L('requestTitle') },
        resident_id: resident(ro),
        category: enumOf('category', ['plumbing', 'electrical', 'ac', 'furniture', 'internet', 'other'], 'cat', 'category', ro),
        location: enumOf('location', ['room', 'bathroom', 'kitchen', 'common'], 'loc', 'location', ro),
        urgency: enumOf('urgency', ['low', 'normal', 'urgent'], 'urg', 'urgency', ro),
        description: { type: 'text', column: 'description', ...ro, label: L('description') },
        entry_allowed: { type: 'boolean', column: 'entry_allowed', ...ro, label: L('entryAllowed') },
        status: enumOf('status', ['open', 'scheduled', 'in_progress', 'done', 'cancelled'], 'req', 'status', { query: { filterable: true } }),
        status_note: { type: 'text', column: 'status_note', label: L('statusNote') },
      }, 'request'),
      m_complaint: resource('complaint', '/data/complaint', 'subject', {
        subject: { type: 'string', column: 'subject', ...ro, label: L('subject') },
        resident_id: { ...resident(ro), query: undefined },
        category: enumOf('category', ['noise', 'cleanliness', 'staff', 'security', 'other'], 'ccat', 'category', ro),
        description: { type: 'text', column: 'description', ...ro, label: L('description') },
        anonymous: { type: 'boolean', column: 'anonymous', ...ro, label: L('anonymous') },
        status: enumOf('status', ['open', 'scheduled', 'in_progress', 'done', 'cancelled'], 'req', 'status', { query: { filterable: true } }),
        status_note: { type: 'text', column: 'status_note', label: L('statusNote') },
      }),
      m_payment: resource('payment', '/data/payment', 'title', {
        resident_id: resident({ rules: { required: true } }),
        title: both('title', 'paymentTitle', { rules: { required: true } }),
        kind: enumOf('kind', ['rent', 'deposit', 'dues', 'fine'], 'kind', 'kind', { rules: { required: true } }),
        amount: money('amount', 'amount', { rules: { required: true } }),
        due_date: { type: 'date', column: 'due_date', label: L('dueDate') },
        status: enumOf('status', ['due', 'overdue', 'paid', 'cancelled'], 'pay', 'status', { default: 'due', query: { filterable: true } }),
        paid_at: datetime('paid_at', 'paidAt', ro),
        pay_intent: { type: 'string', column: 'pay_intent', ...ro, label: L('payIntent') },
      }),
      m_move_in: resource('move_in', '/data/move_in', 'resident_id', {
        resident_id: resident({ rules: { required: true } }),
        deposit: money('deposit', 'deposit', { rules: { required: true } }),
        first_rent: money('first_rent', 'firstRent', { rules: { required: true } }),
        total: money('total', 'total', ro),
      }, 'moveIn'),
      m_contract: resource('contract', '/data/contract', 'title', {
        resident_id: resident({ rules: { required: true } }),
        title: both('title', 'contractTitle', { rules: { required: true } }),
        summary: bothText('summary', 'summary'),
        signed: { type: 'boolean', column: 'signed', ...ro, label: L('signed') },
        signed_at: datetime('signed_at', 'signedAt', ro),
      }),
      m_consent: resource('guardian_consent', '/data/guardian_consent', 'guardian_name', {
        resident_id: resident({ rules: { required: true } }),
        guardian_name: { type: 'string', column: 'guardian_name', rules: { required: true }, label: L('guardianName') },
        guardian_email: { type: 'email', column: 'guardian_email', rules: { required: true }, label: L('guardianEmail') },
        guardian_phone: { type: 'phone', column: 'guardian_phone', label: L('guardianPhone') },
        title: both('title', 'contractTitle', { rules: { required: true } }),
        summary: bothText('summary', 'summary'),
        signed: { type: 'boolean', column: 'signed', ...ro, label: L('signed') },
        signed_at: datetime('signed_at', 'signedAt', ro),
      }, 'consent'),
      m_renewal: resource('renewal_offer', '/data/renewal_offer', 'resident_id', {
        resident_id: resident({ rules: { required: true } }),
        term: both('term', 'term', { rules: { required: true } }),
        rent: money('rent', 'rent', { rules: { required: true } }),
        start_date: { type: 'date', column: 'start_date', label: L('startDate') },
        respond_by: { type: 'date', column: 'respond_by', label: L('respondBy') },
        status: enumOf('status', ['open', 'accepted', 'declined', 'expired'], 'ren', 'status', { default: 'open', query: { filterable: true } }),
      }, 'renewal'),
      m_checkout: resource('checkout_request', '/data/checkout_request', 'resident_id', {
        resident_id: resident(ro),
        move_out_date: { type: 'date', column: 'move_out_date', ...ro, label: L('moveOutDate') },
        reason: enumOf('reason', ['graduated', 'transfer', 'break', 'other'], 'why', 'reason', ro),
        iban: { type: 'string', column: 'iban', ...ro, label: L('iban') },
        keys_returned: { type: 'boolean', column: 'keys_returned', ...ro, label: L('keysReturned') },
        status: enumOf('status', ['requested', 'inspected', 'refunded', 'closed'], 'out', 'status', { query: { filterable: true } }),
      }, 'checkout'),
      m_notice: resource('notice', '/data/notice', 'title', {
        title: both('title', 'noticeTitle', { rules: { required: true } }),
        body: bothText('body', 'body'),
        at: datetime('at', 'at'),
        pinned: { type: 'boolean', column: 'pinned', label: L('pinned') },
        building: { type: 'string', column: 'building', label: L('building') },
      }),
      m_step: resource('induction_step', '/data/induction_step', 'title', {
        position: { type: 'integer', column: 'position', rules: { required: true }, query: { sortable: true }, label: L('position') },
        icon: { type: 'string', column: 'icon', label: L('icon') },
        title: both('title', 'noticeTitle', { rules: { required: true } }),
        body: bothText('body', 'body'),
      }, 'step'),
    },
    screens: {
      'm.notfound': { kind: 'message', title: L('notFound'), body: L('pageNotFoundBody') },

      // ---- residents
      'm.residents': list('m_resident', 'residents', ['full_name', 'room', 'phone', 'balance', 'open_requests', 'contract_end'], 'm.resident.open',
        { toolbarActions: ['m.resident.create'], empty: { title: L('noResidents'), body: L('noResidentsBody') } }),
      'm.resident.new': {
        kind: 'record', resource: 'm_resident', newHeading: L('newResident'), actions: ['m.resident.back', 'm.resident.createSave'],
        sections: [{ label: L('details'), description: L('residentDetails'), items: items([['full_name', 8], ['room', 4], ['email', 6], ['phone', 6], ['contract_end', 4]]) }],
      },
      'm.resident.record': {
        kind: 'record', resource: 'm_resident', heading: 'full_name', hero: { meta: ['room', 'balance', 'open_requests'] }, actions: ['m.resident.back', 'm.resident.delete', 'm.resident.save'],
        sections: [
          { label: L('details'), description: L('residentDetails'), items: items([['full_name', 8], ['room', 4], ['email', 6], ['phone', 6], ['contract_end', 4], ['next_due_date', 4], ['contract_signed', 4], ['myriad_id', 4]]) },
          { label: L('account'), screen: 'm.resident.account' },
          { label: L('payments'), screen: 'm.resident.payments' },
          { label: L('requests'), screen: 'm.resident.requests' },
          { label: L('contracts'), screen: 'm.resident.contracts' },
          { label: L('renewals'), screen: 'm.resident.renewals' },
        ],
      },
      'm.resident.account': { kind: 'app', component: 'myriad.account', ownsGroups: true },
      'm.resident.payments': ofResident('m_payment', ['title', 'kind', 'amount', 'due_date', 'status'], 'm.payment.open'),
      'm.resident.requests': ofResident('m_request', ['title', 'category', 'status', 'created_at'], 'm.request.open'),
      'm.resident.contracts': ofResident('m_contract', ['title', 'signed', 'signed_at'], 'm.contract.open'),
      'm.resident.renewals': ofResident('m_renewal', ['term', 'rent', 'respond_by', 'status'], 'm.renewal.open'),

      'm.applications': { kind: 'app', component: 'myriad.applications', title: L('applications') },

      // ---- service
      'm.requests': list('m_request', 'requests', ['title', 'resident_id', 'category', 'urgency', 'status', 'created_at'], 'm.request.open',
        { filters: ['status'], empty: { title: L('noRequests'), body: L('noRequestsBody') } }),
      'm.request.record': {
        kind: 'record', resource: 'm_request', heading: 'title', hero: { meta: ['resident_id', 'status', 'urgency'] }, actions: ['m.request.back', 'm.request.save'],
        sections: [
          { label: L('details'), description: L('requestDetails'), items: items([['status', 4], ['urgency', 4], ['category', 4], ['location', 4], ['entry_allowed', 4], ['resident_id', 4], ['description', 12], ['status_note', 12]]) },
          { label: L('entryTimes'), screen: 'm.request.slots' },
          { label: L('photo'), screen: 'm.request.photo' },
        ],
      },
      'm.request.slots': { kind: 'app', component: 'myriad.slots', ownsGroups: true },
      'm.request.photo': { kind: 'app', component: 'myriad.file', ownsGroups: true, props: { collection: 'maintenance_request', field: 'photo' } },

      'm.complaints': list('m_complaint', 'complaints', ['subject', 'category', 'anonymous', 'status', 'created_at'], 'm.complaint.open',
        { filters: ['status'], empty: { title: L('noComplaints'), body: L('noComplaintsBody') } }),
      'm.complaint.record': {
        kind: 'record', resource: 'm_complaint', heading: 'subject', hero: { meta: ['category', 'status', 'anonymous'] }, actions: ['m.complaint.back', 'm.complaint.save'],
        sections: [{ label: L('details'), description: L('complaintDetails'), items: items([['status', 4], ['category', 4], ['anonymous', 4], ['resident_id', 6], ['description', 12], ['status_note', 12]]) }],
      },

      // ---- money
      'm.payments': list('m_payment', 'payments', ['title', 'resident_id', 'kind', 'amount', 'due_date', 'status'], 'm.payment.open',
        { filters: ['status'], toolbarActions: ['m.payment.create'], empty: { title: L('noPayments'), body: L('noPaymentsBody') } }),
      'm.payment.new': {
        kind: 'record', resource: 'm_payment', newHeading: L('newPayment'), actions: ['m.payment.back', 'm.payment.createSave'],
        sections: [{ label: L('details'), description: L('paymentDetails'), items: items([['resident_id', 6], ['kind', 6], ['title', 12], ['amount', 6], ['due_date', 6]]) }],
      },
      'm.payment.record': {
        kind: 'record', resource: 'm_payment', heading: 'title', hero: { meta: ['resident_id', 'amount', 'status'] }, actions: ['m.payment.back', 'm.payment.delete', 'm.payment.save'],
        sections: [{ label: L('details'), description: L('paymentDetails'), items: items([['resident_id', 6], ['kind', 6], ['title', 12], ['amount', 4], ['due_date', 4], ['status', 4], ['paid_at', 6], ['pay_intent', 6]]) }],
      },
      'm.moveins': list('m_move_in', 'moveIns', ['resident_id', 'deposit', 'first_rent', 'total', 'created_at'], 'm.moveIn.open', { search: false, toolbarActions: ['m.moveIn.create'] }),
      'm.movein.new': {
        kind: 'record', resource: 'm_move_in', newHeading: L('newMoveIn'), actions: ['m.moveIn.back', 'm.moveIn.createSave'],
        sections: [{ label: L('details'), description: L('moveInDetails'), items: items([['resident_id', 12], ['deposit', 6], ['first_rent', 6]]) }],
      },
      'm.movein.record': {
        kind: 'record', resource: 'm_move_in', heading: 'resident_id', hero: { meta: ['deposit', 'first_rent', 'total'] }, actions: ['m.moveIn.back', 'm.moveIn.delete', 'm.moveIn.save'],
        sections: [{ label: L('details'), description: L('moveInDetails'), items: items([['resident_id', 12], ['deposit', 4], ['first_rent', 4], ['total', 4]]) }],
      },

      // ---- documents
      'm.contracts': list('m_contract', 'contracts', ['title', 'resident_id', 'signed', 'signed_at', 'created_at'], 'm.contract.open', { toolbarActions: ['m.contract.create'] }),
      'm.contract.new': {
        kind: 'record', resource: 'm_contract', newHeading: L('newContract'), actions: ['m.contract.back', 'm.contract.createSave'],
        sections: [{ label: L('details'), description: L('contractDetails'), items: items([['resident_id', 12], ['title', 12], ['summary', 12]]) }],
      },
      'm.contract.record': {
        kind: 'record', resource: 'm_contract', heading: 'title', hero: { meta: ['resident_id', 'signed', 'signed_at'] }, actions: ['m.contract.back', 'm.contract.delete', 'm.contract.save'],
        sections: [
          { label: L('document'), screen: 'm.contract.document' },
          { label: L('details'), description: L('contractDetails'), items: items([['resident_id', 12], ['title', 12], ['summary', 12], ['signed', 6], ['signed_at', 6]]) },
        ],
      },
      'm.contract.document': { kind: 'app', component: 'myriad.document', ownsGroups: true },
      'm.consents': list('m_consent', 'consents', ['guardian_name', 'resident_id', 'guardian_email', 'signed', 'created_at'], 'm.consent.open', { toolbarActions: ['m.consent.create'] }),
      'm.consent.new': {
        kind: 'record', resource: 'm_consent', newHeading: L('newConsent'), actions: ['m.consent.back', 'm.consent.createSave'],
        sections: [{ label: L('details'), description: L('consentDetails'), items: items([['resident_id', 12], ['guardian_name', 6], ['guardian_email', 6], ['guardian_phone', 6], ['title', 12], ['summary', 12]]) }],
      },
      'm.consent.record': {
        kind: 'record', resource: 'm_consent', heading: 'guardian_name', hero: { meta: ['resident_id', 'signed', 'signed_at'] }, actions: ['m.consent.back', 'm.consent.delete', 'm.consent.save'],
        sections: [
          { label: L('signingLink'), screen: 'm.consent.link' },
          { label: L('details'), description: L('consentDetails'), items: items([['resident_id', 12], ['guardian_name', 6], ['guardian_email', 6], ['guardian_phone', 6], ['title', 12], ['summary', 12], ['signed', 6], ['signed_at', 6]]) },
        ],
      },
      'm.consent.link': { kind: 'app', component: 'myriad.guardianLink', ownsGroups: true },
      'm.renewals': list('m_renewal', 'renewals', ['resident_id', 'term', 'rent', 'respond_by', 'status'], 'm.renewal.open', { filters: ['status'], toolbarActions: ['m.renewal.create'] }),
      'm.renewal.new': {
        kind: 'record', resource: 'm_renewal', newHeading: L('newRenewal'), actions: ['m.renewal.back', 'm.renewal.createSave'],
        sections: [{ label: L('details'), description: L('renewalDetails'), items: items([['resident_id', 12], ['term', 12], ['rent', 4], ['start_date', 4], ['respond_by', 4]]) }],
      },
      'm.renewal.record': {
        kind: 'record', resource: 'm_renewal', heading: 'term', hero: { meta: ['resident_id', 'rent', 'status'] }, actions: ['m.renewal.back', 'm.renewal.delete', 'm.renewal.save'],
        sections: [{ label: L('details'), description: L('renewalDetails'), items: items([['resident_id', 12], ['term', 12], ['rent', 4], ['start_date', 4], ['respond_by', 4], ['status', 6]]) }],
      },
      'm.checkouts': list('m_checkout', 'checkouts', ['resident_id', 'move_out_date', 'reason', 'keys_returned', 'status'], 'm.checkout.open', { search: false, filters: ['status'] }),
      'm.checkout.record': {
        kind: 'record', resource: 'm_checkout', heading: 'resident_id', hero: { meta: ['move_out_date', 'reason', 'status'] }, actions: ['m.checkout.back', 'm.checkout.save'],
        sections: [
          { label: L('details'), description: L('checkoutDetails'), items: items([['status', 6], ['resident_id', 6], ['move_out_date', 4], ['reason', 4], ['keys_returned', 4], ['iban', 12]]) },
          { label: L('roomPhoto'), screen: 'm.checkout.photo' },
        ],
      },
      'm.checkout.photo': { kind: 'app', component: 'myriad.file', ownsGroups: true, props: { collection: 'checkout_request', field: 'room_photo' } },

      // ---- community
      'm.notices': list('m_notice', 'notices', ['title', 'at', 'pinned', 'building'], 'm.notice.open', { toolbarActions: ['m.notice.create'] }),
      'm.notice.new': {
        kind: 'record', resource: 'm_notice', newHeading: L('newNotice'), actions: ['m.notice.back', 'm.notice.createSave'],
        sections: [{ label: L('details'), description: L('noticeDetails'), items: items([['title', 12], ['body', 12], ['at', 6], ['building', 4], ['pinned', 2]]) }],
      },
      'm.notice.record': {
        kind: 'record', resource: 'm_notice', heading: 'title', hero: { meta: ['at', 'pinned'] }, actions: ['m.notice.back', 'm.notice.delete', 'm.notice.save'],
        sections: [{ label: L('details'), description: L('noticeDetails'), items: items([['title', 12], ['body', 12], ['at', 6], ['building', 4], ['pinned', 2]]) }],
      },
      'm.steps': list('m_step', 'induction', ['position', 'title', 'icon'], 'm.step.open', { search: false, defaultSort: { field: 'position', dir: 'asc' }, toolbarActions: ['m.step.create'] }),
      'm.step.new': {
        kind: 'record', resource: 'm_step', newHeading: L('newStep'), actions: ['m.step.back', 'm.step.createSave'],
        sections: [{ label: L('details'), description: L('stepDetails'), items: items([['position', 3], ['icon', 3], ['title', 12], ['body', 12]]) }],
      },
      'm.step.record': {
        kind: 'record', resource: 'm_step', heading: 'title', hero: { meta: ['position'] }, actions: ['m.step.back', 'm.step.delete', 'm.step.save'],
        sections: [{ label: L('details'), description: L('stepDetails'), items: items([['position', 3], ['icon', 3], ['title', 12], ['body', 12]]) }],
      },
    },
    routes: [
      { path: '/residents', screen: 'm.residents', keepAlive: true },
      { path: '/residents/new', screen: 'm.resident.new' },
      { path: '/residents/:id', screen: 'm.resident.record', shape: { content: { padding: 'none' } } },
      { path: '/applications', screen: 'm.applications' },
      { path: '/requests', screen: 'm.requests', keepAlive: true },
      { path: '/requests/:id', screen: 'm.request.record', shape: { content: { padding: 'none' } } },
      { path: '/complaints', screen: 'm.complaints', keepAlive: true },
      { path: '/complaints/:id', screen: 'm.complaint.record', shape: { content: { padding: 'none' } } },
      { path: '/payments', screen: 'm.payments', keepAlive: true },
      { path: '/payments/new', screen: 'm.payment.new' },
      { path: '/payments/:id', screen: 'm.payment.record', shape: { content: { padding: 'none' } } },
      { path: '/move-ins', screen: 'm.moveins', keepAlive: true },
      { path: '/move-ins/new', screen: 'm.movein.new' },
      { path: '/move-ins/:id', screen: 'm.movein.record', shape: { content: { padding: 'none' } } },
      { path: '/contracts', screen: 'm.contracts', keepAlive: true },
      { path: '/contracts/new', screen: 'm.contract.new' },
      { path: '/contracts/:id', screen: 'm.contract.record', shape: { content: { padding: 'none' } } },
      { path: '/consents', screen: 'm.consents', keepAlive: true },
      { path: '/consents/new', screen: 'm.consent.new' },
      { path: '/consents/:id', screen: 'm.consent.record', shape: { content: { padding: 'none' } } },
      { path: '/renewals', screen: 'm.renewals', keepAlive: true },
      { path: '/renewals/new', screen: 'm.renewal.new' },
      { path: '/renewals/:id', screen: 'm.renewal.record', shape: { content: { padding: 'none' } } },
      { path: '/check-outs', screen: 'm.checkouts', keepAlive: true },
      { path: '/check-outs/:id', screen: 'm.checkout.record', shape: { content: { padding: 'none' } } },
      { path: '/notices', screen: 'm.notices', keepAlive: true },
      { path: '/notices/new', screen: 'm.notice.new' },
      { path: '/notices/:id', screen: 'm.notice.record', shape: { content: { padding: 'none' } } },
      { path: '/induction', screen: 'm.steps', keepAlive: true },
      { path: '/induction/new', screen: 'm.step.new' },
      { path: '/induction/:id', screen: 'm.step.record', shape: { content: { padding: 'none' } } },
    ],
    menu: [
      { id: 'm_residence', label: L('residence'), icon: 'buildings', order: 1, items: [
        { key: 'm.residents', label: L('residents'), route: '/residents', icon: 'users', order: 10 },
        { key: 'm.applications', label: L('applications'), route: '/applications', icon: 'file', order: 20 },
        { key: 'm.moveins', label: L('moveIns'), route: '/move-ins', icon: 'plus', order: 30 },
        { key: 'm.renewals', label: L('renewals'), route: '/renewals', icon: 'history', order: 40 },
        { key: 'm.checkouts', label: L('checkouts'), route: '/check-outs', icon: 'logout', order: 50 },
      ] },
      { id: 'm_service', label: L('service'), icon: 'grid', order: 2, items: [
        { key: 'm.requests', label: L('requests'), route: '/requests', icon: 'edit', order: 10 },
        { key: 'm.complaints', label: L('complaints'), route: '/complaints', icon: 'support', order: 20 },
      ] },
      { id: 'm_money', label: L('money'), icon: 'grid', order: 3, items: [
        { key: 'm.payments', label: L('payments'), route: '/payments', icon: 'file', order: 10 },
      ] },
      { id: 'm_documents', label: L('documents'), icon: 'file', order: 4, items: [
        { key: 'm.contracts', label: L('contracts'), route: '/contracts', icon: 'file', order: 10 },
        { key: 'm.consents', label: L('consents'), route: '/consents', icon: 'users', order: 20 },
      ] },
      { id: 'm_community', label: L('community'), icon: 'users', order: 5, items: [
        { key: 'm.notices', label: L('notices'), route: '/notices', icon: 'bell', order: 10 },
        { key: 'm.steps', label: L('induction'), route: '/induction', icon: 'note', order: 20 },
      ] },
    ],
    overlays: {},
    actions: {
      ...crud('resident', '/residents', { create: 'newResident', label: 'createResident', deleted: 'deleteResident' }),
      ...crud('payment', '/payments', { create: 'newPayment', label: 'createPayment', deleted: 'deletePayment' }),
      ...crud('move_in', '/move-ins', { create: 'newMoveIn', label: 'createMoveIn', deleted: 'confirmDelete', key: 'moveIn' }),
      ...crud('contract', '/contracts', { create: 'newContract', label: 'createContract', deleted: 'deleteContract' }),
      ...crud('guardian_consent', '/consents', { create: 'newConsent', label: 'createConsent', deleted: 'confirmDelete', key: 'consent' }),
      ...crud('renewal_offer', '/renewals', { create: 'newRenewal', label: 'createRenewal', deleted: 'confirmDelete', key: 'renewal' }),
      ...crud('notice', '/notices', { create: 'newNotice', label: 'createNotice', deleted: 'confirmDelete' }),
      ...crud('induction_step', '/induction', { create: 'newStep', label: 'createStep', deleted: 'confirmDelete', key: 'step' }),
      ...view('maintenance_request', '/requests', 'request'),
      ...view('complaint', '/complaints'),
      ...view('checkout_request', '/check-outs', 'checkout'),
    },
  };
}
