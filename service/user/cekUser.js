module.exports = async function cekUser(conn, id, cb) {
    if (!id) {
      cb("Kode user tidak ditemukan");
    } else {
      await conn.query(
        "SELECT * FROM user WHERE kd_user = ?",
        id,
        (err, user) => {
          if (err) {
            cb(err);
          } else if (user.length > 0) {
            cb(null, {
              status: 200,
              data: user
            });
          } else {
            cb({
              status: 404,
              data: null,
              msg: "Data user tidak ditemukan"
            });
          }
        }
      );
    }
  };