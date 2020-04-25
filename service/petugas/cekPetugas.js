module.exports = async function cekPetugas(conn, email, cb) {
  if (!email) {
    cb('Kode Petugas tidak ditemukan');
  } else {
    await conn.query('SELECT * FROM petugas WHERE email = ?', email, (err, petugas) => {
      if (err) {
        cb(err);
      } else if (petugas.length > 0) {
        cb({
          error: 'Email telah digunakan',
        });
      } else {
        cb(null, true);
      }
    });
  }
};
