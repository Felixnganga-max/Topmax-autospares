const {placeOrder, verifyOrder, userOrders, listOrders, updateOrderStatus}  = require('../controllers/orderControllers');
const express = require('express');
const authMiddle = require('../middleware/auth');
const orderRouter = express.Router();

// Route for placing an order (requires authentication)
orderRouter.post("/place", authMiddle, placeOrder);
orderRouter.post("/verify", verifyOrder)
orderRouter.post("/user-orders", authMiddle, userOrders);
orderRouter.get("/list", listOrders)
orderRouter.post("/status", updateOrderStatus)

module.exports = orderRouter;
