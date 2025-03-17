const mongoose=require('mongoose');

const order = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    books:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"books",
            required:true
        }
    ],
    status:{
        type:String,
        default:"Order Placed",
        enum:["Order Placed","Out for delivery","Delivered","cancelled"]
    },
    
},
{timestamps:true}
);
module.exports = mongoose.model("order", order);