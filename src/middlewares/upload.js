import createHttpError from 'http-errors';
import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,

  filename: (req, file, callback) => {
    const uniquePreffix = `${Date.now()} ${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniquePreffix}_${file.originalname}`;
    callback(null, fileName);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split('.').pop();

  if (extension === 'exe') {
    return callback(createHttpError(400, 'exe is not valid extension'));
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  limits,
  fileFilter,
});
