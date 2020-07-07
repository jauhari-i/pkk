const moment = require('moment');

module.exports = kembali = async (conn, kode_pinjam, cb) => {
  await conn.query(
    'SELECT * FROM pinjam INNER JOIN tenda ON pinjam.kd_tenda = tenda.kd_tenda WHERE kd_pinjam = ?',
    kode_pinjam,
    (err, pinjam) => {
      if (err) {
        cb(err);
      } else if (pinjam.length > 0) {
        let pinjamData = pinjam[0];
        let dateNow = moment().format('YYYY-MM-DD HH:MM:SS');
        let datePengembalian = moment(pinjamData.tgl)
          .add(pinjamData.durasi, 'd')
          .format('YYYY-MM-DD HH:MM:SS');
        let stok = pinjamData.stok;
        let jumlahPinjam = pinjamData.jumlah_pinjam;
        let jumlahTotal = Number(stok) + Number(jumlahPinjam);
        conn.query(
          'UPDATE tenda SET stok = ? WHERE kd_tenda = ?',
          [jumlahTotal, pinjamData.kd_tenda],
          (err, updated) => {
            if (err) {
              cb(err);
            }
            if (pinjamData.status === 1 && dateNow > datePengembalian) {
              conn.query(
                'UPDATE pinjam SET status = ? WHERE kd_pinjam = ?',
                [2, kode_pinjam],
                (err, upd) => {
                  if (err) {
                    cb(err);
                  } else {
                    cb(null, {
                      status: 200,
                      msg: 'Barang dikembalikan terlambat',
                    });
                  }
                }
              );
            } else {
              conn.query(
                'UPDATE pinjam SET status = ? WHERE kd_pinjam = ?',
                [0, kode_pinjam],
                (err, upd) => {
                  if (err) {
                    cb(err);
                  } else {
                    cb(null, {
                      status: 200,
                      msg: 'Barang dikembalikan',
                    });
                  }
                }
              );
            }
          }
        );
      } else {
        cb({
          status: 404,
          msg: 'Data tidak ditemukan',
        });
      }
    }
  );
};
