import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { userSigninSchema, userSignupSchema } from '../validation/users.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(userSignupSchema),
  ctrlWrapper(authControllers.registerController)
);

authRouter.post(
  '/login',
  validateBody(userSigninSchema),
  ctrlWrapper(authControllers.loginController)
);

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));
