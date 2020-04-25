const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (token) {
    jwt.verify(token, 'tendaku', (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Token tidak valid',
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: 'Silahkan login terlebih dahulu',
    });
  }
}

module.exports = checkToken;
