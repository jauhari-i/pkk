module.exports = async function satuTenda(conn, id, cb) {
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
            kapasitas: doc.kapasitas + ' orang',
            ukuran: doc.ukuran,
            bahan: doc.bahan,
            berat: doc.berat + ' gram',
            kelengkapan: doc.kelengkapan,
            keterangan: doc.keterangan,
            tarif: doc.tarif + '/' + doc.durasi + ' hari',
            stok: doc.stok,
            durasi: doc.durasi + ' hari',
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
