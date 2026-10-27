// Arabic first; English when the person's OnCloud locale is English. Latin digits in both (OnCloud's rule).
const strings = {
  en: {
    title: 'The Myriad — Team',
    loading: 'Loading…',
    signIn: 'Sign in with OnCloud',
    signInAgain: 'Sign in again',
    failed: 'Could not reach OnCloud.',
    startFailed: 'The app could not start.',
    startNotFound: 'This app is not installed in your workspace.',
    startRefused: 'OnCloud refused this app. Ask your workspace admin to check it is installed and active.',
    startOrigin: 'OnCloud does not allow this address for the app. Add it to the app\'s allowed origins.',
    notFound: 'Not found',
    pageNotFoundBody: 'This page does not exist, or it was removed.',
    open: 'Open', back: 'Back', save: 'Save', saveDone: 'Saved', created: 'Created', delete: 'Delete', cancel: 'Cancel',
    confirmDelete: 'Delete this record?', empty: 'Nothing yet.', details: 'Details', added: 'Added', version: 'Version', id: 'ID',
    status: 'Status', actions: 'Actions', send: 'Send', sent: 'Sent', none: '—', yes: 'Yes', no: 'No',

    // menu groups
    residence: 'Residence', service: 'Service', money: 'Money', documents: 'Documents', community: 'Community',

    // residents
    residents: 'Residents', resident: 'Resident', newResident: 'New resident', createResident: 'Add resident', deleteResident: 'Delete this resident?',
    residentDetails: 'Who lives where, and how to reach them.',
    fullName: 'Full name', room: 'Room', email: 'Email', phone: 'Phone', contractEnd: 'Contract ends', balance: 'Balance due',
    openRequests: 'Open requests', nextDue: 'Next due', contractSigned: 'Contract signed', account: 'OnCloud account', myriadId: 'Myriad ID',
    noResidents: 'No residents yet', noResidentsBody: 'Add a resident, or make one from an application.',
    linked: 'Linked: the resident signs in to The Myriad app with this account.',
    notLinked: 'Not linked yet. Invite the resident to the app: they get an email, create their OnCloud account, and their app opens on this record.',
    inviteEmail: 'Their email', invite: 'Invite to the app', invited: 'Invitation sent to', invitedUntil: 'It works until', boundNow: 'Linked to the account already in the workspace.',

    // applications
    applications: 'Applications', applicationsNote: 'What people sent through the public application form.',
    noForm: 'There is no application form yet. Create it in the app\'s settings (Forms), then share its link.',
    form: 'Form', submitted: 'Sent', answers: 'Answers', makeResident: 'Make resident', discard: 'Discard', discarded: 'Discarded',
    processed: 'Made a resident', statusNew: 'New', showDone: 'Show handled', madeResident: 'Resident created and invited',
    'sub.new': 'New', 'sub.processed': 'Resident', 'sub.discarded': 'Discarded',

    // requests
    requests: 'Maintenance', request: 'Request', requestTitle: 'Title', category: 'Category', location: 'Where', urgency: 'Urgency',
    description: 'Description', entryAllowed: 'May enter', statusNote: 'Note to the resident', requestDetails: 'What is wrong, and where it stands.',
    noRequests: 'No requests', noRequestsBody: 'Requests residents send in the app appear here.',
    entryTimes: 'Entry times', proposeTime: 'Propose a time', start: 'From', end: 'Until', proposedBy: 'Proposed by', approvedTime: 'Approved',
    noTimes: 'No times proposed yet.', timeProposed: 'Time proposed — the resident is told', endAfterStart: 'The end must be after the start.',
    photo: 'Photo', noPhoto: 'No photo.', openFile: 'Open',
    'cat.plumbing': 'Plumbing', 'cat.electrical': 'Electrical', 'cat.ac': 'Air conditioning', 'cat.furniture': 'Furniture', 'cat.internet': 'Internet', 'cat.other': 'Other',
    'loc.room': 'Room', 'loc.bathroom': 'Bathroom', 'loc.kitchen': 'Kitchen', 'loc.common': 'Common area',
    'urg.low': 'Low', 'urg.normal': 'Normal', 'urg.urgent': 'Urgent',
    'req.open': 'Open', 'req.scheduled': 'Scheduled', 'req.in_progress': 'In progress', 'req.done': 'Done', 'req.cancelled': 'Cancelled',
    'by.team': 'Team', 'by.resident': 'Resident',

    // complaints
    complaints: 'Complaints', complaint: 'Complaint', subject: 'Subject', anonymous: 'Anonymous', complaintDetails: 'What was reported. An anonymous complaint does not show who sent it.',
    noComplaints: 'No complaints', noComplaintsBody: 'Complaints residents send in the app appear here.',
    'ccat.noise': 'Noise', 'ccat.cleanliness': 'Cleanliness', 'ccat.staff': 'Staff', 'ccat.security': 'Security', 'ccat.other': 'Other',

    // payments
    payments: 'Payments', payment: 'Payment', newPayment: 'New payment', createPayment: 'Add payment', deletePayment: 'Delete this payment?',
    paymentDetails: 'What the resident owes. They pay it in the app; it turns Paid by itself.', paymentTitle: 'What for', kind: 'Kind', amount: 'Amount',
    dueDate: 'Due', paidAt: 'Paid at', payIntent: 'Payment reference', noPayments: 'No payments', noPaymentsBody: 'Add a charge for a resident: they are told, and pay it in the app.',
    'kind.rent': 'Rent', 'kind.deposit': 'Deposit', 'kind.dues': 'Dues', 'kind.fine': 'Fine',
    'pay.due': 'Due', 'pay.overdue': 'Overdue', 'pay.paid': 'Paid', 'pay.cancelled': 'Cancelled',

    // move-ins
    moveIns: 'Move-ins', moveIn: 'Move-in', newMoveIn: 'New move-in', createMoveIn: 'Add move-in', deposit: 'Deposit', firstRent: 'First rent', total: 'Total',
    moveInDetails: 'What a new resident pays before moving in.',

    // contracts
    contracts: 'Contracts', contract: 'Contract', newContract: 'New contract', createContract: 'Add contract', deleteContract: 'Delete this contract?',
    contractTitle: 'Title', summary: 'Summary', signed: 'Signed', signedAt: 'Signed at', contractDetails: 'The resident reads and signs it in the app, with a code sent to them.',
    document: 'Document', uploadPdf: 'Upload the PDF', replacePdf: 'Replace the PDF', uploading: 'Uploading…', uploaded: 'Uploaded',
    noDocument: 'No document yet. Upload the contract as a PDF.', lockedSigned: 'Signed: the contract and its document can no longer change.',
    pages: 'pages', onlyPdf: 'Choose a PDF file.',

    // guardian consents
    consents: 'Guardian consents', consent: 'Guardian consent', newConsent: 'New guardian consent', createConsent: 'Add consent',
    guardianName: 'Guardian', guardianEmail: 'Guardian email', guardianPhone: 'Guardian phone', consentDetails: 'For a resident under 18: the guardian signs with a one-time link, no account needed.',
    signingLink: 'Signing link', sendLink: 'Email the signing link', linkSent: 'Link sent — it works once, for 72 hours', noGuardianEmail: 'Add the guardian\'s email first.',
    alreadySigned: 'Signed by the guardian.',

    // renewals
    renewals: 'Renewal offers', renewal: 'Renewal offer', newRenewal: 'New renewal offer', createRenewal: 'Add offer', term: 'Term', rent: 'Rent',
    startDate: 'Starts', respondBy: 'Answer by', renewalDetails: 'The resident accepts or declines it in the app.',
    'ren.open': 'Open', 'ren.accepted': 'Accepted', 'ren.declined': 'Declined', 'ren.expired': 'Expired',

    // check-outs
    checkouts: 'Check-outs', checkout: 'Check-out', moveOutDate: 'Moving out', reason: 'Reason', iban: 'IBAN (for the deposit)', roomPhoto: 'Room photo',
    keysReturned: 'Keys returned', checkoutDetails: 'What the resident told us before leaving. Move it on as you inspect and refund.',
    'why.graduated': 'Graduated', 'why.transfer': 'Transfer', 'why.break': 'Break', 'why.other': 'Other',
    'out.requested': 'Requested', 'out.inspected': 'Inspected', 'out.refunded': 'Refunded', 'out.closed': 'Closed',

    // notices and induction
    notices: 'Notices', notice: 'Notice', newNotice: 'New notice', createNotice: 'Publish notice', noticeTitle: 'Title', body: 'Text', at: 'Date',
    pinned: 'Pinned', building: 'Building', noticeDetails: 'Every resident sees it in the app.',
    induction: 'Induction', step: 'Step', newStep: 'New step', createStep: 'Add step', position: 'Order', icon: 'Icon', stepDetails: 'What a new resident reads, in order.',

    // errors
    errLocked: 'This record is locked and can no longer change.', errConflict: 'Someone changed this in the meantime. Reload and try again.',
    errQuota: 'The app has reached its storage limit.', errScope: 'The app is not allowed to do this.', errOrigin: 'This address is not allowed for the app.',
    errUnavailable: 'OnCloud\'s app data is not reachable right now. Try again shortly.', errInvalid: 'Some fields need attention.',
    errSignedOut: 'You were signed out. Sign in again.', errGeneric: 'That did not work.',
  },
  ar: {
    title: 'ذا ميرياد — الفريق',
    loading: 'جارٍ التحميل…',
    signIn: 'تسجيل الدخول عبر OnCloud',
    signInAgain: 'تسجيل الدخول مرة أخرى',
    failed: 'تعذّر الاتصال بـ OnCloud.',
    startFailed: 'تعذّر تشغيل التطبيق.',
    startNotFound: 'هذا التطبيق غير مثبّت في مساحة عملك.',
    startRefused: 'رفض OnCloud هذا التطبيق. اطلب من مسؤول مساحة العمل التحقق من أنه مثبّت ومفعّل.',
    startOrigin: 'لا يسمح OnCloud لهذا العنوان بتشغيل التطبيق. أضفه إلى العناوين المسموح بها.',
    notFound: 'غير موجود',
    pageNotFoundBody: 'هذه الصفحة غير موجودة أو أُزيلت.',
    open: 'فتح', back: 'رجوع', save: 'حفظ', saveDone: 'تم الحفظ', created: 'تمت الإضافة', delete: 'حذف', cancel: 'إلغاء',
    confirmDelete: 'حذف هذا السجل؟', empty: 'لا شيء بعد.', details: 'التفاصيل', added: 'أُضيف', version: 'الإصدار', id: 'المعرّف',
    status: 'الحالة', actions: 'إجراءات', send: 'إرسال', sent: 'أُرسل', none: '—', yes: 'نعم', no: 'لا',

    residence: 'السكن', service: 'الخدمة', money: 'المال', documents: 'المستندات', community: 'المجتمع',

    residents: 'السكان', resident: 'الساكن', newResident: 'ساكن جديد', createResident: 'إضافة ساكن', deleteResident: 'حذف هذا الساكن؟',
    residentDetails: 'من يسكن أين، وكيف نتواصل معه.',
    fullName: 'الاسم الكامل', room: 'الغرفة', email: 'البريد الإلكتروني', phone: 'الهاتف', contractEnd: 'نهاية العقد', balance: 'الرصيد المستحق',
    openRequests: 'الطلبات المفتوحة', nextDue: 'الاستحقاق القادم', contractSigned: 'العقد موقّع', account: 'حساب OnCloud', myriadId: 'معرّف ميرياد',
    noResidents: 'لا يوجد سكان بعد', noResidentsBody: 'أضف ساكنًا، أو حوّل طلب سكن إلى ساكن.',
    linked: 'مرتبط: يدخل الساكن إلى تطبيق ذا ميرياد بهذا الحساب.',
    notLinked: 'غير مرتبط بعد. ادعُ الساكن إلى التطبيق: يصله بريد، فينشئ حسابه في OnCloud، ويفتح تطبيقه على هذا السجل.',
    inviteEmail: 'بريده الإلكتروني', invite: 'دعوة إلى التطبيق', invited: 'أُرسلت الدعوة إلى', invitedUntil: 'تعمل حتى', boundNow: 'رُبط بالحساب الموجود في مساحة العمل.',

    applications: 'طلبات السكن', applicationsNote: 'ما أرسله الناس عبر نموذج طلب السكن العام.',
    noForm: 'لا يوجد نموذج طلب سكن بعد. أنشئه من إعدادات التطبيق (النماذج) ثم شارك رابطه.',
    form: 'النموذج', submitted: 'أُرسل', answers: 'الإجابات', makeResident: 'تحويل إلى ساكن', discard: 'استبعاد', discarded: 'استُبعد',
    processed: 'حُوّل إلى ساكن', statusNew: 'جديد', showDone: 'عرض ما عولج', madeResident: 'أُنشئ الساكن وأُرسلت الدعوة',
    'sub.new': 'جديد', 'sub.processed': 'ساكن', 'sub.discarded': 'مستبعد',

    requests: 'الصيانة', request: 'الطلب', requestTitle: 'العنوان', category: 'الفئة', location: 'المكان', urgency: 'الأولوية',
    description: 'الوصف', entryAllowed: 'يُسمح بالدخول', statusNote: 'ملاحظة للساكن', requestDetails: 'ما المشكلة، وأين وصلت.',
    noRequests: 'لا توجد طلبات', noRequestsBody: 'تظهر هنا الطلبات التي يرسلها السكان من التطبيق.',
    entryTimes: 'مواعيد الدخول', proposeTime: 'اقتراح موعد', start: 'من', end: 'إلى', proposedBy: 'اقترحه', approvedTime: 'معتمد',
    noTimes: 'لم يُقترح أي موعد بعد.', timeProposed: 'اقتُرح الموعد — أُبلغ الساكن', endAfterStart: 'يجب أن يكون الانتهاء بعد البدء.',
    photo: 'الصورة', noPhoto: 'لا توجد صورة.', openFile: 'فتح',
    'cat.plumbing': 'سباكة', 'cat.electrical': 'كهرباء', 'cat.ac': 'تكييف', 'cat.furniture': 'أثاث', 'cat.internet': 'إنترنت', 'cat.other': 'أخرى',
    'loc.room': 'الغرفة', 'loc.bathroom': 'دورة المياه', 'loc.kitchen': 'المطبخ', 'loc.common': 'منطقة مشتركة',
    'urg.low': 'منخفضة', 'urg.normal': 'عادية', 'urg.urgent': 'عاجلة',
    'req.open': 'مفتوح', 'req.scheduled': 'مجدول', 'req.in_progress': 'قيد التنفيذ', 'req.done': 'منجز', 'req.cancelled': 'ملغى',
    'by.team': 'الفريق', 'by.resident': 'الساكن',

    complaints: 'الشكاوى', complaint: 'الشكوى', subject: 'الموضوع', anonymous: 'دون اسم', complaintDetails: 'ما أُبلغ عنه. الشكوى دون اسم لا تُظهر مرسلها.',
    noComplaints: 'لا توجد شكاوى', noComplaintsBody: 'تظهر هنا الشكاوى التي يرسلها السكان من التطبيق.',
    'ccat.noise': 'إزعاج', 'ccat.cleanliness': 'نظافة', 'ccat.staff': 'الموظفون', 'ccat.security': 'الأمن', 'ccat.other': 'أخرى',

    payments: 'المدفوعات', payment: 'الدفعة', newPayment: 'دفعة جديدة', createPayment: 'إضافة دفعة', deletePayment: 'حذف هذه الدفعة؟',
    paymentDetails: 'ما على الساكن دفعه. يدفعه من التطبيق، وتتحول حالته إلى مدفوع تلقائيًا.', paymentTitle: 'مقابل', kind: 'النوع', amount: 'المبلغ',
    dueDate: 'الاستحقاق', paidAt: 'وقت الدفع', payIntent: 'مرجع الدفع', noPayments: 'لا توجد مدفوعات', noPaymentsBody: 'أضف رسومًا لساكن: يُبلَّغ بها ويدفعها من التطبيق.',
    'kind.rent': 'إيجار', 'kind.deposit': 'تأمين', 'kind.dues': 'رسوم', 'kind.fine': 'غرامة',
    'pay.due': 'مستحق', 'pay.overdue': 'متأخر', 'pay.paid': 'مدفوع', 'pay.cancelled': 'ملغى',

    moveIns: 'الانتقال', moveIn: 'الانتقال', newMoveIn: 'انتقال جديد', createMoveIn: 'إضافة انتقال', deposit: 'التأمين', firstRent: 'الإيجار الأول', total: 'الإجمالي',
    moveInDetails: 'ما يدفعه الساكن الجديد قبل الانتقال.',

    contracts: 'العقود', contract: 'العقد', newContract: 'عقد جديد', createContract: 'إضافة عقد', deleteContract: 'حذف هذا العقد؟',
    contractTitle: 'العنوان', summary: 'الملخص', signed: 'موقّع', signedAt: 'وقت التوقيع', contractDetails: 'يقرؤه الساكن ويوقّعه من التطبيق برمز يُرسل إليه.',
    document: 'المستند', uploadPdf: 'رفع ملف PDF', replacePdf: 'استبدال ملف PDF', uploading: 'جارٍ الرفع…', uploaded: 'تم الرفع',
    noDocument: 'لا يوجد مستند بعد. ارفع العقد بصيغة PDF.', lockedSigned: 'موقّع: لا يمكن تغيير العقد ولا مستنده بعد الآن.',
    pages: 'صفحات', onlyPdf: 'اختر ملف PDF.',

    consents: 'موافقات أولياء الأمور', consent: 'موافقة ولي الأمر', newConsent: 'موافقة جديدة', createConsent: 'إضافة موافقة',
    guardianName: 'ولي الأمر', guardianEmail: 'بريد ولي الأمر', guardianPhone: 'هاتف ولي الأمر', consentDetails: 'لساكن دون 18 سنة: يوقّع ولي الأمر برابط لمرة واحدة دون حساب.',
    signingLink: 'رابط التوقيع', sendLink: 'إرسال رابط التوقيع بالبريد', linkSent: 'أُرسل الرابط — يعمل مرة واحدة لمدة 72 ساعة', noGuardianEmail: 'أضف بريد ولي الأمر أولًا.',
    alreadySigned: 'وقّعها ولي الأمر.',

    renewals: 'عروض التجديد', renewal: 'عرض التجديد', newRenewal: 'عرض تجديد جديد', createRenewal: 'إضافة عرض', term: 'المدة', rent: 'الإيجار',
    startDate: 'يبدأ', respondBy: 'الرد قبل', renewalDetails: 'يقبله الساكن أو يرفضه من التطبيق.',
    'ren.open': 'مفتوح', 'ren.accepted': 'مقبول', 'ren.declined': 'مرفوض', 'ren.expired': 'منتهٍ',

    checkouts: 'الإخلاء', checkout: 'الإخلاء', moveOutDate: 'تاريخ المغادرة', reason: 'السبب', iban: 'رقم IBAN (لاسترداد التأمين)', roomPhoto: 'صورة الغرفة',
    keysReturned: 'سُلّمت المفاتيح', checkoutDetails: 'ما أبلغنا به الساكن قبل المغادرة. حدّث الحالة مع الفحص والاسترداد.',
    'why.graduated': 'تخرّج', 'why.transfer': 'انتقال', 'why.break': 'إجازة', 'why.other': 'أخرى',
    'out.requested': 'مطلوب', 'out.inspected': 'تم الفحص', 'out.refunded': 'تم الاسترداد', 'out.closed': 'مغلق',

    notices: 'الإعلانات', notice: 'الإعلان', newNotice: 'إعلان جديد', createNotice: 'نشر الإعلان', noticeTitle: 'العنوان', body: 'النص', at: 'التاريخ',
    pinned: 'مثبّت', building: 'المبنى', noticeDetails: 'يراه كل السكان في التطبيق.',
    induction: 'التعريف', step: 'الخطوة', newStep: 'خطوة جديدة', createStep: 'إضافة خطوة', position: 'الترتيب', icon: 'الأيقونة', stepDetails: 'ما يقرؤه الساكن الجديد بالترتيب.',

    errLocked: 'هذا السجل مقفل ولا يمكن تغييره.', errConflict: 'غيّر أحدهم هذا في الأثناء. أعد التحميل وحاول مرة أخرى.',
    errQuota: 'بلغ التطبيق حد التخزين.', errScope: 'لا يُسمح للتطبيق بهذا.', errOrigin: 'هذا العنوان غير مسموح به للتطبيق.',
    errUnavailable: 'بيانات التطبيقات في OnCloud غير متاحة الآن. حاول بعد قليل.', errInvalid: 'بعض الحقول تحتاج إلى مراجعة.',
    errSignedOut: 'سُجّل خروجك. سجّل الدخول مرة أخرى.', errGeneric: 'لم ينجح ذلك.',
  },
};

let lang = 'ar';

export function setLocale(locale) {
  lang = String(locale || 'ar').startsWith('en') ? 'en' : 'ar';
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

export const locale = () => lang;
export const t = (key) => strings[lang][key] ?? strings.en[key] ?? key;
export const keys = (l) => Object.keys(strings[l]);
// Both languages, for the manifest: the runtime picks the reader's.
export const both = (key) => ({ en: strings.en[key] ?? key, ar: strings.ar[key] ?? strings.en[key] ?? key });
// A {en, ar} value in the reader's language.
export const pick = (v) => (v && typeof v === 'object' ? v[lang] ?? v.en ?? v.ar ?? '' : v ?? '');
// Latin digits, two places unless asked.
export const num = (n, digits = 0) => (n == null || n === '' ? '' : Number(n).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }));
// Minor units (baisa) as OMR: 250000 → "250.000 OMR".
export const omr = (minor) => (minor == null ? '' : `${num(Number(minor) / 1000, 3)} OMR`);
