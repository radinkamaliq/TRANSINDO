const jwt = require('jsonwebtoken');

/**
 * Sign a JWT token with user information.
 * @param {Object} payload - Payload containing at least userId and roleName.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'transit_default_secret_key_2026';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/** Verify a token and return the decoded payload. */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
