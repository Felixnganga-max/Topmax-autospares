const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  priceHistory: [{ price: Number, date: Date }],
  image: { type: String },
  category: { type: String, required: true },
  brand: { type: String },
  stock: { type: Number, required: true }, // Ensure this field tracks stock properly
  warranty: { type: String },
  ratings: [{ user: String, rating: Number, review: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

// Update stock quantity when a sale is made
sparePartSchema.methods.updateStock = function (quantitySold) {
  if (this.stock >= quantitySold) {
    this.stock -= quantitySold;
    return this.save();
  } else {
    return Promise.reject("Not enough stock to complete the sale.");
  }
};

module.exports = mongoose.models.SparePart || mongoose.model('SparePart', sparePartSchema);
