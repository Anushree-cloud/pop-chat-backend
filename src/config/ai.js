const env = require('./env');
const axios = require('./axios');

const defaultModel = {
  provider: env.ai.provider,
  modelName: env.ai.provider === 'openai' ? 'gpt-4o-mini' : 'meta-llm',
  maxTokens: 1024
};

module.exports = {
  defaultModel
};
