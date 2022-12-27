const express = require("express");
const router = express.Router();

const TwilioController = require("../controller/twilio.controller");

router.post("/sms-status-callback", TwilioController.smsStatusCallback);

module.exports = router;
