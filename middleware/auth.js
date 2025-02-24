const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Check for the token sent from the frontend (x-auth-token)
  const token = req.header('x-auth-token');
  // No token
  if (!token)
    return res.status(401).json({ msg: 'No token, authorization denied' });
  try {
    // Verify the token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // Add user from payload
    req.user = decoded.user;
    // Call next
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
