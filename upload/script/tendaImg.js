const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './public/img',
  filename: function (req, file, cb) {
    cb(null, 'Tenda' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
}).single('tenda');

module.exports = upload;
