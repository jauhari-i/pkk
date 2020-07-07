const express = require('express');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const basicAuth = require('express-basic-auth');
const app = express();
const baseUrl = 'http://localhost:3000/api';
const users = {
  admin: 'tendaku123',
  fufu: 'fufu123',
  atalie: 'tata123',
};
const tendaImg = require('../upload/script/tendaImg');
const { default: Axios } = require('axios');

// beranda
app.get('/', (req, res) => {
  fetch(baseUrl + '/tenda')
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
  fetch(baseUrl + '/tenda/' + id)
    .then((tdata) => tdata.json())
    .then((tdata) => {
      fetch(baseUrl + '/tenda')
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
  fetch(baseUrl + '/login/user', {
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
  fetch(baseUrl + '/register/user', {
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
  fetch(baseUrl + '/pinjam/user/' + userData.id, {
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
  fetch(baseUrl + '/pinjam/' + req.params.id, {
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
  fetch(baseUrl + '/pinjam/' + req.params.id, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: token },
  })
    .then((data) => data.json())
    .then((data) => {
      res.redirect('/histori/' + data.id);
    });
});

app.get(
  '/petugas/login',
  basicAuth({
    users,
    challenge: true,
  }),
  (req, res) => {
    const body = {
      email: '',
      password: '',
    };
    if (req.cookies.admintoken) {
      res.redirect('/petugas/dashboard');
    }
    res.render('adminLogin', { body });
  }
);

app.post(
  '/petugas/login',
  basicAuth({
    users,
    challenge: true,
  }),
  (req, res) => {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };
    fetch(baseUrl + '/login/petugas', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.status === 400) {
          res.render('login', {
            body: body,
          });
        } else {
          res.cookie('admintoken', result.token, { httpOnly: true, secure: false });
          res.redirect('/petugas/dashboard');
        }
      });
  }
);

app.get('/petugas/logout', (req, res) => {
  res.clearCookie('admintoken');
  res.redirect('/petugas/login');
});

app.get(
  '/petugas/dashboard',
  basicAuth({
    users,
    challenge: true,
  }),
  (req, res) => {
    if (!req.cookies.admintoken) {
      res.clearCookie('admintoken');
      res.redirect('/petugas/login');
    }
    fetch(baseUrl + '/tenda/populer', { headers: { Authorization: req.cookies.admintoken } })
      .then((tenda) => tenda.json())
      .then((tenda) => {
        let userData = jwt.decode(req.cookies.admintoken);
        fetch(baseUrl + '/dashboard', { headers: { Authorization: req.cookies.admintoken } })
          .then((dashboard) => dashboard.json())
          .then((dashboard) => {
            fetch(baseUrl + '/pinjam/new', { headers: { Authorization: req.cookies.admintoken } })
              .then((pinjamNew) => pinjamNew.json())
              .then((pinjamNew) => {
                res.render('dashboard', {
                  populer: tenda.data,
                  userData: userData,
                  dash: dashboard.data,
                  peminjaman: pinjamNew.data,
                });
              });
          });
      });
  }
);

app.get('/petugas/dashboard/tenda', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  let userData = jwt.decode(req.cookies.admintoken);
  fetch(baseUrl + '/tenda')
    .then((tenda) => tenda.json())
    .then((tenda) => {
      res.render('tendaView', { userData: userData, tenda: tenda.data });
    });
});

app.get('/petugas/dashboard/tenda/tambah', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  let userData = jwt.decode(req.cookies.admintoken);
  res.render('tendaAdd', { userData });
});

app.post('/petugas/add/tenda', [basicAuth({ users, challenge: true }), tendaImg], (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  let data = {
    nm_tenda: req.body.nm_tenda,
    kapasitas: req.body.kapasitas,
    ukuran: req.body.ukuran,
    bahan: req.body.bahan,
    berat: req.body.berat,
    kelengkapan: req.body.kelengkapan,
    keterangan: req.body.keterangan,
    tarif: req.body.tarif,
    stok: req.body.stok,
    durasi: req.body.durasi,
    file: req.file ? req.file : null,
  };
  Axios.post(`${baseUrl}/tenda`, data, {
    headers: { Authorization: req.cookies.admintoken },
  })
    .then((result) => {
      res.redirect('/petugas/dashboard/tenda');
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/petugas/dashboard/tenda/:id', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  let userData = jwt.decode(req.cookies.admintoken);
  fetch(baseUrl + '/tenda/' + req.params.id)
    .then((tenda) => tenda.json())
    .then((tenda) => {
      res.render('tendaSingle', { userData: userData, tenda: tenda.data[0] });
    });
});

app.get('/petugas/dashboard/tenda/edit/:id', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  let userData = jwt.decode(req.cookies.admintoken);
  fetch(baseUrl + '/tenda/edit/' + req.params.id)
    .then((tenda) => tenda.json())
    .then((tenda) => {
      res.render('tendaEdit', { userData: userData, tenda: tenda.data[0] });
    });
});

app.post('/petugas/edit/tenda', [basicAuth({ users, challenge: true }), tendaImg], (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  let data = {
    nm_tenda: req.body.nm_tenda,
    kapasitas: req.body.kapasitas,
    ukuran: req.body.ukuran,
    bahan: req.body.bahan,
    berat: req.body.berat,
    kelengkapan: req.body.kelengkapan,
    keterangan: req.body.keterangan,
    tarif: req.body.tarif,
    stok: req.body.stok,
    durasi: req.body.durasi,
    file: req.file ? req.file : null,
  };
  let id = req.body.kd_tenda;
  Axios.put(`${baseUrl}/tenda/${id}`, data, {
    headers: { Authorization: req.cookies.admintoken },
  })
    .then((result) => {
      res.redirect('/petugas/dashboard/tenda/' + id);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/petugas/delete/tenda/:id', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  Axios.delete(baseUrl + '/tenda/' + req.params.id, {
    headers: { Authorization: req.cookies.admintoken },
  }).then((result) => {
    res.redirect('/petugas/dashboard/tenda');
  });
});

app.get('/petugas/dashboard/peminjaman', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  fetch(baseUrl + '/pinjam', { headers: { Authorization: req.cookies.admintoken } })
    .then((pinjam) => pinjam.json())
    .then((pinjam) => {
      let userData = jwt.decode(req.cookies.admintoken);
      res.render('peminjaman', { userData, pinjam: pinjam.data });
    });
});

app.get('/petugas/terima/:id', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  let userData = jwt.decode(req.cookies.admintoken);
  fetch(baseUrl + '/ambil/' + req.params.id + '/' + userData.id, {
    headers: { Authorization: req.cookies.admintoken },
  })
    .then((result) => result.json())
    .then((result) => {
      res.redirect('/petugas/dashboard/peminjaman');
    });
});

app.get('/petugas/kembali/:id', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  fetch(baseUrl + '/kembali/' + req.params.id, {
    headers: { Authorization: req.cookies.admintoken },
  })
    .then((result) => result.json())
    .then((result) => {
      res.redirect('/petugas/dashboard/peminjaman');
    });
});

app.get('/petugas/pinjam/hapus/:id', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }

  Axios.delete(baseUrl + '/pinjam/' + req.params.id, {
    headers: { Authorization: req.cookies.admintoken },
  }).then((result) => {
    res.redirect('/petugas/dashboard/peminjaman');
  });
});

