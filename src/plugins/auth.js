const jwt = require('hapi-auth-jwt2');
const Joi = require('joi');
const env = require('../config/env');
const { prisma } = require('../config/db');

async function validate(decoded, request, h) {
  // `decoded` is the token payload
  if (!decoded || !decoded.sub) return { isValid: false };

  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
  if (!user) return { isValid: false };

  return { isValid: true, credentials: { user } };
}

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server) => {
      await server.register(jwt);

      server.auth.strategy('jwt', 'jwt', {
        key: env.jwt.accessSecret,
        validate,
        verifyOptions: { algorithms: ['HS256'] }
      });

      server.auth.default('jwt');
    }
  }
};
