module.exports = async function tambahTenda(conn, data, cb) {
    const validation = [];
    if (!data.nm_tenda) {
      validation.push({
        error: "Nama tenda diperlukan"
      });
    }
    if (!data.kapasitas) {
      validation.push({
        error: "Kapasitas diperlukan"
      });
    }
    if (!data.ukuran) {
      validation.push({
        error: "Ukuran diperlukan"
      });
    }
    if (!data.bahan) {
      validation.push({
        error: "Bahan diperlukan"
      });
    }
    if (!data.berat) {
      validation.push({
        error: "Berat diperlukan"
      });
    }
    if (!data.kelengkapan) {
      validation.push({
        error: "Kelengkapan diperlukan"
      });
    }
    if (!data.keterangan) {
      validation.push({
        error: "Keterangan diperlukan"
      });
    }
    if (!data.tarif) {
      validation.push({
        error: "Tarif diperlukan"
      });
    }
    if (!data.durasi) {
      validation.push({
        error: "Durasi diperlukan"
      });
    }
    if (!data.stok) {
      validation.push({
        error: "Stok diperlukan"
      });
    }
    if (validation.length > 0) {
      cb(validation);
    } else {
      conn.query(
        "INSERT INTO tenda (nm_tenda,kapasitas,ukuran,bahan,berat,kelengkapan,keterangan,tarif,stok,durasi) VALUES (?,?,?,?,?,?,?,?,?,?)",
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
          data.durasi
        ],
        (err, inserted) => {
          if (err) {
            cb(err);
          } else if (inserted) {
            cb(null, {
              status: 200,
              inserted: true,
              msg: "Tenda telah ditambahkan",
              data: inserted
            });
          } else {
            cb("Gagal menambahkan tenda");
          }
        }
      );
    }
  }