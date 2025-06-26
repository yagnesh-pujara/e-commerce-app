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

const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Get cart error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => !item.product.equals(productId));

    if (cart.items.length === initialLength) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    await cart.save();

    res.status(200).json({ success: true, message: "Product removed", cart });
  } catch (error) {
    console.error("Remove from cart error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const item = cart.items.find(item => item.product.equals(productId));

    if (!item) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    item.quantity = qty;

    await cart.save();

    res.status(200).json({ success: true, message: "Quantity updated", cart });
  } catch (error) {
    console.error("Update quantity error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
};
