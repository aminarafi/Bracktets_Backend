const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const { authorizeTo } = require("../middleware/authorization");
const checkAuth = require("../middleware/checkAuth");
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

router.post(
  "/create",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.ADMIN),
  userController.signup
);
router.post("/login", userController.login);

router.patch(
  "/update/:userId",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.ADMIN),
  userController.updateUser
);

router.get("/logout", checkAuth, userController.logout);
router.post("/verify-OTP/:userId", userController.verifyOTP);
router.delete(
  "/delete/:userId",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.ADMIN),
  userController.deleteUser
);

module.exports = router;
