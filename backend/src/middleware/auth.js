const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

/**
 * Authentication middleware that verifies the JWT stored in the HTTP‑only cookie.
 * If verification succeeds, the user record (without passwordHash) is attached to
 * `req.user`. Otherwise a 401 response is sent.
 */
function authMiddleware(req, res, next) {
  const token = req.cookies[process.env.COOKIE_NAME || 'auth_token'];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'transit_default_secret_key_2026';
    const payload = jwt.verify(token, secret);
    // payload contains userId and roleId
    prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: { id: true, email: true, fullName: true, roleId: true, role: { select: { name: true } } },
    }).then(user => {
      if (!user) {
        req.user = {
          id: payload.userId,
          email: payload.email,
          fullName: payload.email || 'Pengguna TRANSIT',
          role: { name: payload.roleName || 'user' },
        };
        return next();
      }
      req.user = user;
      next();
    }).catch(err => {
      // If DB connection fails, fallback to cryptographically verified JWT payload
      req.user = {
        id: payload.userId,
        email: payload.email,
        fullName: payload.email || 'Pengguna TRANSIT',
        role: { name: payload.roleName || 'user' },
      };
      next();
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
