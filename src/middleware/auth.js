const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const protect = String(process.env.PROTECT_EMP_ROUTES || '').toLowerCase() === 'true';
  if (!protect) return next(); // protection disabled by default

  const header = req.headers['authorization'] || '';
  const parts = header.split(' ');
  const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : null;

  if (!token) {
    return res.status(401).json({ status: false, message: 'Missing or invalid Authorization header' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'devsecret';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    return next();
  } catch (err) {
    return res.status(401).json({ status: false, message: 'Invalid token' });
  }
}

module.exports = { requireAuth };
