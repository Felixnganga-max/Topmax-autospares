const express = require('express');
const router = express.Router();
const WalkInSale = require('../models/WalksInModel');
const SparePart = require('../models/spareModel');

// POST route to create a new walk-in sale
router.post('/create', async (req, res) => {
  const { cart, paymentMethod, customerName, customerPhone } = req.body;

  if (!paymentMethod || !customerName || !customerPhone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const productIds = cart.map(item => item._id);
    const productsFromDB = await SparePart.find({ _id: { $in: productIds } });

    const productsMap = new Map(productsFromDB.map(product => [product._id.toString(), product]));
    const products = [];
    let totalAmount = 0;

    for (const item of cart) {
      const product = productsMap.get(item._id.toString());
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${item._id}` });
      }

      // Update stock atomically
      await SparePart.findOneAndUpdate(
        { _id: product._id },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      products.push({
        product: item._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    const newSale = new WalkInSale({
      products,
      totalAmount,
      paymentMethod,
      customerName,
      customerPhone,
    });

    await newSale.save();

    res.status(201).json({
      message: 'Sale successfully recorded!',
      sale: newSale,
    });
  } catch (error) {
    console.error('Error creating sale:', error.stack);
    res.status(500).json({ message: 'Error creating sale', error: error.message });
  }
});

module.exports = router;
