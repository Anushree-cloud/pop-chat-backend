require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  baseUrl: process.env.BASE_URL || 'http://localhost:4000',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiry: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d'
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  ai: {
    provider: process.env.AI_PROVIDER || 'openai',
    openaiKey: process.env.OPENAI_API_KEY,
    metaKey: process.env.META_API_KEY
  }
};

module.exports = env;
