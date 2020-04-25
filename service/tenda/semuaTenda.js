module.exports = async function semuaTenda(conn, cb) {
    await conn.query("SELECT * FROM tenda", (err, data) => {
      if (err) {
      } else if (data.length > 0) {
        const datas = data.map(doc => ({
          kode_tenda: doc.kd_tenda,
          nama_tenda: doc.nm_tenda,
          kapasitas: doc.kapasitas + " orang",
          ukuran: doc.ukuran,
          bahan: doc.bahan,
          berat: doc.berat + " gram",
          kelengkapan: doc.kelengkapan,
          keterangan: doc.keterangan,
          tarif: doc.tarif + "/" + doc.durasi + " hari",
          stok: doc.stok,
          durasi: doc.durasi + " hari"
        }));
        cb(null, {
          status: 200,
          data: datas
        });
      } else {
        cb({
          status: 200,
          data: null,
          msg: "Data tenda kosong"
        });
      }
    });
};