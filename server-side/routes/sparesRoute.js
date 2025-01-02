const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const sanitize = require('sanitize-filename');
const { cloudinary } = require('../config/claudinary');
const {
  addSparePart,
  listSpareParts,
  removeSparePart,
  updateSparePart,
  getSparePartDetails,
} = require('../controllers/sparesControllers');

const sparesRouter = express.Router();

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'spare-parts', // Cloudinary folder name
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Allowed file types
    public_id: (req, file) => `${Date.now()}-${sanitize(file.originalname)}`, // Unique filename
  },
});

// Multer setup
const upload = multer({ storage });

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
