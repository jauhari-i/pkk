const moment = require('moment');

moment.locale('id');

const date = {
  dateToday: moment().format('YYYY-MM-DD'),
  dateTimeToday: moment().format('YYYY-MM-DD HH:MM:SS'),
  dateTommorrow: moment().add(1, 'd').format('YYYY-MM-DD'),
};

module.exports = cekPinjam = (conn, tgl, id, status, durasi, cb) => {
  let dateTransLimit = moment(tgl).add(1, 'd').format('YYYY-MM-DD HH:MM:SS');
  let datePengembalian = moment(tgl).add(durasi, 'd').format('YYYY-MM-DD HH:MM:SS');
  if (status === 4 && date.dateToday > dateTransLimit) {
    conn.query('DELETE FROM pinjam WHERE kd_pinjam = ?', id, (err, del) => {
      if (err) {
        return cb(err);
      } else {
        return cb(null, del);
      }
    });
  } else if (status === 1 && date.dateToday > datePengembalian) {
    conn.query('UPDATE pinjam SET status = ? WHERE kd_pinjam = ?', [3, id], (err, upd) => {
      if (err) {
        return cb(err);
      } else {
        return cb(null, upd);
      }
    });
  } else {
    let due = moment(dateTransLimit).endOf('minute').fromNow();
    if (status === 4) {
      return cb(null, {
        stats: 'aktif',
        due: due,
        tenggat: dateTransLimit,
      });
    } else if (status === 1) {
      return cb(null, {
        stats: 'Barang dipakai',
        tgl_pengembalian: datePengembalian,
      });
    } else if (status === 0) {
      return cb(null, {
        stats: 'Dikembalikan',
      });
    } else if (status === 2) {
      return cb(null, {
        stats: 'Dikembalikan terlambat',
      });
    } else {
      return cb(null, {
        stats: 'Diterima',
      });
    }
  }
};
