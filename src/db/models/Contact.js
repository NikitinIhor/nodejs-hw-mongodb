import { Schema, model } from 'mongoose';
import { contactList } from '../../constants/contacts.js';
import { handleSaveError, saveAndUpdateOptions } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactList,
      default: 'personal',
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const sortFields = [
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
];

contactSchema.post('save', handleSaveError);

contactSchema.pre('findOneAndUpdate', saveAndUpdateOptions);
contactSchema.post('findOneAndUpdate', handleSaveError);

export const contactCollection = model('contact', contactSchema);
