const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  try {
    //TODO => aane wali req k headers se token extract karo
    const auth = req.headers.authorization;
    console.log(auth);
    if (!auth) {
      return res.status(401).json({
        message: 'no token found',
      });
    }
    const token = auth.split(' ')[1];
    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_STRING);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

module.exports = verifyToken;
