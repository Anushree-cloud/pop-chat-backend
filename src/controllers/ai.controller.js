const aiService = require('../services/ai.service');

exports.send = async (request, h) => {
  const user = request.auth.credentials.user;
  const { prompt, model } = request.payload;
  try {
    const result = await aiService.sendMessage({ userId: user.id, prompt, model });
    return h.response(result).code(200);
  } catch (err) {
    return h.response({ error: err.message }).code(500);
  }
};
