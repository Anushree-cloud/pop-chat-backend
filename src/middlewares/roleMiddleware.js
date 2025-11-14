module.exports = function requireRole(role) {
    return (request, h) => {
      const user = request.auth && request.auth.credentials && request.auth.credentials.user;
      if (!user || user.role !== role) {
        return h.response({ error: 'Forbidden' }).code(403).takeover();
      }
      return h.continue;
    };
  };
  