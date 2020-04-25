const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

module.exports = loginPetugas = async (conn, data, cb) => {
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
    await conn.query('SELECT * FROM petugas WHERE email = ?', data.email, (err, petugas) => {
      if (err) {
        cb(err);
      } else if (petugas.length > 0) {
        let petugasku = petugas[0];
        bcryptjs.compare(data.password, petugasku.password, (err, isMatch) => {
          if (err) {
            cb(err);
          } else if (isMatch) {
            let token = jwt.sign(
              {
                id: petugasku.kd_petugas,
                nama: petugasku.nm_petugas,
                email: petugasku.email,
                role: 1,
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
          msg: 'Petugas tidak ditemukan',
        });
      }
    });
  }
};
