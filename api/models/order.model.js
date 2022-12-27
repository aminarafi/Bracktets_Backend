const mongoose = require("mongoose");
const { ORDER_STATUS, PAYMENT_METHOD } = require("../../config/constants");
const OrderSchema = mongoose.Schema;

const orderSchema = new OrderSchema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: ORDER_STATUS,
    },
    totalAmount: Number,
    phoneNumber: {
      type: Number,
      validate: [/^\d{11}$/, "Enter Phone Number"],
      require: [true, "Please Enter Phone Number"],
    },

    products: [
      {
        productName: String,
        quantity: Number,
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
      },
    ],
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHOD,
      required: true,
    },
    cardNumber: {
      type: String,
      validate: [/^\d{16}$/, "Enter correct CardNumber"],
    },
    expireMonth: {
      type: String,
      min: 1,
      max: 12,
    },
    expireYear: {
      type: Number,
      min: 2021,
    },

    cvc: {
      type: String,
      validate: [/^\d{3}$/, "Enter correct CVC"],
    },

    charges: { type: String },
  },
  {
    strict: true,
    timestamps: true,
    collection: "orders",
  }
);

module.exports = mongoose.model("order", orderSchema);
