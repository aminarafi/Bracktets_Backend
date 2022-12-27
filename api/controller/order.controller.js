const catchAsyncErrors = require("../middleware/asyncErrorCatch");
const { ErrorHandler } = require("../utils/errorhandler");
const orderService = require("../services/orderServices");
const { PAYMENT_METHOD } = require("../../config/constants");
const {
  getProductById,
  updateProduct,
} = require("../services/productServices");

const addOrder = catchAsyncErrors(async (req, res, next) => {
  const order = req.body;
  var sum = 0;
  const pro = order.products;

  for (var item of pro) {
    const product = await getProductById({ productId: item.productId });
    if (product.stock < 1 || product.stock < item.quantity) {
      return next(new ErrorHandler("Out of stock", 400));
    }
    sum += item.quantity * product.price;
    product.stock = product.stock - item.quantity;
    await updateProduct({
      productId: product._id,
      dataToUpdate: { stock: product.stock },
    });
  }

  order.totalAmount = sum;

  if (order.paymentMethod == PAYMENT_METHOD.CARD) {
    if (
      !order.cardNumber ||
      !order.expireMonth ||
      !order.expireYear ||
      !order.cvc
    ) {
      return res.status(400).json({
        message: "NOOOOOOOO",
      });
    }

    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

    const customer = await stripe.customers.create({
      description: "My First Test Customer",
    });
    //  '4242424242424242'
    const token = await stripe.tokens.create({
      card: {
        number: order.cardNumber,
        exp_month: order.expireMonth,
        exp_year: order.expireYear,
        cvc: order.cvc,
      },
    });
    const card = await stripe.customers.createSource(customer.id, {
      source: token.id,
    });

    const charge = await stripe.charges.create({
      amount: order.totalAmount,
      currency: "usd",
      customer: customer.id,
      source: card.id,
      description: "My First Test Charge",
    });
    console.log(charge);
    order.charges = charge.id;
  }

  const newOrder = await orderService.createOrder(order);
  return res.status(201).json({
    newOrder,
  });
});
const findAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await orderService.getAllOrders();
  return res.status(201).json({
    orders,
  });
});

const findASingelOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderById({ orderId });
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  return res.status(201).json({
    order,
  });
});

const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const dataToUpdate = req.body;
  const order = await orderService.updateOrder({ orderId, dataToUpdate });
  return res.status(201).json({
    order,
  });
});

const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId } = req.params;
  const order = await orderService.deleteOrder({ orderId });
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  return res.status(201).json({
    order,
  });
});

const pendingOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = req.body;
  const order = await orderService.getAllPendingOrders(orders);
  return res.status(201).json({
    order,
  });
});
module.exports = {
  addOrder,
  findAllOrders,
  findASingelOrder,
  updateOrder,
  deleteOrder,
  pendingOrders,
};
