const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

module.exports = loginUser = async (conn, data, cb) => {
  let validasi = [];
  if (!data.email) {
    validasi.push({
      error: 'Email diperlukan',
    });
  }
  if (!data.password) {
    validasi.push({
      error: 'Password diperlukan',
    });
  }
  if (validasi.length > 0) {
    cb(validasi);
  } else {
    await conn.query('SELECT * FROM user WHERE email = ?', data.email, (err, user) => {
      if (err) {
        cb(err);
      } else if (user.length > 0) {
        let userku = user[0];
        bcryptjs.compare(data.password, userku.password, (err, isMatch) => {
          if (err) {
            cb(err);
          } else if (isMatch) {
            let token = jwt.sign(
              {
                nama: userku.nm_user,
                email: userku.email,
                role: 0,
              },
              'tendaku',
              { expiresIn: '24h' }
            );
            cb(null, {
              status: 200,
              msg: 'Login berhasil',
              token: token,
            });
          } else {
            cb({
              status: 400,
              msg: 'Password salah',
            });
          }
        });
      } else {
        cb({
          status: 404,
          msg: 'User tidak ditemukan',
        });
      }
    });
  }
};
