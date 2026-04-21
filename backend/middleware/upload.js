// backend/middleware/upload.js
const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const os     = require('os');

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction && !fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (isProduction) {
      cb(null, os.tmpdir());
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase());
  if (allowed) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});