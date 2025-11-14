const axios = require('axios');
const env = require('./env');

const instance = axios.create({
  timeout: 15000,
  headers: {
    'User-Agent': 'chat-backend/1.0'
  }
});

// attach API keys if needed in interceptors
instance.interceptors.request.use((cfg) => {
  // example: add AI provider key if interacting with provider URLs
  return cfg;
});

module.exports = instance;
