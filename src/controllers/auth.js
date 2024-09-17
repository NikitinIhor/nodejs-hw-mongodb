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
