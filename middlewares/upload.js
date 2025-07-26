// middleware/multer.js
const multer = require('multer');
const path = require('path');

// Use memory storage to keep the file in RAM (for Cloudinary)
const storage = multer.memoryStorage();

// Filter to only allow image files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  if (!allowedTypes.includes(ext)) {
    return cb(new Error('File type is not supported'), false);
  }

  cb(null, true);
};

// Multer upload instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // optional: limit file size to 5MB
  },
});

module.exports = upload;
