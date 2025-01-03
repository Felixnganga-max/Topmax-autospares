const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const Stripe = require("stripe");
const sparePartModel = require("../models/spareModel.js");


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing User Order
const placeOrder = async (req, res) => {
  const frontend_url = "https://www.topmazautospares.com/";

  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    // Check stock availability for each item
    for (const item of items) {
      const sparePart = await sparePartModel.findById(item._id);

      if (!sparePart) {
        return res.status(404).json({
          success: false,
          message: `Spare part with ID ${item._id} not found`,
        });
      }

      if (sparePart.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for spare part: ${sparePart.name}`,
        });
      }
    }

    // Deduct stock for each item
    for (const item of items) {
      await sparePartModel.findByIdAndUpdate(item._id, {
        $inc: { stock: -item.quantity }, // Decrease stock
      });
    }

    // Create new order
    const newOrder = new orderModel({
      userId: userId,
      items,
      amount,
      address,
    });

    await newOrder.save();

    // Clear user's cart after order placement
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add delivery fee
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Fee",
        },
        unit_amount: 100, // $1 in cents
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing order",
      error: error.message,
    });
  }
};


const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  console.log("Received verification request:", {
    orderId,
    success,
    successType: typeof success,
  });

  try {
    if (success === "true") {
      // Compare as string
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true } // Return updated document
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: true,
        message: "Order paid successfully",
        order: updatedOrder,
      });
    } else {
      const deletedOrder = await orderModel.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.json({
        success: false,
        message: "Order cancelled and therefore, not paid",
      });
    }
  } catch (error) {
    console.error("Order verification error:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying order",
      error: error.message,
    });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.user?.userId; // Extract from middleware

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const orders = await orderModel.find({ userId });
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

const listOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = -1; // Default to descending (newest first)

    const skip = (page - 1) * limit;

    const orders = await orderModel.find({})
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    const totalOrders = await orderModel.countDocuments({});
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Order listing error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};

//api for updating order status
const updateOrderStatus = async (req, res) => {
try {
  await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status})
  res.json({
    success: true,
    message: "Order status updated successfully"
    });
} catch (error) {
  console.error('Order status update error:', error);
  res.status(500).json({
    success: false,
    message: "Error updating order status",
    error: error.message
    });
}
}

module.exports = { placeOrder, verifyOrder, userOrders, listOrders, updateOrderStatus };
