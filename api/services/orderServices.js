const Order = require("../models/order.model");
const { ORDER_STATUS } = require("../../config/constants");

const createOrder = async (order, totalAmount) => {
  try {
    const newOrder = new Order(order, totalAmount);
    return await newOrder.save();
  } catch (error) {
    throw error;
  }
};
const setTotalAmount = async () => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $unwind: {
          path: "$products",
        },
      },
      {
        $set: {
          productDetail: {
            $first: "$productDetail",
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          totalAmount: {
            $sum: {
              $multiply: ["$products.quantity", "$productDetail.price"],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          order_id: "$_id",
          totalAmount: 1,
        },
      },
    ];

    const results = await Order.aggregate(pipeline);
    return results;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async ({ orderId }) => {
  try {
    const order = await Order.findById(orderId).lean();
    return order;
  } catch (error) {
    throw error;
  }
};
const getAllOrders = async () => {
  try {
    const orders = await Order.find().lean({});
    return orders;
  } catch (error) {
    throw error;
  }
};
const updateOrder = async ({ orderId, dataToUpdate }) => {
  try {
    console.log(orderId);
    const orderUpdated = await Order.findByIdAndUpdate(orderId, dataToUpdate, {
      new: true,
      runValidators: true,
    }).lean({});
    return orderUpdated;
  } catch (error) {
    throw error;
  }
};
const deleteOrder = async ({ orderId }) => {
  try {
    const orderdeleted = await Order.findByIdAndDelete(orderId);
    return orderdeleted;
  } catch (error) {
    throw error;
  }
};

const getAllPendingOrders = async () => {
  try {
    const pendingOrders = await Order.find({
      status: { $ne: ORDER_STATUS.COMPLETE },
    }).lean({});
    //.populate('userId')
    return pendingOrders;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  setTotalAmount,
  updateOrder,
  deleteOrder,
  getAllPendingOrders,
};
