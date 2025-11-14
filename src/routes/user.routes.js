const controllers = require('../controllers/user.controller');
const { TAGS } = require('../constants');

module.exports = [
  {
    method: 'GET',
    path: '/user/me',
    options: {
      auth: 'jwt',
      handler: controllers.me,
      tags: ['api', TAGS.USER],
      description: 'Get current user'
    }
  }
];
