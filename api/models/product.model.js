const mongoose = require("mongoose");
const { CATEGORY_NAME_ENUM } = require("../../config/constants");
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      validate: [/^[a-zA-Z]+$/, "Enter String"],
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      validate: [/^[0-9]+$/, "Enter correct Price"],
      maxLength: [8, "Price cannot exceed 8 characters"],
    },
    stock: { type: Number, validate: [/^[0-9]+$/, "Enter correct Quantity"] },
    expirydate: {
      type: Date,
      required: true,
      min: Date.now(),
    },
    productImage: {
      type: String,
    },
    category: {
      type: String,
      enum: CATEGORY_NAME_ENUM,
    },
  },

  {
    strict: true,
    timestamps: true,
    collection: "products",
  }
);
module.exports = mongoose.model("product", productSchema);
