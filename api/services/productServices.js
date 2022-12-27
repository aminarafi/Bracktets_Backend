const Product = require("../models/product.model");

const createProduct = async (product) => {
  try {
    const newProduct = new Product(product);
    return await newProduct.save();
  } catch (error) {
    throw error;
  }
};
const getProductById = async ({ productId }) => {
  try {
    const product = await Product.findById(productId).lean({});
    return product;
  } catch (error) {
    throw error;
  }
};

const getAllProducts = async () => {
  try {
    const products = await Product.find().lean({});
    return products;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async ({ productId, dataToUpdate }) => {
  try {
    const productUpdated = await Product.findByIdAndUpdate(
      productId,
      dataToUpdate,
      {
        new: true,
        runValidators: true,
      }
    ).lean();
    return productUpdated;
  } catch (error) {
    throw error;
  }
};
const deleteProduct = async ({ productId }) => {
  try {
    const productdeleted = await Product.findByIdAndDelete(productId);
    return productdeleted;
  } catch (error) {
    throw error;
  }
};
const changeMany = async (product) => {
  try {
    const updateManyproducts = await Product.updateMany(
      { category: /^n/ },
      product
    );
    return updateManyproducts;
  } catch (error) {
    throw error;
  }
};

const delMany = async (product) => {
  try {
    const deleteManyOrders = await Product.deleteMany(
      { category: /^r/ },
      product
    );
    return deleteManyOrders;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  updateProduct,
  deleteProduct,
  changeMany,
  delMany,
};
