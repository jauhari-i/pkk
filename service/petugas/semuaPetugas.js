module.exports = async function semuaPetugas(conn, cb) {
    await conn.query("SELECT * FROM petugas", (err, data) => {
        if (err) {
        } else if (data.length > 0) {
            const datas = data.map(doc => ({
                kode_petugas: "PG" + doc.kd_petugas,
                nama_petugas: doc.nm_petugas,
                email: doc.email
            }));
            cb(null, {
                status: 200,
                data: datas
            });
        } else {
            cb({
                status: 200,
                data: null,
                msg: "Data petugas kosong"
            });
        }
    });
}