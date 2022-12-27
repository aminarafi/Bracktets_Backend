const express = require("express");
const upload = require("../middleware/multer");

const router = express.Router();
const productController = require("../controller/product.controller");
const checkAuth = require("../middleware/checkAuth");
const { authorizeTo } = require("../middleware/authorization");
const { SYSTEM_ROLES_ENUM } = require("../../config/constants");

router.post(
  "/create",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.MANAGER),
  productController.createProduct
);

router.patch(
  "/update/:productId",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.MANAGER),
  productController.updateProduct
);
router.delete(
  "/delete/:productId",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.MANAGER),
  productController.deleteProduct
);
router.patch(
  "/:productId/productImage",
  checkAuth,
  upload.single("image"),
  productController.uploadProductImage
);

router.get("/find/:productId", checkAuth, productController.findSingleProduct);
router.get("/findAll", checkAuth, productController.findAllProducts);
router.patch(
  "/updateMany",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.MANAGER),
  productController.updateManyProduct
);

router.delete(
  "/deleteMany",
  checkAuth,
  authorizeTo(SYSTEM_ROLES_ENUM.MANAGER),
  productController.deleteManyProduct
);
module.exports = router;
