const mongoose = require('mongoose');

// WalkInSale Schema to track sales details

const walkInSaleSchema = new mongoose.Schema({
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SparePart', // Reference to the SparePart model
          required: true
        },
        name: {
          type: String,
        //   required: true
        },
        price: {
          type: Number,
        //   required: true
        },
        quantity: {
          type: Number,
        //   required: true
        }
      }
    ],
    totalAmount: {
      type: Number,
    //   required: true
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'mpesa', 'card'],
    //   required: true
    },
    customerName: {
      type: String,
    //   required: true
    },
    customerPhone: {
      type: String,
    //   required: true
    },
    saleDate: {
      type: Date,
      default: Date.now
    }
  });
  

module.exports = mongoose.model('WalkInSale', walkInSaleSchema);
