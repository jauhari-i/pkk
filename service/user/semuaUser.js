module.exports = async function semuaUser(conn, cb) {
  await conn.query('SELECT * FROM user', (err, data) => {
    if (err) {
      cb(err);
    } else if (data.length > 0) {
      const datas = data.map((doc) => ({
        kode_user: doc.kd_user,
        nama_user: doc.nm_user,
        alamat: doc.alamat,
        telepon: doc.tlpn,
        email: doc.email,
      }));
      cb(null, {
        status: 200,
        data: datas,
      });
    } else {
      cb({
        status: 200,
        data: null,
        msg: 'Data user kosong',
      });
    }
  });
};
