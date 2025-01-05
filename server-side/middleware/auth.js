const jwt = require("jsonwebtoken");

const authMiddle = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("Decoded token:", decoded); // Debugging

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token: Missing userId",
      });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.userEmail,
      role: decoded.userRole,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.error("Token expired:", error);
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    console.error("Error verifying token:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please login again.",
    });
  }
};

module.exports = authMiddle;
