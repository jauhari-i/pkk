const cekTenda = require('./cekTenda');

module.exports = async function editTenda(conn, data, id, cb) {
  const validation = [];
  if (!data.nm_tenda) {
    validation.push({
      error: 'Nama tenda diperlukan',
    });
  }
  if (!data.kapasitas) {
    validation.push({
      error: 'Kapasitas diperlukan',
    });
  }
  if (!data.ukuran) {
    validation.push({
      error: 'Ukuran diperlukan',
    });
  }
  if (!data.bahan) {
    validation.push({
      error: 'Bahan diperlukan',
    });
  }
  if (!data.berat) {
    validation.push({
      error: 'Berat diperlukan',
    });
  }
  if (!data.kelengkapan) {
    validation.push({
      error: 'Kelengkapan diperlukan',
    });
  }
  if (!data.keterangan) {
    validation.push({
      error: 'Keterangan diperlukan',
    });
  }
  if (!data.tarif) {
    validation.push({
      error: 'Tarif diperlukan',
    });
  }
  if (!data.durasi) {
    validation.push({
      error: 'Durasi diperlukan',
    });
  }
  if (!data.stok) {
    validation.push({
      error: 'Stok diperlukan',
    });
  }
  if (!id) {
    validation.push({
      error: 'Kode tenda tidak valid',
    });
  }
  if (validation.length > 0) {
    cb(validation);
  } else {
    await cekTenda(conn, id, (err, ada) => {
      if (err) {
        cb(err);
      } else {
        conn.query(
          'UPDATE tenda SET nm_tenda = ?, kapasitas = ?, ukuran = ?, bahan = ?, berat = ?, kelengkapan = ?, keterangan = ?, tarif = ?, stok = ?, durasi = ? WHERE kd_tenda = ?',
          [
            data.nm_tenda,
            data.kapasitas,
            data.ukuran,
            data.bahan,
            data.berat,
            data.kelengkapan,
            data.keterangan,
            data.tarif,
            data.stok,
            data.durasi,
            id,
          ],
          (err, updated) => {
            if (err) {
              cb(err);
            } else if (updated) {
              cb(null, {
                status: 200,
                updated: true,
                msg: 'Tenda telah diupdate',
                data: updated,
              });
            } else {
              cb({
                status: 400,
                updated: false,
                msg: 'Gagal mengupdate tenda',
              });
            }
          }
        );
      }
    });
  }
};
