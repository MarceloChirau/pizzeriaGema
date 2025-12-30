const mongoose=require('mongoose');

const pizzaSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A pizza must have a name'],
        trim:true,
        unique:[true,'There is already a pizza with this name']
    },
    ingredients:{
        type:Array,
        required:[true,'A pizza must have ingredients']
    },
    prices:{

       large:{type:Number,
        required:[true,'A large pizza must have price']

       } ,
       small:{type:Number,
        required:[true,'A small pizza must have price']

       } 
    },
    active:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    image:{
        type:String,
        required:[true,"A pizza should have a picture"]
    }

});

const Pizza=mongoose.model('Pizza',pizzaSchema);
module.exports=Pizza;