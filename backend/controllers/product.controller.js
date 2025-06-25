const Product = require("../models/Product");

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort();

    const productsWithImageUrl = products.map((product) => ({
      ...product.toObject(),
      image_url:
        product.images && product.images.length > 0
          ? product.images[0].url
          : null,
    }));

    res.status(200).json({
      success: true,
      count: products.length,
      data: productsWithImageUrl,
    });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const productWithImageUrl = {
      ...product.toObject(),
      image_url:
        product.images && product.images.length > 0
          ? product.images[0].url
          : null,
    };

    res.status(200).json({ success: true, data: productWithImageUrl });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, brand, stock, images } = req.body;
    const userId = req.userId; // from authMiddleware

    if (!name || !description || price == null) {
      return res.status(400).json({
        success: false,
        message: "Name, description, and price are required.",
      });
    }

    let parsedImages = images;
    if (typeof images === "string") {
      try {
        parsedImages = JSON.parse(images);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Images must be a valid JSON array of objects.",
        });
      }
    }

    if (parsedImages && !Array.isArray(parsedImages)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array",
      });
    }

    const product = new Product({
      name,
      description,
      price,
      brand,
      stock,
      images: parsedImages,
      user: userId,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      data: {
        ...savedProduct.toObject(),
        image_url: savedProduct.images?.[0]?.url || null,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.user && product.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      data: {
        ...updatedProduct.toObject(),
        image_url: updatedProduct.images?.[0]?.url || null,
      },
    });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.user && product.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
