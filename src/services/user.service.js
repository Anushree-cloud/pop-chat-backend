const { prisma } = require('../config/db');

exports.getById = async (id) => {
  return prisma.user.findUnique({ where: { id }, select: { id: true, email: true, name: true, role: true, createdAt: true }});
};
