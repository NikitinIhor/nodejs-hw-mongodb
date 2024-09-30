import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import { sendEmail } from '../utils/sendEmail.js';

import handlebars from 'handlebars';
import fs from 'node:fs/promises';
import * as path from 'node:path';

import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';

import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

import { SessionCollection } from '../db/models/Session.js';
import { userCollection } from '../db/models/User.js';

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

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

export const requestResetToken = async email => {
  const user = await userCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  if (!email) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.'
    );
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    }
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html'
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async payload => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
  }

  const user = await userCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await userCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword }
  );
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
