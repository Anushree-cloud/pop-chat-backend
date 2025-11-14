const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../../package.json');

module.exports = {
  plugin: {
    name: 'swagger',
    register: async (server) => {
      await server.register([Inert, Vision, {
        plugin: HapiSwagger,
        options: {
          info: {
            title: 'Chat Backend API',
            version: Pack.version
          },
          documentationPath: '/docs'
        }
      }]);
    }
  }
};
