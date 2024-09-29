import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';

import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';

import handlebars from 'handlebars';

import { sendEmail } from '../utils/sendEmail.js';

import { createJwtToken, verifyJwtToken } from '../utils/jwt.js';

import { TEMPLATES_DIR } from '../constants/index.js';

import { SessionCollection } from '../db/models/Session.js';
import { userCollection } from '../db/models/User.js';

const veifyEmailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');
const veifyEmailTemplateSource = await fs.readFile(
  veifyEmailTemplatePath,
  'utf-8'
);

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

  const APP_DOMAIN = env('APP_DOMAIN');
  const jwtToken = createJwtToken({ email });
  const template = handlebars.compile(veifyEmailTemplateSource);

  const html = template({
    APP_DOMAIN,
    jwtToken,
  });

  const veifyEmail = {
    to: email,
    subject: 'Verify your email',
    html,
  };

  await sendEmail(veifyEmail);

  return data._doc;
};

export const verify = async token => {
  const { data, error } = verifyJwtToken(token);

  if (error) {
    throw createHttpError(401, 'token is invalid');
  }
  const user = await userCollection.findOne({ email: data.email });

  if (user.verify) {
    throw createHttpError(401, 'email is allredy verified');
  }
  await userCollection.findOneAndUpdate({ _id: user._id }, { verify: true });
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

  const resetPasswordLink = `${env(
    'APP_DOMAIN'
  )}/auth/reset-password?token=${resetToken}`;

  await sendEmail({
    from: env('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password!</p>`,
  });
};

export const resetPassword = async payload => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
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

  if (!user.verify) {
    throw createHttpError(401, 'email is not verified');
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
