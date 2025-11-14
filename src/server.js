const Hapi = require('@hapi/hapi');
const env = require('./config/env');
const routes = require('./routes');
const swaggerPlugin = require('./plugins/swagger');
const authPlugin = require('./plugins/auth');
const requestLogger = require('./middlewares/requestLogger');
const { prisma } = require('./config/db');

const init = async () => {
  const server = Hapi.server({
    port: env.port,
    host: '0.0.0.0',
    routes: { cors: { origin: ['*'] } }
  });

  // request logger
  server.ext('onRequest', requestLogger);

  // register swagger & auth
  await server.register([
    swaggerPlugin,
    authPlugin
  ]);

  // load routes
  server.route(routes);

  // health check
  server.route({
    method: 'GET',
    path: '/',
    options: { auth: false },
    handler: () => ({ status: 'ok', env: env.nodeEnv })
  });

  // connect DB
  try {
    await prisma.$connect();
    console.log('Connected to DB');
  } catch (err) {
    console.error('Prisma connection error', err);
    process.exit(1);
  }

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

init();
