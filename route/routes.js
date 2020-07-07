const express = require('express');
const app = express();

const userController = require('../controller/userController');
const petugasController = require('../controller/petugasController');
const tendaController = require('../controller/tendaController');
const authController = require('../controller/authController');
const pinjamController = require('../controller/pinjamController');

const cekToken = require('../config/cekToken');
const cekPetugas = require('../config/cekPetugas');
const tendaImg = require('../upload/script/tendaImg');

app.post('/user', [cekToken, cekPetugas], userController.tambahUser);
app.get('/user', [cekToken, cekPetugas], userController.semuaUser);
app.get('/user/:kode', [cekToken, cekPetugas], userController.satuUser);
app.put('/user/:kode', [cekToken, cekPetugas], userController.editUser);
app.delete('/user/:kode', [cekToken, cekPetugas], userController.hapusUser);

app.post('/petugas', [cekToken, cekPetugas], petugasController.tambahPetugas);
app.get('/petugas', [cekToken, cekPetugas], petugasController.semuaPetugas);
app.get('/petugas/:kode', [cekToken, cekPetugas], petugasController.satuPetugas);
app.put('/petugas/:kode', [cekToken, cekPetugas], petugasController.editPetugas);
app.delete('/petugas/:kode', [cekToken, cekPetugas], petugasController.hapusPetugas);

app.post('/tenda', [cekToken, cekPetugas, tendaImg], tendaController.tambahTenda);
app.get('/tenda', tendaController.semuaTenda);
app.get('/tenda/populer', tendaController.getPopular);
app.get('/tenda/edit/:kode', tendaController.singleTenda);
app.get('/tenda/:kode', tendaController.satuTenda);
app.put('/tenda/:kode', [cekToken, cekPetugas], tendaController.editTenda);
app.delete('/tenda/:kode', [cekToken, cekPetugas], tendaController.hapusTenda);
app.get('/tenda/img/:kode', tendaController.getImg);

app.post('/login/user', authController.loginUser);
app.post('/login/petugas', authController.loginPetugas);
app.post('/register/user', authController.registerUser);
app.post('/register/petugas', authController.registerPetugas);

app.get('/pinjam', [cekToken, cekPetugas], pinjamController.semuaPinjam);
app.get('/pinjam/new', [cekToken, cekPetugas], pinjamController.pinjamNew);
app.get('/pinjam/user/:user', [cekToken], pinjamController.userPinjam);
app.get('/pinjam/:kode', [cekToken], pinjamController.satuPinjam);
app.post('/pinjam/:tenda', [cekToken], pinjamController.tambahPinjam);
app.get('/ambil/:kode/:petugas', [cekToken, cekPetugas], pinjamController.ambil);
app.get('/kembali/:kode', [cekToken, cekPetugas], pinjamController.kembali);
app.delete('/pinjam/:kode', [cekToken, cekPetugas], pinjamController.hapus);

app.get('/dashboard', [cekToken, cekPetugas], petugasController.dashboard);

module.exports = app;
