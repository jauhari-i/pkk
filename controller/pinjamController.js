const controller = {};

const tambahPinjam = require('../service/pinjam/tambahPinjam');
const semuaPinjam = require('../service/pinjam/semuaPinjam');
const satuPinjam = require('../service/pinjam/satuPinjam');
const ambil = require('../service/pinjam/ambil');
const kembali = require('../service/pinjam/kembali');
const userPinjam = require('../service/pinjam/userPinjam');
const pinjamNew = require('../service/pinjam/pinjamNew');
const hapusPinjam = require('../service/pinjam/hapusPinjam');

controller.tambahPinjam = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      if (req.decoded.role === 1) {
        let data = {
          user: req.body.user,
          tenda: req.params.tenda,
          jumlah: req.body.jumlah,
        };
        tambahPinjam(conn, data, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      } else {
        let data = {
          user: req.decoded.id,
          tenda: req.params.tenda,
          jumlah: req.body.jumlah,
        };
        tambahPinjam(conn, data, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      }
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

controller.pinjamNew = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      pinjamNew(conn, (err, result) => {
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

controller.userPinjam = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let data = {
        kd_user: req.params.user,
      };
      userPinjam(conn, data, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

controller.ambil = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let data = {
        kd_pinjam: req.params.kode,
        kd_petugas: req.params.petugas,
      };
      ambil(conn, data, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

controller.kembali = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      kembali(conn, req.params.kode, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

controller.hapus = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      hapusPinjam(conn, req.params.kode, (err, result) => {
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
