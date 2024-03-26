const mongoose=require('mongoose');

const productDetailSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    price: {
        required: true,
        type: Number
    },
    product_id:{
        required:true,
        type:String
    },
    category:{
        required:true,
        type:String
    },
    sub_category:{
        required:true,
        type:String
    },
    cost_price:{
        required:true,
        type:Number
    }
})

module.exports = mongoose.model('product', productDetailSchema)