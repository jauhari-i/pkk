module.exports = async function cekUser(conn, email, cb) {
  if (!email) {
    cb('Kode user tidak ditemukan');
  } else {
    await conn.query('SELECT * FROM user WHERE email = ?', email, (err, user) => {
      if (err) {
        cb(err);
      } else if (user.length > 0) {
        cb({
          error: 'Email telah dipakai',
        });
      } else {
        cb(null, true);
      }
    });
  }
};
