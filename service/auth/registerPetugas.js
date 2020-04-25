const bcryptjs = require('bcryptjs');

const cekPetugas = require('../petugas/cekPetugas');

module.exports = registerPetugas = async (conn, data, cb) => {
  const validation = [];
  if (!data.nm_petugas) {
    validation.push({
      error: 'Nama diperlukan',
    });
  }
  if (!data.email) {
    validation.push({
      error: 'Email diperlukan',
    });
  }
  if (!data.password) {
    validation.push({
      error: 'Password diperlukan',
    });
  }
  if (validation.length > 0) {
    cb(validation);
  } else {
    await cekPetugas(conn, data.email, async (used, not) => {
      if (used) {
        cb(used);
      } else if (not) {
        await bcryptjs.hash(data.password, 10, async (err, hashed) => {
          if (err) {
            cb(err);
          } else {
            await conn.query(
              'INSERT INTO petugas (nm_petugas, email, password) VALUE (?,?,?)',
              [data.nm_petugas, data.email, hashed],
              (err, inserted) => {
                if (err) {
                  cb(err);
                } else if (inserted) {
                  cb(null, {
                    status: 200,
                    register: true,
                    msg: 'Register berhasil',
                    data: inserted,
                  });
                } else {
                  cb('Gagal menambahkan petugas');
                }
              }
            );
          }
        });
      }
    });
  }
};
