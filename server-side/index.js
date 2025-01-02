const express = require("express");
const path = require("path"); // Add this import
const PORT = process.env.PORT || 4004;
const { connectDB } = require("./config/db");
require("dotenv").config();
const cors = require("cors");

const app = express();

// Import Spare Parts Router
const sparesRouter = require("./routes/sparesRoute.js");
const userRouter = require("./routes/userRoutes.js");
const cartRouter = require("./routes/cartRouter.js");
const orderRouter = require("./routes/orderRouter.js");
const adminRouter = require("./routes/adminRouter.js");
const router = require("./routes/WalkInSalesRouter.js");
const performanceRouter = require("./routes/performanceRouter.js");

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*', // Replace with the actual frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Optional: specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Optional: specify allowed headers
}));


// Connect to the database
connectDB();

// Route to test the app
app.get("/", (req, res) => res.send("Express on Vercel"));


// Register Spare Parts Routes
app.use("/api/spares", sparesRouter);
app.use("/api/users", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/images", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", adminRouter);
app.use("/api/walkinsales", router);
app.use("/api/performance", performanceRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
