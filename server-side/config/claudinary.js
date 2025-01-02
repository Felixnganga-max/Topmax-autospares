// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
require('dotenv').config()

cloudinary.config({
  cloud_name: "dfuv6m4va",
  api_key: "528637913152672",
  api_secret: "kyLOb0R45nMaH-3c2AgxoDwRw1A",
});

module.exports = {cloudinary};
