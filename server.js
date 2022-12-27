const express = require("express");
const app = express();
const http = require("http");
const { connectDB } = require("./config/dbConnect");
const cors = require("cors");
const errorMiddleware = require("./api/middleware/error");
require("dotenv").config();
// importing routers
const UserRoutes = require("./api/routes/user.routes");
const ProductRoutes = require("./api/routes/product.routes");
const orderRoutes = require("./api/routes/order.routes");
const AnalyticsRoutes = require("./api/routes/analytics.routes");
connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/users", UserRoutes);
app.use("/product", ProductRoutes);
app.use("/order", orderRoutes);
app.use("/analytics", AnalyticsRoutes);
app.use(errorMiddleware);
const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});
