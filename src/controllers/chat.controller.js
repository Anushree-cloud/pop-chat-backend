const chatService = require('../services/chat.service');

exports.createRoom = async (request, h) => {
  const user = request.auth.credentials.user;
  const { name, isGroup, memberIds } = request.payload || {};
  try {
    const room = await chatService.createRoom({ creatorId: user.id, name, isGroup, memberIds });
    return h.response(room).code(201);
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
};

exports.sendMessage = async (request, h) => {
  const user = request.auth.credentials.user;
  const { roomId, content, meta } = request.payload || {};
  try {
    const msg = await chatService.sendMessage({ senderId: user.id, roomId, content, meta });
    return h.response(msg).code(201);
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
};

exports.getMessages = async (request, h) => {
  const { roomId, limit = 50, cursor } = request.query;
  try {
    const messages = await chatService.getMessages({ roomId, limit: parseInt(limit, 10), cursor });
    return h.response(messages).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(400);
  }
};
