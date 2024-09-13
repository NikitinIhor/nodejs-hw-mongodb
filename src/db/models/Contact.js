import { Schema, model } from 'mongoose';
import { contactList } from '../../constants/contacts.js';
import { handleSaveError, saveAndUpdateOptions } from './hooks.js';

const contactShema = new Schema(
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

contactShema.post('save', handleSaveError);

contactShema.pre('findOneAndUpdate', saveAndUpdateOptions);

export const contactCollection = model('contact', contactShema);
