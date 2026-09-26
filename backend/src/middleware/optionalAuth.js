// backend/src/middleware/optionalAuth.js
const jwt = require('jsonwebtoken');

/**
 * Optional authentication middleware.
 * If an auth token cookie is present and valid, attaches `req.user`.
 * Does NOT reject unauthenticated requests, allowing guests full access.
 */
function optionalAuth(req, res, next) {
  const token = req.cookies?.[process.env.COOKIE_NAME || 'auth_token'];
  if (!token) return next();

  try {
    const secret = process.env.JWT_SECRET || 'transit_default_secret_key_2026';
    const payload = jwt.verify(token, secret);
    req.user = {
      id: payload.userId,
      email: payload.email,
      role: { name: payload.roleName || 'user' },
    };
  } catch (err) {
    // Ignore invalid/expired tokens for guest fallback
  }
  next();
}

module.exports = optionalAuth;
