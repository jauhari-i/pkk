module.exports = hapusPinjam = async (conn, id, cb) => {
  await conn.query('DELETE FROM pinjam WHERE kd_pinjam = ?', id, (err, deleted) => {
    if (err) {
      cb(err);
    } else {
      cb(null, { status: 200, msg: 'Peminjaman telah dihapus', data: deleted });
    }
  });
};
