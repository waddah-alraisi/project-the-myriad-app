// The code behind the manifest's `kind: "app"` screens (src/manifest.js), by component name.
import { appScreen } from './host.js';
import { accountView } from '../views/account.js';
import { applicationsView } from '../views/applications.js';
import { documentView } from '../views/document.js';
import { fileView } from '../views/file.js';
import { guardianLinkView } from '../views/guardian.js';
import { slotsView } from '../views/slots.js';

export const COMPONENTS = {
  'myriad.account': appScreen(accountView),
  'myriad.applications': appScreen(applicationsView),
  'myriad.document': appScreen(documentView),
  'myriad.file': appScreen(fileView),
  'myriad.guardianLink': appScreen(guardianLinkView),
  'myriad.slots': appScreen(slotsView),
};
