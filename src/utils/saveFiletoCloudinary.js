import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'node:fs/promises';
import { env } from '../utils/env.js';

const cloudName = env('CLAUDINARY_CLOUD_NAME');
const cloudApiKey = env('CLAUDINARY_API_KEY');
const cloudApiSecret = env('CLAUDINARY_API_SECRET');

cloudinary.config({
  cloudName,
  cloudApiKey,
  cloudApiSecret,
});

export const saveFileToCloudinary = async (file, folder) => {
  const res = await cloudinary.uploader.upload(file.path, { folder });

  await fs.unlink(file.path);

  return res.secure_url;
};
