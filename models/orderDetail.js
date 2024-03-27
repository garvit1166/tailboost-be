const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    order_id: {
        required: true,
        type: String
    },
    amount: {
        required: true,
        type: Number
    },
    profit:{
        required:true,
        type:Number
    },
    quantity:{
        required:true,
        type:Number
    },
    category:{
        required:true,
        type:String
    },
    sub_category:{
        required:true,
        type:String
    },
    payment_mode:{
        required:true,
        type:String
    },
    order_date:{
        required:true,
        type:Date
    },
    customer_name:{
        required:true,
        type:String
    },
    state:{
        required:true,
        type:String
    },
    city:{
        required:true,
        type:String
    }
})

module.exports = mongoose.model('orders', orderDetailSchema)
