const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body; // Added role here

    // Check if the user already exists (by email or username)
    const checkUserExistence = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (checkUserExistence) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(14);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // Default to "user" role if no role is provided
    });

    if (newUser) {
      return res.status(201).json({
        message: "User created successfully",
        data: newUser,
        success: true,
      });
    }
  } catch (error) {
    // Log error and return a generic error message
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the system
    const user = await User.findOne({ email });

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found",
        redirectUrl: null 
      });
    }

    // Password matching
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid password",
        redirectUrl: null 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
        userRole: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Determine redirect URL based on user role
    const redirectUrl = user.role === 'admin' ? 'http://localhost:5173/admin' : 'http://localhost:5173/dashboard';
    
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: token,
      redirectUrl: redirectUrl,
      isAdmin: user.role === 'admin'
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in user",
      error: error.message,
      redirectUrl: null
    });
  }
};

// Frontend handling (React example)
const handleLogin = async (loginData) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (data.success) {
      // Store the token
      localStorage.setItem('token', data.token);
      
      // Redirect based on role
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } else {
      // Handle login error
      console.error(data.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};
