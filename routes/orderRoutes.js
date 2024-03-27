const express=require('express');
const {addOrder,getData,lineChart} =require("../controllers/orderController")
const orderRouter=express.Router();

orderRouter.post("/addOrder",addOrder);
orderRouter.get("/",getData);
orderRouter.get("/line",lineChart);


module.exports=orderRouter;