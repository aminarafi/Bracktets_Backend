const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("***Database Connected***");
    })
    .catch((err) => console.log(err));
};
module.exports = { connectDB };
