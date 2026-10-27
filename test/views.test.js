import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keys } from '../src/i18n.js';
import { answerLines, residentFrom } from '../src/views/applications.js';
import { windowError } from '../src/views/slots.js';
import { isPdf } from '../src/views/document.js';

test('a submission becomes a resident with only what the applicant gave', () => {
  assert.deepEqual(residentFrom({ name: ' Aisha Al-Balushi ', email: 'aisha@x.test', phone: '+968 9000 0001', answers: { room: 'single' } }),
    { full_name: 'Aisha Al-Balushi', email: 'aisha@x.test', phone: '+968 9000 0001' });
  assert.deepEqual(residentFrom({ name: '', email: 'only@mail.test' }), { full_name: 'only@mail.test', email: 'only@mail.test' });
});

test('answers read as the form asked them: labels, choices, yes, files, and nothing empty', () => {
  const form = { questions: [
    { key: 'room', type: 'select', label: { en: 'Room type', ar: 'نوع الغرفة' }, options: [{ value: 'single', label: { en: 'Single', ar: 'فردية' } }] },
    { key: 'under18', type: 'yesno', label: { en: 'Under 18', ar: 'دون 18' } },
    { key: 'id_copy', type: 'file', label: { en: 'ID copy', ar: 'الهوية' } },
  ] };
  assert.deepEqual(answerLines(form, { answers: { room: 'single', under18: true, id_copy: 'F1', note: '', other: false } }),
    ['نوع الغرفة: فردية', 'دون 18: نعم', 'الهوية: 📎']);
});

test('an entry window ends after it starts', () => {
  assert.equal(windowError('2026-11-01T10:00', '2026-11-01T12:00'), null);
  assert.equal(windowError('2026-11-01T12:00', '2026-11-01T10:00'), 'endAfterStart');
  assert.equal(windowError('', '2026-11-01T10:00'), 'errInvalid');
});

test('only a PDF is a contract document', () => {
  assert.equal(isPdf({ name: 'c.pdf', type: '' }), true);
  assert.equal(isPdf({ name: 'c.docx', type: 'application/vnd.openxmlformats' }), false);
});

test('every word exists in both languages', () => {
  assert.deepEqual(keys('ar').filter((k) => !keys('en').includes(k)), []);
  assert.deepEqual(keys('en').filter((k) => !keys('ar').includes(k)), []);
});
