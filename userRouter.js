const express=require('express');
const router=express.Router();
const {signUp,
    logIn,
    protect,
    addToCart,
    showUserCart,
    reduceQuantity,
    removeProduct,
    findAllProductsInCartAndDelete
}=require('./userController')

router
.route('/signUp')
.post(signUp)

router
.route('/logIn')
.post(logIn)

//for frontend: this is for the checkAuth there i will fetch it
router.get('/getMe', protect, (req, res,next) => {
if(!req.user){
    const err = new Error('User not found');
    err.statusCode = 404;
    err.isOperational = true; // Prevents your Global Error Handler from crashing
    return next(err);

}

    res.status(200).json({
        status: 'success',
        data: { user: req.user }
    });
});

router
.route('/order')
.post(protect,addToCart)
.get(protect,showUserCart)
.patch(protect,reduceQuantity)
.delete(protect,removeProduct)


// router
// .route('/order/deleteAll')
// .delete(protect,findAllProductsInCartAndDelete)










module.exports=router;