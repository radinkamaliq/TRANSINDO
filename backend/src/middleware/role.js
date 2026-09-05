/**
 * Role-based authorization middleware.
 * Pass one or more allowed role names (e.g., 'ADMIN', 'USER') and the
 * middleware ensures that req.user.role.name is among them.
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role || !req.user.role.name) {
      return res.status(403).json({ error: 'Forbidden: no role information' });
    }
    const userRole = req.user.role.name;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
    }
    next();
  };
}

module.exports = authorizeRoles;
