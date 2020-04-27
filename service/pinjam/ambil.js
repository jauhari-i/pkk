const moment = require('moment');

moment.locale('id');

module.exports = ambil = async (conn, data, cb) => {
  // data = { kd_pinjam, kd_petugas }
  await conn.query('SELECT * FROM pinjam WHERE kd_pinjam = ?', data.kd_pinjam, (err, pinjam) => {
    if (err) {
      cb(err);
    } else if (pinjam.length > 0) {
      let pinjamku = pinjam[0];
      let dateTransLimit = moment(pinjamku.tgl).add(1, 'd').format('YYYY-MM-DD HH:MM:SS');

      if (moment().format('YYYY-MM-DD HH:MM:SS') < dateTransLimit && pinjamku.status === 4) {
        conn.query(
          'UPDATE pinjam SET kd_petugas = ?, status = ? WHERE kd_pinjam = ?',
          [data.kd_petugas, 1, data.kd_pinjam],
          (err, diterima) => {
            if (err) {
              cb(err);
            } else {
              cb(null, {
                status: 200,
                msg: pinjamku.kode + ' Diterima',
              });
            }
          }
        );
      } else {
        cb({
          status: 400,
          msg: 'Tidak valid',
        });
      }
    } else {
      cb({
        status: 404,
        msg: 'Data tidak ditemukan',
      });
    }
  });
};
