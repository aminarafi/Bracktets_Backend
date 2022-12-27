const JWT = require("jsonwebtoken");
require("dotenv").config;

const UserService = require("../services/userServices");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({
        message: "Invalid Token!",
      });
    }
    token = token.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const userFound = await UserService.getUserById(decoded._id);
    if (!userFound) {
      return res.status(401).json({
        message: "You're unauthorized to do this action",
      });
    }

    // unique key check
    if (!userFound?.uniqueKeys.includes(decoded.uniqueKey)) {
      return res.status(401).json({
        message: "Session ended!",
      });
    }
    req.user = userFound;
    next();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "INTERNAL SERVER ERROR",
    });
  }
};
