const mongoose=require('mongoose');

const cartSchema=new mongoose.Schema({
user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
items:[{
    productId:{type:mongoose.Schema.Types.ObjectId,ref:"Pizza"},
    name:String,
    size:{type:String, enum:['small','large']},
    quantity:{type:Number,default:1},
    price:Number,
    _id:false
}],
totalPrice:{type:Number,default:0}

});

const Cart=mongoose.model('Cart',cartSchema);

module.exports=Cart;