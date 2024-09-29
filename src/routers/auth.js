import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  requestResetEmailSchema,
  resetPasswordSchema,
  userSigninSchema,
  userSignupSchema,
} from '../validation/users.js';

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

authRouter.get(
  '/reset-password',
  ctrlWrapper(authControllers.verifyController)
);

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authControllers.requestResetEmailController)
);

authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authControllers.resetPasswordController)
);

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));

authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));
