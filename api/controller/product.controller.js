const catchAsyncErrors = require("../middleware/asyncErrorCatch");
const productService = require("../services/productServices");

const createProduct = catchAsyncErrors(async (req, res) => {
  const product = req.body;
  const newProduct = await productService.createProduct(product);
  res.status(201).json({
    message: "SUCCESS: Product Added",
    newProduct,
  });
});

const updateProduct = catchAsyncErrors(async (req, res) => {
  const { productId } = req.params;

  const updatedProduct = await productService.updateProduct({
    productId,
    dataToUpdate: req.body,
  });
  res.status(200).json({
    updatedProduct,
  });
});
const findSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const product = await productService.getProductById({ productId });
  res.status(200).json({
    message: "SUCCESS",
    product,
  });
});
const findAllProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await productService.getAllProducts();
  res.status(200).json({
    message: "SUCCESS",
    products,
  });
});
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const { productId } = req.params;
  const deletedProduct = await productService.deleteProduct({ productId });

  res.status(200).json({
    message: `SUCCESS: Product deleted ${deletedProduct}`,
  });
});
const uploadProductImage = catchAsyncErrors(async (req, res) => {
  const { fileName } = req;

  const { productId } = req.params;

  const dataToUpdate = {
    productImage: `uploads/${fileName}`,
  };

  const updatedProduct = await productService.updateProduct({
    productId,
    dataToUpdate,
  });

  res.status(200).json({
    message: "SUCCESS: Product image uploaded",
    updatedProduct,
  });
});

const updateManyProduct = catchAsyncErrors(async (req, res, next) => {
  const products = req.body;
  const product = await productService.changeMany(products);
  res.matchedCount; // Number of documents matched
  res.modifiedCount; // Number of documents modified
  res.acknowledged; // Boolean indicating everything went smoothly.
  res.upsertedId; // null or an id containing a document that had to be upserted.
  res.upsertedCount; // Number indicating how many documents had to be upserted. Will either be 0 or 1.
  return res.status(201).json({
    product,
  });
});
const deleteManyProduct = catchAsyncErrors(async (req, res, next) => {
  const products = req.body;
  const product = await productService.delMany(products);
  return res.status(201).json({
    product,
  });
});
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  findSingleProduct,
  uploadProductImage,
  findAllProducts,
  updateManyProduct,
  deleteManyProduct,
};
