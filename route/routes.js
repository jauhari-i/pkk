const express = require('express');
const app = express();

const userController = require('../controller/userController');
const petugasController = require('../controller/petugasController');
const tendaController = require('../controller/tendaController');
const authController = require('../controller/authController');
const pinjamController = require('../controller/pinjamController');

const cekToken = require('../config/cekToken');

app.post('/user', userController.tambahUser);
app.get('/user', userController.semuaUser);
app.get('/user/:kode', userController.satuUser);
app.put('/user/:kode', userController.editUser);
app.delete('/user/:kode', userController.hapusUser);

app.post('/petugas', petugasController.tambahPetugas);
app.get('/petugas', petugasController.semuaPetugas);
app.get('/petugas/:kode', petugasController.satuPetugas);
app.put('/petugas/:kode', petugasController.editPetugas);
app.delete('/petugas/:kode', petugasController.hapusPetugas);

app.post('/tenda', tendaController.tambahTenda);
app.get('/tenda', tendaController.semuaTenda);
app.get('/tenda/:kode', tendaController.satuTenda);
app.put('/tenda/:kode', tendaController.editTenda);
app.delete('/tenda/:kode', tendaController.hapusTenda);

app.post('/login/user', authController.loginUser);
app.post('/login/petugas', authController.loginPetugas);
app.post('/register/user', authController.registerUser);
app.post('/register/petugas', authController.registerPetugas);

app.get('/pinjam', pinjamController.semuaPinjam);
app.get('/pinjam/:kode', pinjamController.satuPinjam);
app.post('/pinjam/:tenda', [cekToken], pinjamController.tambahPinjam);
app.get('/ambil/:kode/:petugas', pinjamController.ambil);
app.get('/kembali/:kode', pinjamController.kembali);

module.exports = app;
