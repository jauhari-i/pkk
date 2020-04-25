const bcryptjs = require('bcryptjs');

const cekUser = require('./cekUser');

module.exports = async function tambahUser(conn, data, cb) {
  const validation = [];
  if (!data.nm_user) {
    validation.push({
      error: 'Nama diperlukan',
    });
  }
  if (!data.alamat) {
    validation.push({
      error: 'Alamat diperlukan',
    });
  }
  if (!data.tlpn) {
    validation.push({
      error: 'Telepon diperlukan',
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
    await cekUser(conn, data.email, async (used, not) => {
      if (used) {
        cb(used);
      } else if (not) {
        await bcryptjs.hash(data.password, 10, async (err, hashed) => {
          if (err) {
            cb(err);
          } else {
            await conn.query(
              'INSERT INTO user (nm_user,alamat,tlpn,email,password) VALUES (?,?,?,?,?)',
              [data.nm_user, data.alamat, data.tlpn, data.email, hashed],
              (err, inserted) => {
                if (err) {
                  cb(err);
                } else if (inserted) {
                  cb(null, {
                    status: 200,
                    inserted: true,
                    msg: 'User telah ditambahkan',
                    data: inserted,
                  });
                } else {
                  cb('Gagal menambahkan user');
                }
              }
            );
          }
        });
      }
    });
  }
};
