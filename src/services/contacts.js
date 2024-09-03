import { contactCollection } from "../db/models/Contact.js"

export const getAllContacts = () => contactCollection.find()

export const getContactByID = (contactId) => contactCollection.findById(contactId)