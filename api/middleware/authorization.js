const { ErrorHandler } = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/asyncErrorCatch");
const authorizeTo = (...roles) => {
  return catchAsyncErrors(async (req, res, next) => {
    // console.log(" Authorization");
    const user = req.user;
    if (!roles.includes(user?.role)) {
      // console.log(user.role);
      return next(new ErrorHandler("You're un Authorized to do this action.", 401));
    }
    next();
  });
};

module.exports = { authorizeTo };
