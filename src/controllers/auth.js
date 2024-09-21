import * as authServices from '../services/auth.js';

export const registerController = async (req, res) => {
  const newUser = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'successfully registered user',
    data: newUser,
  });
};

export const loginController = async (req, res) => {
  const userSession = await authServices.login(req.body);

  res.cookie('refreshToken', userSession.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + userSession.refreshTokenValidUntil),
  });

  res.cookie('sessionID', userSession._id, {
    httpOnly: true,
    expires: new Date(Date.now() + userSession.refreshTokenValidUntil),
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
    expires: new Date(Date.now() + userSession.refreshTokenValidUntil),
  });

  res.cookie('sessionID', userSession._id, {
    httpOnly: true,
    expires: new Date(Date.now() + userSession.refreshTokenValidUntil),
  });

  res.json({
    status: 200,
    message: 'Seccessfuljy refreshed',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await authServices.signout(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
