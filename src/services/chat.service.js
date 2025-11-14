const { prisma } = require('../config/db');

exports.createRoom = async ({ creatorId, name, isGroup = false, memberIds = [] }) => {
  const room = await prisma.chatRoom.create({
    data: {
      name,
      isGroup,
      createdBy: creatorId,
      userRooms: {
        create: [{ userId: creatorId }, ...memberIds.map(id => ({ userId: id }))]
      }
    },
    include: { userRooms: true }
  });
  return room;
};

exports.sendMessage = async ({ senderId, roomId, content, meta }) => {
  return prisma.message.create({
    data: {
      senderId,
      roomId,
      content,
      meta
    }
  });
};

exports.getMessages = async ({ roomId, limit = 50, cursor }) => {
  const where = { roomId };
  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined
  });
  return messages.reverse();
};
