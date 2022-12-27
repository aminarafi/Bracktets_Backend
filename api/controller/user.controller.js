const userServices = require("../services/userServices");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { randomBytes: randomBytesCb } = require("crypto");
const { promisify } = require("util");
const { v4: uuidv4 } = require("uuid");
const { ErrorHandler } = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/asyncErrorCatch");
const randomBytes = promisify(randomBytesCb);
const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_ACCOUNT_AUTH_TOKEN
);

const signup = catchAsyncErrors(async (req, res, next) => {
  const user = req.body;

  const userExits = await userServices.getUserExistance({
    email: user.email,
    userName: user.userName,
  });
  if (userExits) {
    return next(
      new ErrorHandler("User already exits with email or userName.", 409)
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  user["password"] = hashedPassword;
  const createdUser = await userServices.createUser(user);
  console.log("USER CREATED", createdUser);
  res.status(200).json({
    message: "User created Successfully.",
    createdUser,
  });
});

const login = catchAsyncErrors(async (req, res, next) => {
  const { userName, password, email } = req.body;

  const user = await userServices.getUserExistance({ email, userName });

  if (!user) {
    return next(new ErrorHandler("Incorrect email, userName.", 401));
  }

  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    return next(new ErrorHandler("Incorrect Password.", 401));
  }
  console.log({ contactNumber: user.contactNumber });

  const buff = await randomBytes(5);

  const OTP = buff.toString("hex");

  console.log(`${buff.length} bytes of random data: ${OTP}`);

  // const sentSMS = await client.messages.create({
  //   body: OTP,
  //   messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
  //   to: user.contactNumber,
  // });

  const updatesUser = await userServices.updateUser({
    userId: user._id,
    dataToUpdate: { OTP },
  });

  res.status(200).json({
    message: "Please Enter the OTP",
    updatesUser,
  });
});

const updateUser = catchAsyncErrors(async (req, res) => {
  const { userId } = req.params;
  const dataToUpdate = req.body;
  const updatedUser = await userServices.updateUser({ userId, dataToUpdate });

  res.status(200).json({
    message: "SUCCESS: user updated.",
    updatedUser,
  });
});

const logout = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  user.uniqueKey;

  const uniqueKeys = [];
  await userServices.updateUser({
    userId: user._id,
    dataToUpdate: { uniqueKeys },
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

const verifyOTP = catchAsyncErrors(async (req, res) => {
  const { OTP } = req.body;

  const { userId } = req.params;

  const user = await userServices.verifyOTP({ OTP, userId });

  if (!user) {
    return next(new ErrorHandler("Verification failed!", 401));
  }

  const uniqueKey = uuidv4();

  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    userName: user.userName,
    uniqueKey,
  };

  const token = JWT.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  await userServices.updateUser({
    userId: user._id,
    dataToUpdate: { $addToSet: { uniqueKeys: uniqueKey }, OTP: "" },
  });

  res.status(200).json({
    message: "SUCCESS: logged in.",
    token,
  });
});

const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.params;
  const deletedUser = await userServices.deleteUser({ userId });

  res.status(200).json({
    message: `SUCCESS: user deleted`,
  });
});

module.exports = { signup, login, updateUser, verifyOTP, logout, deleteUser };
