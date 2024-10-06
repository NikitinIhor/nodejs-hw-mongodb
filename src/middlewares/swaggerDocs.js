import createHttpError from 'http-errors';
import { readFileSync } from 'node:fs';
import swaggerUI from 'swagger-ui-express';

import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = readFileSync(SWAGGER_PATH, 'utf-8');
    return [...swaggerUI.serve, swaggerUI.setup(JSON.parse(swaggerDoc))];
  } catch (err) {
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
