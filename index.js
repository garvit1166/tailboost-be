const express=require('express');
const mongoose=require('mongoose');

const userRouter=require("./routes/userRoutes");
const productRouter=require("./routes/productRoutes");


const app=express();
const port= 3001;
var cors = require('cors');

app.use(cors());
app.use(express.json());

app.use("/", userRouter);
app.use("/product", productRouter);

app.get('/',(req,res)=>{
    res.send("hello");
});

mongoose.connect("mongodb+srv://garvitchutani11062001:r1WSr2pbq9j8Ljwg@cluster0.korxp4a.mongodb.net/")
.then(()=>{
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });
})
.catch((error)=>{
    console.log(error);
})


