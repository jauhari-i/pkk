module.exports = async function cekTenda(conn, id, cb) {
    if (!id) {
        cb("Kode tenda tidak ditemukan");
    } else {
        await conn.query(
            "SELECT * FROM tenda WHERE kd_tenda = ?",
            id,
            (err, tenda) => {
                if (err) {
                    cb(err);
                } else if (tenda.length > 0) {
                    cb(null, {
                        status: 200,
                        data: tenda
                    });
                } else {
                    cb({
                        status: 404,
                        data: null,
                        msg: "Data tenda tidak ditemukan"
                    });
                }
            }
        );
    }
};