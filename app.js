const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./db/db');
const port = 3000;

app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

if (app.use(db)) {
  console.log('Database terkoneksi');
} else {
  console.log('Database tidak terkoneksi');
}

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', require('./route/views'));
app.use('/api', require('./route/routes'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
