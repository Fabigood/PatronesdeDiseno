const jwt = require('jsonwebtoken');

function getTokenFromHeader(req) {
  const authorization = req.headers.authorization || req.headers.Authorization;
  if (!authorization) return null;

  const [type, token] = String(authorization).split(' ');
  if (type === 'Bearer' && token) return token;

  return authorization;
}

module.exports = (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
