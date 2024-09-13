import { SORT_ORDER } from '../constants/sort.js';
import { contactCollection } from '../db/models/Contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
}) => {
  const skip = (page - 1) * perPage;
  const contacts = await contactCollection
    .find()
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const totalItems = await contactCollection.find().countDocuments();

  const paginationData = calculatePaginationData({ page, perPage, totalItems });

  return {
    data: contacts,
    totalItems,
    page,
    perPage,
    ...paginationData,
  };
};

export const getContactByID = contactId =>
  contactCollection.findById(contactId);

export const createContact = payload => contactCollection.create(payload);

export const updateContact = async (filter, data, options = {}) => {
  const rawResult = await contactCollection.findOneAndUpdate(filter, data, {
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = filter =>
  contactCollection.findOneAndDelete(filter);
