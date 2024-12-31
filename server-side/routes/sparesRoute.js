const express = require('express');
const multer = require('multer');
const { addSparePart, listSpareParts, removeSparePart, updateSparePart, getSparePartDetails } = require('../controllers/sparesControllers');
const fs = require('fs');
const path = require('path');



const sparesRouter = express.Router();

// Image storage engine for Multer
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|gif/;
    const mimeType = allowedTypes.test(file.mimetype);
    if (mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only images are allowed'), false);
    }
  }
});

// Route to add spare part (with image upload)
sparesRouter.post('/add', upload.single("image"), addSparePart);

// Route to list all spare parts
sparesRouter.get('/list', listSpareParts);

// Route to remove a spare part (with an identifier)
sparesRouter.delete('/remove/:id', removeSparePart);

sparesRouter.post('/update/:id', updateSparePart)

sparesRouter.get('/list/:id', getSparePartDetails)

module.exports = sparesRouter;
