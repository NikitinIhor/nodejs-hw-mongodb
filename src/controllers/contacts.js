import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';

import { parseContactsFilterParams } from '../utils/filters/parseContactsFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

import { sortFields } from '../db/models/Contact.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFiletoCloudinary.js';

const enableCloudinary = env('ENABLE_CLOUDINARY');

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });
  const filter = parseContactsFilterParams(req.query);

  const { _id: userID } = req.user;

  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter: { ...filter, userID },
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userID } = req.user;
  const data = await contactServices.getContact({ _id: contactId, userID });

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} nor found`);
  }

  res.json({
    status: 200,
    message: `Contact with ${contactId} successfully found`,
    data,
  });
};

export const postContactController = async (req, res) => {
  let photo;

  if (req.file) {
    if (enableCloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'Photos');
    } else {
      photo = await saveFileToUploadDir(req.file);
    }
  }

  const { _id: userID } = req.user;

  const data = await contactServices.createContact({
    ...req.body,
    userID,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: 'contact added successfully',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  let photo;

  if (req.file) {
    if (enableCloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'Photos');
    } else {
      photo = await saveFileToUploadDir(req.file);
    }
  }

  const { contactId } = req.params;
  const { _id: userID } = req.user;
  const { isNew, data } = await contactServices.updateContact(
    { _id: contactId, userID },
    { ...req.body, photo },
    { upsert: true }
  );

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'contact upsert successfully',
    data,
  });
};

export const patchContactController = async (req, res) => {
  let photo;

  if (req.file) {
    if (enableCloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'Photos');
    } else {
      photo = await saveFileToUploadDir(req.file);
    }
  }

  const { contactId } = req.params;
  const { _id: userID } = req.user;

  const result = await contactServices.updateContact(
    { _id: contactId, userID },
    { ...req.body, photo },
    { upsert: true }
  );

  if (!result) {
    throw createHttpError(404, `Contact with id=${contactId} nor found`);
  }

  res.json({
    status: 200,
    message: 'contact patched successfully',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userID } = req.user;

  const data = await contactServices.deleteContact({ _id: contactId, userID });

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} nor found`);
  }

  res.status(204).send();
};
