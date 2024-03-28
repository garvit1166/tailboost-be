const express = require("express");

const { signin, signup } = require("../controllers/usercontroller");

const userRouter = express.Router();

userRouter.post("/signup", signup);

userRouter.post("/", signin);

module.exports = userRouter;
