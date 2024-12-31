const sparePartModel = require("../models/spareModel.js");
const fs = require("fs");
const path = require("path");

// Utility to remove a file
const removeFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Add Spare Part
const addSparePart = async (req, res) => {
  try {
    // Ensure an image was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const sparePart = new sparePartModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      priceHistory: req.body.priceHistory || [], // Default to an empty array if not provided
      dimensions: req.body.dimensions,
      compatibility: req.body.compatibility,
      category: req.body.category,
      brand: req.body.brand,
      stock: req.body.stock,
      image: req.file.filename, // Save the uploaded image filename
      warranty: req.body.warranty,
      ratings: req.body.ratings || [], // Default to an empty array
    });

    const savedSparePart = await sparePart.save();
    res.status(201).json({ success: true, data: savedSparePart });
  } catch (error) {
    console.error("Error adding spare part:", error);
    res.status(500).json({ success: false, message: "Error adding spare part" });
  }
};

// List Spare Parts
const listSpareParts = async (req, res) => {
  try {
    // Fetch all spare parts without limiting fields
    const spareParts = await sparePartModel.find();
    res.status(200).json({ success: true, data: spareParts });
  } catch (error) {
    console.error("Error fetching spare parts:", error);
    res.status(500).json({ success: false, message: "Error fetching spare parts" });
  }
};

// Remove Spare Part
const removeSparePart = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    const sparePart = await sparePartModel.findById(id);
    if (!sparePart) {
      return res.status(404).json({ success: false, message: "Spare part not found" });
    }

    // Remove associated image file
    const imagePath = path.join("uploads", sparePart.image);
    try {
      await removeFile(imagePath);
    } catch (err) {
      console.error(`Error removing file: ${imagePath}`, err);
    }

    // Remove spare part from the database
    await sparePartModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Spare part removed" });
  } catch (error) {
    console.error("Error removing spare part:", error);
    res.status(500).json({ success: false, message: "Error removing spare part" });
  }
};

// Update Spare Part
const updateSparePart = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the spare part by ID
    const sparePart = await sparePartModel.findById(id);
    if (!sparePart) {
      return res.status(404).json({ success: false, message: "Spare part not found" });
    }

    // Handle image replacement
    if (req.file) {
      // Remove the old image
      const oldImagePath = path.join("uploads", sparePart.image);
      try {
        await removeFile(oldImagePath);
      } catch (err) {
        console.error(`Error removing file: ${oldImagePath}`, err);
      }

      // Update with new image filename
      sparePart.image = req.file.filename;
    }

    // Update other fields
    const updates = req.body;
    Object.keys(updates).forEach((key) => {
      sparePart[key] = updates[key];
    });

    const updatedSparePart = await sparePart.save();
    res.status(200).json({ success: true, data: updatedSparePart });
  } catch (error) {
    console.error("Error updating spare part:", error);
    res.status(500).json({ success: false, message: "Error updating spare part" });
  }
};

// Get Spare Part Details
const getSparePartDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find spare part by ID
    const sparePart = await sparePartModel.findById(id);
    if (!sparePart) {
      return res.status(404).json({ success: false, message: "Spare part not found" });
    }

    res.status(200).json({ success: true, data: sparePart });
  } catch (error) {
    console.error("Error fetching spare part details:", error);
    res.status(500).json({ success: false, message: "Error fetching spare part details" });
  }
};

// Exporting the functions
module.exports = {
  addSparePart,
  listSpareParts,
  removeSparePart,
  updateSparePart,
  getSparePartDetails
};
