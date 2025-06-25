const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // category: {
    //   type: String,
    //   required: true,
    //   index: true,
    // },
    brand: {
      type: String,
      default: "Generic",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [
      {
        url: String,
        alt: String,
      },
    ],
    // rating: {
    //   type: Number,
    //   default: 0,
    //   min: 0,
    //   max: 5,
    // },
    // reviews: [
    //   {
    //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     comment: String,
    //     rating: Number,
    //     createdAt: { type: Date, default: Date.now },
    //   },
    // ],
    // isFeatured: {
    //   type: Boolean,
    //   default: false,
    // },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
