const jwt = require('jsonwebtoken');

/**
 * Sign a JWT token with user information.
 * @param {Object} payload - Payload containing at least userId and roleName.
 */
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

/** Verify a token and return the decoded payload. */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
