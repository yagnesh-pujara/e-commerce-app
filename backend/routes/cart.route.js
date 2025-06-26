const express = require("express");
const cartRoutes = express.Router();
const { addToCart, getCart, updateQuantity, removeFromCart } = require("../controllers/cart.controller");
const { authMiddleware } = require("../middleware/authMiddleware");

//?     CREATE CART
cartRoutes.post("/add", authMiddleware, addToCart);

//?     READ CART
cartRoutes.post("/", authMiddleware, getCart);

//?     UPDATE CART
cartRoutes.put("/update", authMiddleware, updateQuantity);

//?     DELETE CART
cartRoutes.delete("/remove", authMiddleware, removeFromCart);

module.exports = cartRoutes;
