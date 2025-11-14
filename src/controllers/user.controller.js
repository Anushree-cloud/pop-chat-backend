exports.me = async (request, h) => {
    const user = request.auth.credentials.user;
    // filter sensitive fields
    const { passwordHash, ...safe } = user;
    return h.response({ user: safe });
  };
  