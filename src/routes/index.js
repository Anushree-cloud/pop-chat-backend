const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const chatRoutes = require('./chat.routes');
const aiRoutes = require('./ai.routes');

module.exports = [
  ...authRoutes,
  ...userRoutes,
  ...chatRoutes,
  ...aiRoutes
];
