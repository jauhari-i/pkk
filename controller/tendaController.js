const controller = {};
const path = require('path');
const tambah = require('../service/tenda/tambahTenda');
const semuaTenda = require('../service/tenda/semuaTenda');
const satuTenda = require('../service/tenda/satuTenda');
const editTenda = require('../service/tenda/editTenda');
const editTendaWithImg = require('../service/tenda/editTendaWithImg');
const hapusTenda = require('../service/tenda/hapusTenda');
const imgTenda = require('../service/tenda/getImg');
const popularTenda = require('../service/tenda/popularTenda');
const singleTenda = require('../service/tenda/singleTenda');

//tambahTenda
controller.tambahTenda = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let data = req.body;
      let file = data.file;
      tambah(conn, data, file, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

//semuaTenda
controller.semuaTenda = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      semuaTenda(conn, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

//satuTenda
controller.satuTenda = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let id = req.params.kode;
      satuTenda(conn, id, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

controller.singleTenda = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let id = req.params.kode;
      singleTenda(conn, id, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

//editTenda
controller.editTenda = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let id = req.params.kode;
      let data = req.body;
      if (data.file) {
        let file = data.file;
        console.log(file);
        editTendaWithImg(conn, data, file, id, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      } else {
        editTenda(conn, data, id, (err, result) => {
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

//hapusTenda
controller.hapusTenda = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let id = req.params.kode;
      hapusTenda(conn, id, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

// img tenda
controller.getImg = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let id = req.params.kode;
      imgTenda(conn, id, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.sendFile(path.join(__dirname, '../public/img', result));
        }
      });
    }
  });
};

controller.getPopular = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      popularTenda(conn, (err, result) => {
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
