const express = require("express");
const {
  addOrder,
  getData,
  lineChart,
  categoryWise,
  yearWise,
} = require("../controllers/orderController");
const orderRouter = express.Router();

orderRouter.post("/addOrder", addOrder);
orderRouter.get("/", getData);
orderRouter.get("/line", lineChart);
orderRouter.get("/categoryWise", categoryWise);
orderRouter.get("/yearWise", yearWise);

module.exports = orderRouter;
