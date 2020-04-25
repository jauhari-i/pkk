const controller = {};

const loginUser = require('../service/auth/loginUser');

controller.loginUser = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) {
      res.send(err);
    } else {
      let data = req.body;
      loginUser(conn, data, (err, result) => {
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
