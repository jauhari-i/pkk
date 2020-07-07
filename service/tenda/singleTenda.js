module.exports = async function singleTenda(conn, id, cb) {
  if (!id) {
    cb('Kode tenda tidak ditemukan');
  } else {
    await conn.query('SELECT * FROM tenda WHERE kd_tenda = ?', id, (err, tenda) => {
      if (err) {
        cb(err);
      } else if (tenda.length > 0) {
        cb(null, {
          satuTenda: 200,
          data: tenda.map((doc) => ({
            kode_tenda: doc.kd_tenda,
            nama_tenda: doc.nm_tenda,
            kapasitas: doc.kapasitas,
            ukuran: doc.ukuran,
            bahan: doc.bahan,
            berat: doc.berat,
            kelengkapan: doc.kelengkapan,
            keterangan: doc.keterangan,
            tarif: doc.tarif,
            stok: doc.stok,
            durasi: doc.durasi,
          })),
        });
      } else {
        cb({
          status: 404,
          data: null,
          msg: 'Data tenda tidak ditemukan',
        });
      }
    });
  }
};
