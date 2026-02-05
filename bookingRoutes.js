const express=require('express');
const router=express.Router();
const {signUp,logIn,protect,addToCart,showUserCart,reduceQuantity,removeProduct}=require('./userController');
const{getCheckoutSession}=require('./bookingController.js')



router.get('/checkout-session',protect,getCheckoutSession)














module.exports=router;