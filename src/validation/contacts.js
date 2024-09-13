import Joi from 'joi';
import { contactList } from '../constants/contacts.js';

export const contactAddShema = Joi.object({
  name: Joi.string().min(2).max(20).required().messages({
    'any.required': 'The name must be',
  }),
  phoneNumber: Joi.string().min(2).max(20).required().messages({
    'any.required': 'The phone number must be',
  }),
  email: Joi.string().min(2).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(2)
    .max(20)
    .valid(...contactList)
    .required()
    .messages({
      'any.required': 'The type of contact must be',
    }),
});

export const contactPatchShema = Joi.object({
  name: Joi.string(),
  phoneNumber: Joi.string(),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactList),
});
