const controllers = require('../controllers/auth.controller');
const { TAGS } = require('../constants');

module.exports = [
  {
    method: 'POST',
    path: '/auth/register',
    options: {
      auth: false,
      handler: controllers.register,
      tags: ['api', TAGS.AUTH],
      description: 'Register user'
    }
  },
  {
    method: 'POST',
    path: '/auth/login',
    options: {
      auth: false,
      handler: controllers.login,
      tags: ['api', TAGS.AUTH],
      description: 'Login user (email/password)'
    }
  },
  {
    method: 'POST',
    path: '/auth/google',
    options: {
      auth: false,
      handler: controllers.googleLogin,
      tags: ['api', TAGS.AUTH],
      description: 'Login with Google'
    }
  },
  {
    method: 'POST',
    path: '/auth/logout',
    options: {
      auth: 'jwt',
      handler: controllers.logout,
      tags: ['api', TAGS.AUTH],
      description: 'Logout - revoke refresh token'
    }
  }
];
