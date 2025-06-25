const express = require("express");
const cartRoutes = express.Router();
const { addToCart } = require("../controllers/cart.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

cartRoutes.post("/add", authMiddleware, addToCart);

module.exports = cartRoutes;
