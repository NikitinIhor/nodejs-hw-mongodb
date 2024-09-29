import * as authServices from '../services/auth.js';

export const registerController = async (req, res) => {
  const newUser = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'successfully registered user',
    data: newUser,
  });
};

export const verifyController = async (req, res) => {
  const { token } = req.query;
  await authServices.verify(token);

  res.json({
    status: 200,
    message: 'Reset password email was successfully sent!',
    data: {},
  });
};

export const requestResetEmailController = async (req, res) => {
  await authServices.requestResetToken(req.body.email);

  res.json({
    message: 'Reset password email has been successfully sent.',
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await authServices.resetPassword(req.body);
  res.json({
    message: 'Password has been successfully reset.',
    status: 200,
    data: {},
  });
};

export const loginController = async (req, res) => {
  const userSession = await authServices.login(req.body);

  const refreshTokenExpires = new Date(userSession.refreshTokenValidUntil);

  if (isNaN(refreshTokenExpires.getTime())) {
    return res.status(500).json({
      status: 500,
      message: 'Invalid refresh token expiration date',
    });
  }

  res.cookie('refreshToken', userSession.refreshToken, {
    httpOnly: true,
    expires: refreshTokenExpires,
  });

  res.cookie('sessionID', userSession._id, {
    httpOnly: true,
    expires: refreshTokenExpires,
  });

  res.json({
    status: 200,
    message: 'Seccessfuljy signed in',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken, sessionID } = req.cookies;

  const userSession = await authServices.refreshSession({
    refreshToken,
    sessionID,
  });

  const refreshTokenExpiry = new Date(userSession.refreshTokenValidUntil);

  res.cookie('refreshToken', userSession.refreshToken, {
    httpOnly: true,
    expires: refreshTokenExpiry,
  });

  res.cookie('sessionID', userSession._id, {
    httpOnly: true,
    expires: refreshTokenExpiry,
  });

  res.json({
    status: 200,
    message: 'Seccessfully refreshed',
    data: {
      accessToken: userSession.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionID } = req.cookies;

  if (sessionID) {
    await authServices.logout(sessionID);
  }

  res.clearCookie('sessionID');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
