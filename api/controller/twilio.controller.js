const smsStatusCallback = (req, res) => {
  res.status(200).send();

  try {
    console.log("SMS callback", req.body);
  } catch (error) {
    console.log("==> Error in smsStatusCallback", error);
  }
};

module.exports = { smsStatusCallback };
