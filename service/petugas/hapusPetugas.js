const cekPetugas = require("./cekPetugas")

module.exports = async function hapusPetugas(conn, id, cb) {
    if (!id) {
        cb("Kode petugas tidak ditemukan");
    } else {
        await cekPetugas(conn, id, (err, result) => {
            if (err) {
              cb(err);
            } else {
                conn.query(
                    "DELETE FROM petugas WHERE kd_petugas = ?",
                    id,
                    (err, deleted) => {
                    if (err) {
                        cb(err);
                    } else if (deleted) {
                        cb(null, {
                        status: 200,
                        deleted: true,
                        msg: "Petugas berhasil dihapus",
                          data: deleted
                        });
                    } else {
                        cb({
                        status: 400,
                        deleted: false,
                        msg: "Gagal menghapus petugas"
                        });
                    }
                    }
                );
            }
        });
    }
};