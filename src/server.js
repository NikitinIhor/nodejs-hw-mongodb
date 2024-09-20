import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/loger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { authRouter } from './routers/auth.js';
import { contactsRouter } from './routers/contacts.js';
import { env } from './utils/env.js';

const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(logger);
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () =>
    console.log('Server is running on port http://localhost:3000')
  );
};
