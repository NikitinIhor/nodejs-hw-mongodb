import { Schema, model } from 'mongoose';
import { emailRegexp } from '../../constants/users.js';
import { handleSaveError, saveAndUpdateOptions } from './hooks.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', saveAndUpdateOptions);
userSchema.post('findOneAndUpdate', handleSaveError);

export const userCollection = model('user', userSchema);
