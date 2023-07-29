const multer = require('multer');

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single('avatar');

module.exports = singleUpload;
