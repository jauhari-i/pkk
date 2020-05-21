const cekStok = async (conn, kd_tenda, jmlh_pinjam, cb) => {
  await conn.query('SELECT * FROM tenda WHERE kd_tenda = ?', kd_tenda, (err, tenda) => {
    if (err) {
      cb(err);
    } else if (tenda.length > 0) {
      let tendaku = tenda[0];
      if (tendaku.stok < jmlh_pinjam) {
        cb(null, {
          error: 'Jumlah tenda tidak memadai',
        });
      } else {
        cb(null, null, {
          tarif: tendaku.tarif,
          durasi: tendaku.durasi,
          stok: tendaku.stok,
        });
      }
    } else {
      cb({
        error: 'Tenda tidak ditemukan',
      });
    }
  });
};

const kode = (len) => {
  let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var kodePinjam = '';
  for (var i = 0; i < len; i++) {
    var kodePoz = Math.floor(Math.random() * charSet.length);
    kodePinjam += charSet.substring(kodePoz, kodePoz + 1);
  }
  return kodePinjam;
};

module.exports = tambahPinjam = async (conn, data, cb) => {
  await cekStok(conn, data.tenda, data.jumlah, async (err, kurang, tenda) => {
    if (err) {
      cb(err);
    } else if (kurang) {
      cb({
        status: 400,
        msg: kurang.error,
      });
    } else if (tenda) {
      let total = Number(tenda.tarif) * data.jumlah;
      await conn.query(
        'INSERT INTO pinjam (kd_tenda,kd_user,kd_petugas,kode,jumlah_pinjam,total,status,tgl,bukti) VALUES (?,?,NULL,?,?,?,4,NOW(),?)',
        [data.tenda, data.user, '', data.jumlah, total, ''],
        (err, inserted) => {
          if (err) {
            cb(err);
          } else {
            let stokNow = tenda.stok - data.jumlah;
            let pinjamId = inserted.insertId;
            let kodePinjam =
              kode(pinjamId) + kode(data.tenda) + kode(data.user) + kode(data.jumlah);
            conn.query(
              'UPDATE pinjam SET kode = ? WHERE kd_pinjam = ?',
              [kodePinjam, pinjamId],
              (err, update) => {
                if (err) {
                  cb(err);
                } else {
                  conn.query(
                    'UPDATE tenda SET stok = ? WHERE kd_tenda = ?',
                    [stokNow, data.tenda],
                    (err, updated) => {
                      if (err) {
                        cb(err);
                      } else {
                        cb(null, {
                          status: 200,
                          kode_pinjam: kodePinjam,
                          id: pinjamId,
                          total: Number(total),
                        });
                      }
                    }
                  );
                }
              }
            );
          }
        }
      );
    } else {
      cb({
        status: 500,
        msg: 'Internal server error',
      });
    }
  });
};
