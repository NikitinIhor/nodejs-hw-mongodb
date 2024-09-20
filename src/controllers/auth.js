import * as authServices from '../services/auth.js';

export const signupController = async (req, res) => {
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    status: 201,
    message: 'successfully registered user',
    data: newUser,
  });
};

export const signinController = async (req, res) => {
  const userSession = await authServices.signin(req.body);

  res.cookie('refreshToken', userSession.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + userSession.refreshTokenValidUntil),
  });

  res.cookie('sessionID', userSession._id, {
    httpOnly: true,
    expire: new Date(Date.now() + userSession.refreshTokenValidUntil),
  });

  res.json({
    status: 200,
    message: 'Seccessfuljy signin',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const userSession = await authServices.refreshSession({
    refreshToken,
    sessionId,
  });

  res.cookie('refreshToken', userSession.refreshToken, {
    httpOnly: true,
    expire: new Date(Date.now() + userSession.refreshTokenValidUntil),
  });

  res.cookie('sessionID', userSession._id, {
    httpOnly: true,
    expire: new Date(Date.now() + userSession.refreshTokenValidUntil),
  });

  res.json({
    status: 200,
    message: 'Seccessfuljy refreshed',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};

export const signoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await authServices.signout(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
