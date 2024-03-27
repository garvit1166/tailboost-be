const express=require('express');
const {addOrder,getData,lineChart,stateWise} =require("../controllers/orderController")
const orderRouter=express.Router();

orderRouter.post("/addOrder",addOrder);
orderRouter.get("/",getData);
orderRouter.get("/line",lineChart);
orderRouter.get("/stateWise",stateWise);


module.exports=orderRouter;