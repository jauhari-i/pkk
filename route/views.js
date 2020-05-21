const express = require('express');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const app = express();

// beranda
app.get('/', (req, res) => {
  fetch('http://localhost:3000/api/tenda')
    .then((data) => data.json())
    .then((data) => {
      let user = Boolean(req.cookies.token);
      let userData = jwt.decode(req.cookies.token);
      if (userData) {
        res.render('index', {
          data: data.data,
          user: user,
          userData: userData,
        });
      }
      res.render('index', {
        data: data.data,
        user: false,
      });
    });
});

// tenda
app.get('/tenda/:id', (req, res) => {
  let id = req.params.id;
  fetch('http://localhost:3000/api/tenda/' + id)
    .then((tdata) => tdata.json())
    .then((tdata) => {
      fetch('http://localhost:3000/api/tenda')
        .then((data) => data.json())
        .then((data) => {
          let user = Boolean(req.cookies.token);
          let userData = jwt.decode(req.cookies.token);
          if (userData) {
            res.render('singleproduct', {
              data: tdata.data,
              user: user,
              tenda: data.data,
              userData: userData,
            });
          }
          res.render('singleproduct', {
            data: tdata.data,
            user: false,
            tenda: data.data,
          });
        });
    });
});

// login
app.get('/login', (req, res) => {
  const body = {
    email: '',
    password: '',
  };
  if (req.cookies.token) {
    res.redirect('back');
  }
  if (req.cookies.msgLogin) {
    let msg = req.cookies.msgLogin;
    res.render('login', {
      error: false,
      msg: msg,
      body: body,
    });
  }
  res.render('login', {
    error: false,
    msg: '',
    body: body,
  });
});

// login
app.post('/login', (req, res) => {
  const body = {
    email: req.body.email,
    password: req.body.password,
  };
  fetch('http://localhost:3000/api/login/user', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.status === 400) {
        res.render('login', {
          error: true,
          msg: result.msg,
          body: body,
        });
      } else {
        res.clearCookie('msgLogin');
        res.cookie('token', result.token, { httpOnly: true, secure: false });
        res.redirect('/');
      }
    });
});

// logout
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('msgLogin');
  res.redirect('/login');
});

// register
app.get('/register', (req, res) => {
  const body = {
    nm_user: '',
    email: '',
    password: '',
    alamat: '',
    tlpn: null,
  };
  if (req.cookies.token) {
    res.redirect('back');
  }
  res.render('register', {
    error: false,
    msg: '',
    body: body,
  });
});

// register
app.post('/register', (req, res) => {
  const body = {
    nm_user: req.body.name,
    email: req.body.email,
    password: req.body.password,
    alamat: req.body.alamat,
    tlpn: req.body.tlpn,
  };
  fetch('http://localhost:3000/api/register/user', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.register) {
        res.cookie('msgLogin', 'Pendaftaran berhasil silahkan masuk', {
          httpOnly: true,
          secure: false,
        });
        res.redirect('/login');
      } else {
        res.render('register', {
          error: true,
          msg: result.error,
          body: body,
        });
      }
    });
});

// histori
app.get('/histori', (req, res) => {
  if (!req.cookies.token) {
    res.redirect('back');
  }
  let userData = jwt.decode(req.cookies.token);
  let user = Boolean(req.cookies.token);
  fetch('http://localhost:3000/api/pinjam/user/' + userData.id, {
    headers: { Authorization: req.cookies.token },
  })
    .then((data) => data.json())
    .then((data) => {
      res.render('histori', {
        data: data.data,
        user: user,
        userData: userData,
        moment: moment,
      });
    });
});

// histori satu
app.get('/histori/:id', (req, res) => {
  if (!req.cookies.token) {
    res.redirect('/login');
  }
  let userData = jwt.decode(req.cookies.token);
  let user = Boolean(req.cookies.token);
  fetch('http://localhost:3000/api/pinjam/' + req.params.id, {
    headers: { Authorization: req.cookies.token },
  })
    .then((data) => data.json())
    .then((data) => {
      res.render('historiSingle', {
        data: data.data,
        user: user,
        userData: userData,
        moment: moment,
      });
    });
});

// sewa
app.post('/pinjam/:id', (req, res) => {
  if (!req.cookies.token) {
    res.redirect('/login');
  }
  let token = req.cookies.token;
  let body = {
    jumlah: req.body.jumlah,
  };
  fetch('http://localhost:3000/api/pinjam/' + req.params.id, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: token },
  })
    .then((data) => data.json())
    .then((data) => {
      res.redirect('/histori/' + data.id);
    });
});

module.exports = app;
