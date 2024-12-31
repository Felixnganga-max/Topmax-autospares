const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  role: { 
    type: String, 
    enum: ['user', 'admin'], // You can add different roles here
    default: 'user' // Default role if not specified
  }
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

module.exports = userModel;
