import * as fs from 'node:fs/promises';
import * as path from 'path';
import { TEMP_UPLOAD_DIR, TEMPLATES_DIR } from '../constants/index.js';

export const saveFileToUploadDir = async file => {
  const oldPath = path.join(TEMP_UPLOAD_DIR, file.filename);
  const newPath = path.join(TEMPLATES_DIR, file.filename);

  await fs.rename(oldPath, newPath);

  return file.filename;
};
