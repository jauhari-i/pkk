module.exports = async function cekPetugas(conn, id, cb) {
    if (!id) {
        cb("Kode Petugas tidak ditemukan");
    } else {
        await conn.query(
            "SELECT * FROM petugas WHERE kd_petugas = ?",
            id,
            (err, petugas) => {
                if (err) {
                    cb(err);
                } else if (petugas.length > 0) {
                    cb(null, {
                        status: 200,
                        data: petugas
                    });
                } else {
                    cb({
                        status: 404,
                        data: null,
                        msg: "Data petugas tidak ditemukan"
                    });
                }
            }
        );
    }
};