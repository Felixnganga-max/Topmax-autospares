const express = require('express'); 
const adminRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

adminRouter.get('/admin', authMiddleware, (req, res) => {
  const { email } = req.user; 

  console.log(req.user);

  res.send(`Welcome, Admin: ${userEmail}`); 
});

module.exports = adminRouter;