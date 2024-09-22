import createHttpError from 'http-errors';
import { findSessionByAccessToken, findUser } from '../services/auth.js';

export const authenticate = async (req, res, next) => {
  const authorization = req.get('Authorization');

  if (!authorization) {
    return next(createHttpError(401, 'Autorization header not found'));
  }

  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Autorization header nmust have Bearer'));
  }

  const session = await findSessionByAccessToken(token);
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await findUser({ _id: session.userID });
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;

  next();
};
