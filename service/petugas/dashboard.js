module.exports = dashboard = async (conn, cb) => {
  await conn.query('SELECT COUNT(*) as userCount FROM user', async (err, user) => {
    await conn.query('SELECT COUNT(*) as tendaCount FROM tenda', async (err, tenda) => {
      await conn.query(
        'SELECT COUNT(*) as pinjamCount FROM pinjam WHERE status != 4',
        async (err, pinjam) => {
          await conn.query(
            'SELECT COUNT(*) as tendaPinjamCount FROM pinjam WHERE status = 3 OR status = 1 ',
            async (err, tpinjam) => {
              const data = {
                user: user[0].userCount,
                tenda: tenda[0].tendaCount,
                pinjam: pinjam[0].pinjamCount,
                tpinjam: tpinjam[0].tendaPinjamCount,
              };
              cb(null, { status: 200, data });
            }
          );
        }
      );
    });
  });
};
