import { Router } from "express"
import * as contactControllers from "../controllers/contacts.js"
import { ctrlWrapper } from "../utils/ctrlWrapper.js"

export const contactsRouter = Router()

contactsRouter.get("/", ctrlWrapper(contactControllers.getAllContactsController));
contactsRouter.get("/:contactId", ctrlWrapper(contactControllers.getContactByIdController));
contactsRouter.post("/", ctrlWrapper(contactControllers.postContactController));
contactsRouter.put("/:contactId", ctrlWrapper(contactControllers.upsertContactController));
contactsRouter.patch("/:contactId", ctrlWrapper(contactControllers.patchContactController));
contactsRouter.delete("/:contactId", ctrlWrapper(contactControllers.deleteContactController));
