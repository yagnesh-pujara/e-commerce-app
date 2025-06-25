const express = require("express");
const router = express.Router();

const userRoutes = require("./user.route.js");
const productRoutes = require("./product.route.js");
const cartRoutes = require("./cart.route.js");

//?     USER ROUTES
router.use("/user", userRoutes);

//?     PRODUCT ROUTES
router.use("/products", productRoutes);

//?     CART ROUTES
router.use("/cart", cartRoutes);

module.exports = router;
