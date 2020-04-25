const cekUser = require("./cekUser")

module.exports = async function editUser(conn, data, id, cb) {
    const validation = [];
    if (!data.nm_user) {
        validation.push({
            error: "Nama user diperlukan"
        });
    }
    if (!data.alamat) {
        validation.push({
            error: "Alamat diperlukan"
        });
    }
    if (!data.tlpn) {
        validation.push({
            error: "Telepon diperlukan"
        });
    }
    if (!data.email) {
        validation.push({
            error: "Email diperlukan"
        });
    }
    if (!data.password) {
        validation.push({
            error: "Password diperlukan"
        });
    }
    if (!id) {
        validation.push({
            error: "Kode user tidak valid"
        });
    }
    if (validation.length > 0) {
        cb(validation);
    } else {
        await cekUser(conn, id, (err, ada) => {
            if (err) {
                cb(err);
            } else {
                conn.query(
                    "UPDATE user SET nm_user = ?, alamat = ?, tlpn = ?, email = ?, password = ? WHERE kd_user = ?",
                    [data.nm_user, data.alamat, data.tlpn, data.email, id],
                    (err, updated) => {
                        if (err) {
                            cb(err);
                        } else if (updated) {
                            cb(null, {
                                status: 200,
                                updated: true,
                                msg: "User telah diupdate",
                                data: updated
                            });
                        } else {
                            cb({
                                status: 400,
                                updated: false,
                                msg: "Gagal mengupdate user"
                            });
                        }
                    }
                );    
            }
        });
    }    
};