import * as fs from 'node:fs/promises';
import * as path from 'path';
import { TEMP_UPLOAD_DIR, TEMPLATES_DIR } from '../constants/index.js';

export const saveFileToUploadDir = async file => {
  const oldPath = path.join(TEMP_UPLOAD_DIR, file.fileName);
  const newPath = path.join(TEMPLATES_DIR, file.fileName);

  await fs.rename(oldPath, newPath);

  return file.fileName;
};
