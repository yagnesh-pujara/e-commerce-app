const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { authMiddleware } = require("../middleware/authMiddleware");
const productRoutes = express.Router();

//?     GET ALL PRODUCT
productRoutes.get("/", getAllProducts);

//?     GET PRODUCT BY ID
productRoutes.get("/:id", getProductById);

//?     CREATE PRODUCT
productRoutes.post("/create", authMiddleware, createProduct);

//?     UPDATE PRODUCT
productRoutes.put("/update/:id", authMiddleware, updateProduct);

//?     DELETE PRODUCT
productRoutes.delete("/delete/:id", authMiddleware, deleteProduct);

module.exports = productRoutes;
