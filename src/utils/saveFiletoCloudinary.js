import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'node:fs/promises';
import { env } from '../utils/env.js';

const cloudName = env('CLOUDINARY_CLOUD_NAME');
const apiKey = env('CLOUDINARY_API_KEY');
const apiSecret = env('CLOUDINARY_API_SECRET');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const saveFileToCloudinary = async (file, folder) => {
  const res = await cloudinary.uploader.upload(file.path, { folder });

  await fs.unlink(file.path);

  return res.secure_url;
};
