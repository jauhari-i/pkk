const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./db/db');
const port = 3000;

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/petugas', express.static(path.join(__dirname, 'public')));
app.use('/petugas/dashboard', express.static(path.join(__dirname, 'public')));
app.use('/petugas/dashboard/tenda', express.static(path.join(__dirname, 'public')));
app.use('/petugas/dashboard/tenda/edit', express.static(path.join(__dirname, 'public')));
app.use('/petugas/dashboard/tenda/tambah', express.static(path.join(__dirname, 'public')));
app.use('/petugas/dashboard/peminjaman', express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (app.use(db)) {
  console.log('Database terkoneksi');
} else {
  console.log('Database tidak terkoneksi');
}

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./route/views'));
app.use('/api', require('./route/routes'));

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({
    message: req.method + ' ' + req.url + ' not found',
    error: 'NoEndpointExist',
    code: 404,
  });
  next();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
