import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';
import { SessionCollection } from '../db/models/Session.js';
import { userCollection } from '../db/models/User.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifeTime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifeTime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const register = async payload => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'emial allready exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await userCollection.create({
    ...payload,
    password: hashPassword,
  });

  delete data._doc.password;

  return data._doc;
};

export const login = async payload => {
  const { email, password } = payload;
  const user = await userCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'email is invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'password is invalid');
  }

  await SessionCollection.deleteOne({ userID: user._id });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userID: user._id,
    ...sessionData,
  });

  return userSession;
};

export const findSessionByAccessToken = accessToken =>
  SessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionID }) => {
  const session = await SessionCollection.findOne({
    _id: sessionID,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionID });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userID: session._id,
    ...sessionData,
  });

  return userSession;
};

export const logout = async sessionID => {
  await SessionCollection.deleteOne({ _id: sessionID });
};

export const findUser = filter => userCollection.findOne(filter);
