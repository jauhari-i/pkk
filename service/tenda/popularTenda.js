module.exports = async (conn, cb) => {
  await conn.query(
    'SELECT pinjam.kd_tenda,tenda.nm_tenda, tenda.gambar, COUNT(1) as dipinjam FROM pinjam INNER JOIN tenda ON pinjam.kd_tenda=tenda.kd_tenda GROUP BY kd_tenda ORDER BY COUNT(1) DESC',
    (err, data) => {
      if (err) {
        cb(err);
      } else {
        if (data.length === 0) {
          cb(null, { status: 200, data: [] });
        } else {
          cb(null, { status: 200, data });
        }
      }
    }
  );
};
