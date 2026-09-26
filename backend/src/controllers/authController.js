// backend/src/controllers/authController.js

const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const { signToken, verifyToken } = require('../utils/jwt');

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

async function register(req, res) {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and fullName are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    let userRole = await prisma.role.findFirst({
      where: { name: { in: ['user', 'USER', 'User'] } },
    });
    if (!userRole) {
      userRole = await prisma.role.findFirst();
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash,
        roleId: userRole ? userRole.id : 1n,
      },
      include: { role: true },
    });

    const token = signToken({
      userId: user.id.toString(),
      email: user.email,
      roleName: user.role ? user.role.name : 'user',
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    return res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role ? user.role.name : 'user',
      },
    });
  } catch (err) {
    console.error('[authController] register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({
      userId: user.id.toString(),
      email: user.email,
      roleName: user.role ? user.role.name : 'user',
    });

    res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role ? user.role.name : 'user',
      },
    });
  } catch (err) {
    console.error('[authController] login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function logout(req, res) {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
  return res.status(200).json({ message: 'Logged out successfully' });
}

async function getCurrentUser(req, res) {
  try {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }
    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: BigInt(decoded.userId) },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: { select: { name: true } },
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    return res.status(200).json({
      id: user.id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role ? user.role.name : 'user',
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }
}

async function demoLogin(req, res) {
  const token = signToken({
    userId: '1',
    email: 'demo@transit.id',
    roleName: 'user',
  });
  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  return res.status(200).json({
    message: 'Demo login successful',
    user: { id: '1', email: 'demo@transit.id', fullName: 'Komuter TRANSIT', role: 'user' },
  });
}

module.exports = { register, login, logout, getCurrentUser, demoLogin };

