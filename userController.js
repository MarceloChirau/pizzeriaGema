const User=require('./userModel.js');
const Cart=require('./cartModel.js');
const {Pizza}=require('./models.js');
const jwt=require('jsonwebtoken');
const { promisify } = require('util');

const signToken=(userId)=>{
   return jwt.sign({id:userId},process.env.SECRET_FOR_USER,{expiresIn:process.env.EXPIRES_FOR_USER})
}

exports.signUp=async (req,res,next)=>{
    try{
        const user=await User.create(req.body);

        if(!user)return next(new Error('You missed some info'));
        const token=signToken(user._id);
res.cookie('user',token,{
    httpOnly:true,
    secure:process.env.NODE_ENV==='production',
    sameSite: 'Lax',
    maxAge:60*60*1000
})

        user.password=undefined;
        res.status(201).json({
            status:'success',
            data:user
        })

    }
    catch(err){
        next(err)
    }
}
exports.logIn=async(req,res,next)=>{
    try{

        const {name,password}=req.body;
        console.log('name and password Received:',name,password);

        const user=await User.findOne({name}).select('+password');

        if(!user)return next(new Error("Couldn't find the user"));
        console.log('user is found:',user);
        const isCorrect= await user.comparePassword(password,user.password);
        if(!isCorrect)return next(new Error('Name or password is wrong'));
        const token=signToken(user._id);
        res.cookie('user',token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:'Lax',
            maxAge:60*60*1000
        })

        res.status(200).json({
            status:'success',
            data:user
        })
    }
    catch(err){
        next(err)
    }
}
exports.protect=async(req,res,next)=>{
    try{
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.user) {
            token = req.cookies.user;
        }
        if (!token) {
            return next(new Error('You are not logged in! Please log in to get access.', 401));
        }

        //  token=req.cookies.user;
        const decoded=await promisify(jwt.verify)(token,process.env.SECRET_FOR_USER);
        if(!decoded)return next(new Error('You are not authorized'));

        // 3) Check if user still exists (in case they were updatedCart but still have a token)
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new Error('The user belonging to this token no longer exists.'));
        }
req.user=currentUser;
next();
    }
    catch(err){
        next(err)
    }
}

///////////////////////////////////////////////

exports.addToCart=async(req,res,next)=>{
try{
    //these i get from frontend
const{productId,size}=req.body;
const userId=req.user.id;

//find the pizza in database according to id from frontend so to get the real price
const pizza=await Pizza.findById(productId);
if(!pizza)return next(new Error('Pizza not found'));

const price=pizza.prices[size==='large' ? 'large' : 'small'];//we get the size from frontEnd but prices from backend

//find user's cart or create a new one:
let cart=await Cart.findOne({user:userId})  ;
if(!cart){
    cart=await Cart.create({user:userId,items:[]})//items will be provided accordingly if cart already exist, update quantity otherwise create a new one
}  

const existingItemIndex=cart.items.findIndex(item=>  item.name===pizza.name && item.size===size)//i changed that to be based on the name of the pizza,, if it exists to increase quantity or to create a new one,,it ruturn if found index

if(existingItemIndex>-1){// -1 means nothing if return by findIndex method
    //already exist,just increment quantity
    cart.items[existingItemIndex].quantity+=1;
}else{
    //new item,add it
    cart.items.push({//  i guess this i a mongoose method
        productId,
        name:pizza.name,
        size,
        price,
        quantity:1
    })
}
// Recalculate total price of the whole cart
cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

await cart.save();
res.status(200).json({
    status:'success',
    data:cart
})
}
catch(err){
    next(err)
}
}
exports.showUserCart=async(req,res,next)=>{
    try{
        const userId=req.user.id;
        console.log(userId);
const cart=await Cart.findOne({user:userId});
if(!cart) return next(new Error('You didnt add anything to cart'));

res.status(200).json({
    status:'success',
    result:cart.items.length,
    data:cart
})

    }
    catch(err){
        next(err)
    }
}
exports.reduceQuantity=async(req,res,next)=>{
    try{
const{productId,size}=req.body;
const userId=req.user.id;
const cart=await Cart.findOne({user:userId})
if(!cart)return next(new Error("Could't find the customer"));

const items=cart.items;
                                       //to string because the productId we received might be an object
const index=items.findIndex(item=>item.productId.toString()=== productId && item.size===size);

if(index>-1){
    if(items[index].quantity>1){
        items[index].quantity -=1;
    }else{
        items.splice(index,1);
    }
}

cart.totalPrice=items.reduce((acc,item)=>acc+(item.price*item.quantity),0);


 await cart.save();


return res.status(200).json({
    status:'success',
    message:'update is succesful',
    result:cart.items.length,
    data:cart
})



    }
    catch(err){
        next(err)
    }
}
exports.removeProduct=async(req,res,next)=>{
    try{
const {productId}=req.body;
const userId=req.user.id;
const originalCart=await Cart.findOne({user:userId});
const originalLength=originalCart.items.length;

const updatedCart=await Cart.findOneAndUpdate({user:userId},
    {$pull:{items:{productId:productId}}},{new:true}
)
if(originalLength===updatedCart.items.length)return next(new Error('Couldt find product to delete'))

updatedCart.totalPrice=updatedCart.items.reduce((acc,item)=>acc+(item.price*item.quantity),0)
 await updatedCart.save();
res.status(200).json({status:'success',data:updatedCart})
    }
    catch(err){
        next(err)
    }
}

//we might use this a bit later
exports.findAllProductsInCartAndDelete=async (req,res,next)=>{
    try{
const userId=req.user.id;
const deletedAll=await Cart.findOneAndDelete({user:userId})
if(!deletedAll)return next(new Error('There is nothing to delete'))
 res.status(200).json({
status:'success',
data:null})


    }
    catch(err){
        next(err)
    }
}