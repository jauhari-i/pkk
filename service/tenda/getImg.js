module.exports = getImg = async (conn, id, cb) => {
  await conn.query('SELECT * FROM tenda WHERE kd_tenda = ?', id, (err, img) => {
    if (err) {
      cb(err);
    } else if (img.length > 0) {
      cb(null, img[0].gambar);
    } else {
      cb({
        status: 404,
        msg: 'Gambar tidak ditemukan',
      });
    }
  });
};
