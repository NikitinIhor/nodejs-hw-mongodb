import { contactCollection } from "../db/models/Contact.js"

export const getAllContacts = () => contactCollection.find()

export const getContactByID = (contactId) => contactCollection.findById(contactId)

export const createContact = (payload) => contactCollection.create(payload)

export const updateContact = async (filter, data, options = {}) => {
    const rawResult = await contactCollection.findOneAndUpdate(filter, data, {
        new: true,
        includeResultMetadata: true,
        ...options,
    })

    if (!rawResult || !rawResult.value) return null

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted)
    }
};

export const deleteContact = (filter) => contactCollection.findOneAndDelete(filter)