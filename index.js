const express=require('express');
const mongoose=require('mongoose');
const bodyParser = require("body-parser")



const userRouter=require("./routes/userRoutes");
const productRouter=require("./routes/productRoutes");
const orderRouter=require("./routes/orderRoutes");


const app=express();
const port= 3001;
var cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

app.use("/", userRouter);
app.use("/product", productRouter);
app.use("/order",orderRouter);

app.get('/',(req,res)=>{
    res.send("hello");
});

mongoose.connect("mongodb+srv://garvitchutani11062001:disha123@cluster0.korxp4a.mongodb.net/")
.then(()=>{
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });
})
.catch((error)=>{
    console.log(error);
})


