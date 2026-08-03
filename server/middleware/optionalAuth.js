const jwt = require('jsonwebtoken');

// Same as verifyToken, but never blocks the request - it just attaches
// req.user when a valid token is present so a route can support both
// logged-in users and anonymous/guest flows.
const optionalAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth) {
      const token = auth.split(' ')[1];
      req.user = jwt.verify(token, process.env.JWT_SECRET_STRING);
    }
  } catch (error) {
    req.user = undefined;
  }
  next();
};

module.exports = optionalAuth;
