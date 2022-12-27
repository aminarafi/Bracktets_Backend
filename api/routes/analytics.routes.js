const express = require("express");

const router = express.Router();

const checkAuth = require("../middleware/checkAuth");

const { authorizeTo } = require("../middleware/authorization");

const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

const AnalyticsController = require("../controller/analytics.controller");

router.get(
  "/per-day",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.ADMIN, SYSTEM_ROLES_ENUM.MANAGER),
  AnalyticsController.perDayAnalytics
);
router.get(
  "/total-categorized",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.USER, SYSTEM_ROLES_ENUM.MANAGER),
  AnalyticsController.totalCategorizedAnalytics
);

module.exports = router;
