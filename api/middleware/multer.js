const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = file.mimetype.split("/")[1];

    const fileName = file.fieldname + "-" + uniqueSuffix + "." + ext;

    req.fileName = fileName;

    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  const fileType = file.originalname.split(".")[1];
  if (fileType === "jpg" || fileType === "png" || fileType === "jpeg") {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg format allowed!!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1 * 1000 * 1000 },
});

module.exports = upload;
