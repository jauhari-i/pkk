const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './upload/img',
  filename: function (req, file, cb) {
    cb(null, 'bukti' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
}).single('bukti');

module.exports = upload;
