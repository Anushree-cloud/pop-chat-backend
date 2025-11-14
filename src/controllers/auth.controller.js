const authService = require('../services/auth.service');

exports.register = async (request, h) => {
  const { email, password, name } = request.payload;
  try {
    const user = await authService.register({ email, password, name });
    return h.response({ user }).code(201);
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
};

exports.login = async (request, h) => {
  const { email, password } = request.payload;
  try {
    const tokens = await authService.login({ email, password });
    return h.response(tokens).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(401);
  }
};

exports.googleLogin = async (request, h) => {
  const { idToken } = request.payload;
  try {
    const tokens = await authService.loginWithGoogle(idToken);
    return h.response(tokens).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
};

exports.logout = async (request, h) => {
  const user = request.auth.credentials.user;
  const { refreshToken } = request.payload || {};
  try {
    await authService.logout({ userId: user.id, refreshToken });
    return h.response({ success: true }).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
};
