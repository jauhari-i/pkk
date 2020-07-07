const cekPinjam = require('./cekPinjam');
const moment = require('moment');

const cekStatus = (status, cb) => {
  if (status === 0) {
    cb(null, {
      status: 'Dikembalikan',
      code: 0,
    });
  }
  if (status === 1) {
    cb(null, {
      status: 'Dipinjam',
      code: 1,
    });
  }
  if (status === 2) {
    cb(null, {
      status: 'Dikembalikan Terlambat',
      code: 2,
    });
  }
  if (status === 3) {
    cb(null, {
      status: 'Belum Dikembalikan',
      code: 3,
    });
  }
  if (status === 4) {
    cb(null, {
      status: 'Menunggu Konfirmasi',
      code: 4,
    });
  }
};

const hasPetugas = (conn, petugas, cb) => {
  conn.query('SELECT * FROM petugas WHERE kd_petugas = ?', petugas, (err, petugas) => {
    if (err) {
      cb(err);
    } else if (petugas.length > 0) {
      cb(null, petugas[0]);
    } else {
      cb({
        error: 'Data petugas tidak ada',
      });
    }
  });
};

module.exports = pinjamNew = async (conn, cb) => {
  await conn.query(
    'SELECT * FROM pinjam INNER JOIN user ON pinjam.kd_user=user.kd_user INNER JOIN tenda ON pinjam.kd_tenda=tenda.kd_tenda ORDER BY tgl DESC LIMIT 0, 5',
    (err, data) => {
      if (err) {
        cb(err);
      } else {
        let pinjamData = data.map((dat) => ({
          kd_pinjam: dat.kd_pinjam,
          kd_tenda: dat.kd_tenda,
          kd_user: dat.kd_user,
          kd_petugas: dat.kd_petugas,
          kode: dat.kode,
          jumlah: dat.jumlah_pinjam,
          total: dat.total,
          status: dat.status,
          tgl: dat.tgl,
          bukti: dat.bukti,
          nm_user: dat.nm_user,
          email: dat.email,
          nm_tenda: dat.nm_tenda,
          durasi: dat.durasi,
          tarif: dat.tarif,
          stok: dat.stok,
        }));

        let fixedData = [];
        pinjamData.map((item, i) => {
          cekStatus(item.status, (err, stats) => {
            cekPinjam(conn, item.tgl, item.kd_pinjam, item.status, item.durasi, (err, kode) => {
              if (err) {
                cb(err);
              } else {
                if (item.kd_petugas) {
                  // jika ada petugas
                  hasPetugas(conn, item.kd_petugas, (err, petugas) => {
                    if (err) {
                      return cb(err);
                    } else {
                      fixedData.push({
                        primary: {
                          kd_pinjam: item.kd_pinjam,
                          kd_user: item.kd_user,
                          kd_tenda: item.kd_tenda,
                          kd_petugas: item.kd_petugas,
                        },
                        userData: {
                          nm_user: item.nm_user,
                          email: item.email,
                        },
                        tendaData: {
                          nm_tenda: item.nm_tenda,
                          durasi: item.durasi,
                          tarif: item.tarif,
                          stok: item.stok,
                        },
                        petugasData: {
                          nm_petugas: petugas.nm_petugas,
                          email: petugas.email,
                        },
                        main: {
                          kode: item.kode,
                          total: item.total,
                          status: stats,
                          tgl: moment(item.tgl).format('LLLL'),
                          bukti: item.bukti,
                          pinjam_status: kode,
                          jumlah: item.jumlah,
                        },
                      });
                    }
                    if (fixedData.length === pinjamData.length) {
                      return cb(null, {
                        status: 200,
                        data: fixedData,
                      });
                    }
                  });
                } else {
                  // jika tida ada petugas
                  fixedData.push({
                    primary: {
                      kd_pinjam: item.kd_pinjam,
                      kd_user: item.kd_user,
                      kd_tenda: item.kd_tenda,
                      kd_petugas: item.kd_petugas,
                    },
                    userData: {
                      nm_user: item.nm_user,
                      email: item.email,
                    },
                    tendaData: {
                      nm_tenda: item.nm_tenda,
                      durasi: item.durasi,
                      tarif: item.tarif,
                      stok: item.stok,
                    },
                    petugasData: {
                      nm_petugas: null,
                      email: null,
                    },
                    main: {
                      kode: item.kode,
                      total: item.total,
                      status: stats,
                      tgl: moment(item.tgl).format('LLLL'),
                      bukti: item.bukti,
                      pinjam_status: kode,
                      jumlah: item.jumlah,
                    },
                  });
                }
              }
            });
          });
          if (fixedData.length === pinjamData.length) {
            return cb(null, {
              status: 200,
              data: fixedData,
            });
          }
        });
      }
    }
  );
};
