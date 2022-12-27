const AnalyticsService = require("../services/analyticsServices");
const catchAsyncErrors = require("../middleware/asyncErrorCatch");
const { ErrorHandler } = require("../utils/errorhandler");

const perDayAnalytics = catchAsyncErrors(async (req, res) => {
  const results = await AnalyticsService.getTotalEarningsPerDay();

  res.status(200).json({
    message: "SUCCESS: analytics generated.",
    results,
  });
});

const totalCategorizedAnalytics = catchAsyncErrors(async (req, res) => {
  const results = await AnalyticsService.totalCategorizedAnalytics();

  res.status(200).json({
    message: "SUCCESS: analytics generated.",
    results,
  });
});

module.exports = { perDayAnalytics, totalCategorizedAnalytics };
