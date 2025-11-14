const bcrypt = require('bcryptjs');

exports.hash = async (payload) => {
  return bcrypt.hash(payload, 10);
};

exports.compare = async (payload, hash) => {
  return bcrypt.compare(payload, hash);
};
