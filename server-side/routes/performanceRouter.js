const express = require('express');
const performanceRouter = express.Router();
const getWalkInSales = require('../controllers/performanceControllers'); // assuming this is a function that returns a promise

performanceRouter.get('/product-data', getWalkInSales); // assuming this is the route you want to add the middleware to

module.exports = performanceRouter;
