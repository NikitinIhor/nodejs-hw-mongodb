import { contactCollection } from "../db/models/Contact.js"

export const getAllContacts = () => contactCollection.find()

export const getContactByID = (id) => contactCollection.findById(id)