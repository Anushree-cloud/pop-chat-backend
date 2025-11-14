const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');
const env = require('./env');

const prisma = new PrismaClient({
  log: env.nodeEnv === 'development' ? ['query', 'info', 'warn'] : []
});

async function rawSql(query, params = []) {
  // example: use mysql2 to execute raw queries
  const conn = await mysql.createConnection(env.databaseUrl.replace('mysql://', 'mysql://'));
  try {
    const [rows] = await conn.execute(query, params);
    return rows;
  } finally {
    await conn.end();
  }
}

module.exports = { prisma, rawSql };
