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
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload contains userId and roleId
    prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: { id: true, email: true, fullName: true, roleId: true, role: { select: { name: true } } },
    }).then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.user = user;
      next();
    }).catch(err => {
      console.error('Prisma error in authMiddleware:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
