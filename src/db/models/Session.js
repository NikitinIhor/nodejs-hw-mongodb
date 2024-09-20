import { Schema, model } from 'mongoose';

import { handleSaveError, saveAndUpdateOptions } from './hooks.js';

const sessionShema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

sessionShema.post('save', handleSaveError);
sessionShema.pre('findOneAndUpdate', saveAndUpdateOptions);
sessionShema.post('findOneAndUpdate', handleSaveError);

export const SessionCollection = model('session', sessionShema);
