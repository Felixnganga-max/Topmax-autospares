const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/cartControllers");
const authMiddle = require('../middleware/auth')

const cartRouter = express.Router();

cartRouter.post("/add", authMiddle, addToCart);
cartRouter.post("/remove", authMiddle, removeFromCart);
cartRouter.post("/get-cart", authMiddle, getCart);

module.exports = cartRouter;
