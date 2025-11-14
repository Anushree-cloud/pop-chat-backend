const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const env = require('../config/env');
const { v4: uuidv4 } = require('uuid');
const crypto = require('../utils/crypto');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(env.googleClientId);

function signAccessToken(user) {
  return jwt.sign({ sub: user.id }, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiry });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, tid: uuidv4() }, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiry });
}

exports.register = async ({ email, password, name }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Email already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name, passwordHash }
  });
  return { id: user.id, email: user.email, name: user.name };
};

exports.login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) throw new Error('Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshHash = await crypto.hash(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshHash,
      expiresAt
    }
  });

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } };
};

exports.loginWithGoogle = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: env.googleClientId
  });
  const payload = ticket.getPayload();
  const email = payload.email;

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: payload.name,
        providers: {
          create: { provider: 'google', providerId: payload.sub }
        }
      }
    });
  } else {
    // ensure provider exists
    const provider = await prisma.authProvider.findFirst({
      where: { userId: user.id, provider: 'google', providerId: payload.sub }
    });
    if (!provider) {
      await prisma.authProvider.create({
        data: { provider: 'google', providerId: payload.sub, userId: user.id }
      });
    }
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const refreshHash = await crypto.hash(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash: refreshHash,
      expiresAt
    }
  });

  return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
};

exports.logout = async ({ userId, refreshToken }) => {
  if (!refreshToken) {
    // revoke all sessions for user
    await prisma.session.updateMany({ where: { userId }, data: { revoked: true } });
    return;
  }
  const hashed = await crypto.hash(refreshToken);
  await prisma.session.updateMany({ where: { userId, refreshTokenHash: hashed }, data: { revoked: true } });
};
