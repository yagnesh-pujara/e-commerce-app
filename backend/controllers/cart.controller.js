const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const userId = req.userId; // From authMiddleware

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { addToCart };
