const express = require("express");
const checkAuth = require("../middleware/checkAuth");
const { authorizeTo } = require("../middleware/authorization");
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");
const router = express.Router();
const orderController = require("../controller/order.controller");

router.post(
  "/createOrder",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.USER),
  orderController.addOrder
);

router.get(
  "/findAll",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.MANAGER, SYSTEM_ROLES_ENUM.ADMIN),
  orderController.findAllOrders
);

router.get(
  "/findASingleOrder/:orderId",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.MANAGER, SYSTEM_ROLES_ENUM.ADMIN),
  orderController.findASingelOrder
);

router.patch(
  "/update/:orderId",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.USER),
  orderController.updateOrder
);

router.delete(
  "/delete/:orderId",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.USER),
  orderController.deleteOrder
);

router.get(
  "/pending",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.USER),
  orderController.pendingOrders
);

module.exports = router;
