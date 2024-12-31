const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');
const {
  addSparePart,
  listSpareParts,
  removeSparePart,
  updateSparePart,
  getSparePartDetails,
} = require('../controllers/sparesControllers');

const sparesRouter = express.Router();

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedFilename = sanitize(file.originalname);
    cb(null, `${timestamp}-${sanitizedFilename}`);
  },
});

const allowedFileTypes = /jpg|jpeg|png|gif/;

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const mimeType = allowedFileTypes.test(file.mimetype);
    if (mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and GIF files are allowed.'));
    }
  },
});

// Middleware for error handling
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Routes
sparesRouter.post('/add', upload.single('image'), addSparePart, multerErrorHandler);
sparesRouter.get('/list', listSpareParts);
sparesRouter.get('/list/:id', getSparePartDetails);
sparesRouter.delete('/remove/:id', removeSparePart);
sparesRouter.patch('/update/:id', upload.single('image'), updateSparePart, multerErrorHandler);

module.exports = sparesRouter;
