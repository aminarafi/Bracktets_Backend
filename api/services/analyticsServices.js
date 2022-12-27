const mongoose = require("mongoose");

const Order = require("../models/order.model");

const getTotalEarningsPerDay = async () => {
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
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalAmount: {
            $sum: {
              $multiply: ["$products.quantity", "$productDetail.price"],
            },
          },
        },
      },
    ];

    const results = await Order.aggregate(pipeline);
    return results;
  } catch (error) {
    throw error;
  }
};

const totalCategorizedAnalytics = async (userId) => {
  try {
    const aggregationPipeline = [
      {
        $unwind: {
          path: "$products",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetail",
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
          _id: "$productDetail.category",
          TotalAmount: {
            $sum: {
              $multiply: ["$products.quantity", "$productDetail.price"],
            },
          },
          Total_Products: {
            $sum: "$products.quantity",
          },
        },
      },
    ];

    const results = await Order.aggregate(aggregationPipeline);

    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = { getTotalEarningsPerDay, totalCategorizedAnalytics };
