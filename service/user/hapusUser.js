const cekUser = require("./cekUser");

module.exports = async function hapusUser(conn, id, cb) {
  if (!id) {
    cb("Kode user tidak ditemukan");
  } else {
    await cekUser(conn, id, (err, result) => {
      if (err) {
        cb(err);
      } else {
        conn.query(
          "DELETE FROM user WHERE kd_user = ?",
          id,
          (err, deleted) => {
            if (err) {
              cb(err);
            } else if (deleted) {
              cb(null, {
                status: 200,
                deleted: true,
                msg: "User berhasil dihapus",
                data: deleted
              });
            } else {
              cb({
                status: 400,
                deleted: false,
                msg: "Gagal menghapus user"
              });
            }
          }
        );
      }
    });
  }
};
