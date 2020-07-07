const cekTenda = require('./cekTenda');

module.exports = async function hapusTenda(conn, id, cb) {
  if (!id) {
    cb('Kode tenda tidak ditemukan');
  } else {
    await cekTenda(conn, id, (err, result) => {
      if (err) {
        cb(err);
      } else {
        conn.query('DELETE FROM tenda WHERE kd_tenda = ?', id, (err, deleted) => {
          if (err) {
            cb(err);
          } else if (deleted) {
            conn.query('DELETE FROM pinjam WHERE kd_tenda = ?', id, (err, deleteds) => {
              if (err) {
                cb(err);
              } else {
                cb(null, {
                  status: 200,
                  deleted: true,
                  msg: 'Tenda berhasil dihapus',
                  data: deleted,
                });
              }
            });
          } else {
            cb({
              status: 400,
              deleted: false,
              msg: 'Gagal menghapus tenda',
            });
          }
        });
      }
    });
  }
};
