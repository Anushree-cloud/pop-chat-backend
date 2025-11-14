const controllers = require('../controllers/ai.controller');
const { TAGS } = require('../constants');

module.exports = [
  {
    method: 'POST',
    path: '/ai/send',
    options: {
      auth: 'jwt',
      handler: controllers.send,
      tags: ['api', TAGS.AI],
      description: 'Send user prompt to AI'
    }
  }
];