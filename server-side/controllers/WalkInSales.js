const WalkInSale = require('../models/WalksInModel');
const SparePart = require('../models/spareModel');

// Example: Creating a sale
const handleSale = async (cart, paymentMethod, customerName, customerPhone) => {
  try {
    const products = [];
    let totalAmount = 0;

    // Create products array and calculate total
    for (const item of cart) {
      const product = await SparePart.findById(item._id);
      await product.updateStock(item.quantity); // Update stock
      products.push({
        product: item._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
      totalAmount += product.price * item.quantity;
    }

    // Create a new walk-in sale record
    const newSale = new WalkInSale({
      products,
      totalAmount,
      paymentMethod,
      customerName,
      customerPhone,
    });

    await newSale.save();
    return newSale;
  } catch (error) {
    console.error("Sale Error:", error);
  }
};
