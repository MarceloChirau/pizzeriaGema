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

//for frontend:
router.get('/getMe', protect, (req, res,next) => {
if(!req.user) return next(new Error('User not found',404))

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