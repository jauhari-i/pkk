const controller = {};

const tambahPinjam = require('../service/pinjam/tambahPinjam');
const semuaPinjam = require('../service/pinjam/semuaPinjam');
const satuPinjam = require('../service/pinjam/satuPinjam');

controller.tambahPinjam = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let data = {
        user: req.decoded.id,
        tenda: req.params.tenda,
        jumlah: req.body.jumlah,
        total: req.body.total,
      };
      tambahPinjam(conn, data, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

controller.semuaPinjam = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      semuaPinjam(conn, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

controller.satuPinjam = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let data = {
        kd_pinjam: req.params.kode,
      };
      satuPinjam(conn, data, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

module.exports = controller;
