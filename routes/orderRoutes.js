const express = require("express");
const {
  addOrder,
  getData,
  categoryWise,
  yearWise,
} = require("../controllers/orderController");
const orderRouter = express.Router();

orderRouter.post("/", addOrder);
orderRouter.get("/", getData);
orderRouter.get("/categoryWise", categoryWise);
orderRouter.get("/yearWise", yearWise);

module.exports = orderRouter;
