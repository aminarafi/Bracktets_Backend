const mongoose = require("mongoose");
const validator = require("validator");
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      validate: [/^[a-zA-Z]+ [a-zA-Z]+$/, "Enter String"],
      required: [true, "Please Enter your Name"],
      maxLength: [30, "Name cannot exceed 30 characters"],
      minLength: [3, "Name should have more than 3 characters"],
      trim: true,
    },
    contactNumber: {
      type: Number,
      validate: [/^\d{12}$/, "Enter correct Number"],
      require: [true, "Please Enter Contact Number"],
      validator: [validator.Number],
    },
    userName: {
      type: String,
      validate: [/^[A-Za-z0-9_]{1,15}$/],
      required: [true, "Please Enter your userName"],
      maxLength: [30, "UserName cannot exceed 30 characters"],
      minLength: [3, "UserName should have more than 3 characters"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter Your Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
      minLength: [8, "Password should be greater than 8 characters"],
    },
    role: {
      type: String,
      uppercase: true,
      enum: SYSTEM_ROLES_ENUM,
      default: "USER",
    },
    OTP: {
      type: String,
    },
    uniqueKeys: {
      type: [String],
    },
  },
  {
    timestamps: true,
    strict: true,
    collection: "users",
  }
);
module.exports = mongoose.model("User", userSchema);
