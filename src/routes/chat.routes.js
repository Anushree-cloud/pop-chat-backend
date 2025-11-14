const controllers = require('../controllers/chat.controller');
const { TAGS } = require('../constants');

module.exports = [
  {
    method: 'POST',
    path: '/chat/create-room',
    options: {
      auth: 'jwt',
      handler: controllers.createRoom,
      tags: ['api', TAGS.CHAT],
      description: 'Create chat room'
    }
  },
  {
    method: 'POST',
    path: '/chat/send-message',
    options: {
      auth: 'jwt',
      handler: controllers.sendMessage,
      tags: ['api', TAGS.CHAT],
      description: 'Send message to room'
    }
  },
  {
    method: 'GET',
    path: '/chat/get-messages',
    options: {
      auth: 'jwt',
      handler: controllers.getMessages,
      tags: ['api', TAGS.CHAT],
      description: 'Get messages for room (roomId query)'
    }
  }
];