app.get(
  '/petugas/dashboard/peminjaman/tambah',
  basicAuth({ users, challenge: true }),
  (req, res) => {
    if (!req.cookies.admintoken) {
      res.redirect('/petugas/login');
    }
    fetch(baseUrl + '/tenda')
      .then((data) => data.json())
      .then((data) => {
        fetch(baseUrl + '/user', { headers: { Authorization: req.cookies.admintoken } })
          .then((user) => user.json())
          .then((user) => {
            let userData = jwt.decode(req.cookies.admintoken);
            res.render('peminjamanAdd', { userData, tenda: data.data, users: user.data });
          });
      });
  }
);

app.post('/petugas/pinjam/add', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }
  const data = req.body;
  if (!data.kd_tenda || !data.kd_user) {
    res.redirect('/petugas/dashboard/peminjaman/tambah');
  }
  Axios.post(
    `${baseUrl}/pinjam/${data.kd_tenda}`,
    { user: data.kd_user, jumlah: data.jumlah },
    { headers: { Authorization: req.cookies.admintoken } }
  ).then((result) => {
    res.redirect('/petugas/dashboard/peminjaman');
  });
});

app.get('/petugas/dashboard/peminjaman/:id', basicAuth({ users, challenge: true }), (req, res) => {
  if (!req.cookies.admintoken) {
    res.redirect('/petugas/login');
  }

  fetch(baseUrl + '/pinjam/' + req.params.id, {
    headers: { Authorization: req.cookies.admintoken },
  })
    .then((data) => data.json())
    .then((data) => {
      let userData = jwt.decode(req.cookies.admintoken);
      res.render('peminjamanSingle', { userData, data: data.data[0], moment });
    });
});

module.exports = app;
