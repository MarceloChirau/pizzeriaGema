const Pizza=require('./models');
const fs=require('fs');
const pizzaData=JSON.parse(fs.readFileSync(`${__dirname}/data.json`,'utf-8'));
const crypto=require('crypto');
const jwt=require('jsonwebtoken');


exports.importAllPizzas=async(req,res,next)=>{

    try{

        await Pizza.deleteMany();
        const pizzas=await Pizza.create(pizzaData);

        res.status(201).json({
            status:'success',
            results:pizzas.length,
            data:{pizzas}
        })
        next();

    }
    catch(err){
        console.log("💥 ERROR:", err);
        res.status(400).json({
            status:'fail',
            message:err.message
        })
    }
}

exports.showAllPizzas=async(req,res)=>{
    try{
const pizzas=await Pizza.find();
if(!pizzas){
    throw new Error('There is no pizzas to show');
}

 res.status(200).json({
     status:'success',
     results:pizzas.length,
     data:{pizzas}
})
    }
    catch(err){
        console.log('there is an error:',err)
        res.status(404).json({
            status:'fail',
            message:err.message
        })
    }
}

exports.bossLogIn= async(req,res,next)=>{
try{
    const {key}=req.params;
    
    
    if(key===process.env.SECRET_KEY_URL){
        console.log('Boss has the key')
        //payload
        const payload={
            role:'admin',
            site:"Pizzeria Gema",
            description:"Owner"
        };
        const token=jwt.sign(payload,process.env.SECRET_JWT,{expiresIn:'7d'});
        res.cookie('admin_token',token,{
            httpOnly:true,
            secure:false,  //process.env.NODE_ENV==='production'
            sameSite:'lax',  //'Strict'
            maxAge:7*24*60*60*1000
        });
        next();
    //    return res.json({message:'Logged in!'})
       return res.redirect('/gema/admin/dashboard');
}
else{
    throw new Error('Not found')
    // res.status(404).json({
    //     status:'fail',
    //     message:"Not found"
    // })
}
}catch(err){
    console.log(err.message)
    res.status(400).json({
        status:'fail',
        message:err.message
    })
}

}

exports.protectAdmin =async (req, res, next) => {
    
    try{
        const token = req.cookies.admin_token;
        // console.log('this is the  admin_token',token)
    if (!token) throw new Error('Token not provided') 
// This line "unlocks" the token and gives you back 
    // the 'bossInfo' object you created earlier
    const decoded =await jwt.verify(token, process.env.SECRET_JWT);
    // console.log('this is the decoded:',decoded);

    

    if (decoded.role === 'admin') {
        // 4. Attach the boss info to the request for later use
        req.admin = decoded;
        next(); // Allow the price change
    }else{
       throw new Error('Forbidden')
    }
}catch(err){
    console.log('this is the last err message',err.message);
    res.clearCookie('admin_token');
    res.status(401).json({status:'fail',message:'Invalid or Expired token'})
}


};



exports.findPizza=async (req,res)=>{
    try{
const pizza=await Pizza.findOne({name:req.query.name})
if(!pizza)throw new Error('There is no pizza with this name')
    res.status(200).json({
status:'success',
data:pizza})
    }
    catch(err){
        console.log('couldnt find the pizza:',err.message)
        res.status(400).json({
            status:'fail',
            message:err
        })
    }
}

exports.updatePizza=async(req,res)=>{
    try{
        // console.log("the req.body:",req.body);
        const{id,name,prices,ingredients}=req.body;
        const updatedPizza=await Pizza.findByIdAndUpdate(id,{name:name,prices:{small:prices.small,large:prices.large},ingredients:ingredients},{new:true,runValidators:true})
        if(!updatedPizza){return res.status(404).json({status:'fail',message:'pizza not found'})}
res.status(200).json({status:'success',data:updatedPizza})
    }
    catch(err){
        console.log('something went wrong with updating the pizza',err.message)
        res.status(400).json({status:'fail',message:err.message})
    }
}


exports.createPizza=async(req,res)=>{
    try{
        const newPizza=await Pizza.create({
            name:req.body.name,
            prices:{
                small:req.body.smallPrice,
                large:req.body.largePrice
            },
            ingredients:req.body.ingredients.split(','),
            image:req.file.filename
        });

        res.status(201).json({status:'success',data:newPizza})

    }
    catch(err){
        console.log('This error comes from uploading new pizza',err.message)
res.status(201).json({status:'fail',message:err.message})
    }
}
exports.deletePizza=async(req,res)=>{
    try{
        
const pizzaToDelete=await Pizza.findByIdAndDelete(req.body._id);
if(pizzaToDelete){
    res.status(200).json({
        status:'success',
        message:'Pizza deleted successfully!'
    })
}else{
    res.status(404).json({status:'fail',message:"Pizza id is not found"})
    // throw new Error('The deleteis unsuccesfull!')
}


    }
    catch(err){
        res.status(500).json({status:'fail',message:err.message})
    }
}