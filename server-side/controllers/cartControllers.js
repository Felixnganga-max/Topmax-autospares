const UserModel = require("../models/userModel");

const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user?.userId; // Extract from middleware

    

    // Ensure itemId is provided
    if (!itemId || !userId) {
      return res.json({
        success: false,
        message: "User ID and Item ID are required",
      });
    }

    // Find the user and update the cart data
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $inc: { [`cartData.${itemId}`]: 1 }, // Increment quantity
      },
      { new: true, upsert: true }
    );

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "Added to cart",
      cartData: updatedUser.cartData,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.json({
      success: false,
      message: `Error while adding to cart: ${error.message}`,
    });
  }
};

// Remove item from the cart
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    const userId = req.user?.userId; // Extract from middleware


    // Ensure userId and itemId are provided
    if (!userId || !itemId) {
      return res.json({
        success: false,
        message: "User ID and Item ID are required"
      });
    }

    // Find the user and update the cart data
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        $inc: { [`cartData.${itemId}`]: -1 } // Decrement quantity
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    // If the item quantity is now 0, remove it from the cart
    if (updatedUser.cartData[itemId] <= 0) {
      updatedUser.cartData[itemId] = undefined; // Remove the item
      await updatedUser.save();
    }

    res.json({
      success: true,
      message: "Item removed from cart",
      cartData: updatedUser.cartData
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.json({
      success: false,
      message: `Error removing item from cart: ${error.message}`
    });
  }
};

// Get the user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user?.userId; // Extract from middleware

    // Ensure userId is provided
    if (!userId) {
      return res.json({
        success: false,
        message: "User ID is required"
      });
    }

    // Find the user and fetch the cart data
    const userData = await UserModel.findOne({ _id: userId });

    if (!userData) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    const cartData = userData.cartData || {}; // Return empty object if no cart data
    res.json({
      success: true,
      cartData: cartData
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.json({
      success: false,
      message: `Error fetching cart: ${error.message}`
    });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart
};


