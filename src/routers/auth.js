import { Router } from 'express';
import * as authControllers from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  loginWithGoogleOAuthSchema,
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

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(authControllers.requestResetEmailController)
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(authControllers.resetPasswordController)
);

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshController));

authRouter.post('/logout', ctrlWrapper(authControllers.logoutController));

authRouter.get(
  '/get-oauth-url',
  ctrlWrapper(authControllers.getGoogleOAuthUrlController)
);

authRouter.post(
  '/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  ctrlWrapper(authControllers.loginWithGoogleController)
);
