import { Router } from 'express';
import * as contactControllers from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import { contactAddShema, contactPatchShema } from '../validation/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';

import { authenticate } from '../middlewares/authenticate.js';

export const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get(
  '/',
  ctrlWrapper(contactControllers.getAllContactsController)
);

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactControllers.getContactByIdController)
);

contactsRouter.post(
  '/',
  validateBody(contactAddShema),
  ctrlWrapper(contactControllers.postContactController)
);

contactsRouter.put(
  '/:contactId',
  isValidId,
  validateBody(contactAddShema),
  ctrlWrapper(contactControllers.upsertContactController)
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(contactPatchShema),
  ctrlWrapper(contactControllers.patchContactController)
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactControllers.deleteContactController)
);
