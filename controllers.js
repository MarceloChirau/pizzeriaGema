const {Pizza,ExtraIngredient}=require('./models');


const fs=require('fs');
const pizzaData=JSON.parse(fs.readFileSync(`${__dirname}/data.json`,'utf-8'));
const extraData=JSON.parse(fs.readFileSync(`${__dirname}/extra.json`,'utf-8'));
const crypto=require('crypto');
const jwt=require('jsonwebtoken');


exports.importAllExtraIngredients=async(req,res)=>{
    try{
await ExtraIngredient.deleteMany();
const extraIngredients=await ExtraIngredient.create(extraData);
if(!extraIngredients){
  return  res.status(422).json({status:'fail',message:'The data is  invalid'})
}
return res.status(201).json({result:extraIngredients.length,status:'success',data:extraIngredients})


    }
    catch(err){
        console.log("💥 ERROR:", err);
        res.status(400).json({
            status:'fail',
            message:err.message
    })
}
}

exports.showAllIngredients=async(req,res,next)=>{
    try{
const extraIngredients=await ExtraIngredient.find();
// console.log('this is the extraIngredients',extraIngredients)
if(!extraIngredients){
    return res.status(404).json({status:'fail',message:'Couldnt find any extra ingredients'})
}
res.status(200).json({status:'success',data:extraIngredients})

    }
    catch(err){
        console.log('there is an error:',err)
        res.status(404).json({
            status:'fail',
            message:err.message
    })
}
}






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
        const token=jwt.sign(payload,process.env.SECRET_JWT,{expiresIn:'90d'});
        res.cookie('admin_token',token,{
            httpOnly:true,
            secure:true,  
            sameSite:'None',  //or 'Strict'
            maxAge:7*24*60*60*1000
        });
        // next();
    //    return res.json({message:'Logged in!'})
       return res.redirect('/gema/admin/dashboard');
}
else{
    return res.redirect('/gema/menu');
    // throw new Error('Boss doesnt have the token');
}
}catch(err){
    console.log(err.message);
    return res.redirect('/gema/menu');
    // res.status(400).json({
    //     status:'fail',
    //     message:err.message
    // })
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


exports.findIngredient=async(req,res)=>{
    try{
        // console.log('this is the req.body:',req.body)
        const{item}=req.query;
        // console.log('Item:',item);
        // console.log('req.params:',req.params)
        // console.log('req.query:',req.query)

const ingredient=await ExtraIngredient.findOne({item:{$regex:"^"+item+"$",$options:"i"}})
// console.log('and this is the ingredientFound: ',ingredient)
if(!ingredient){
  return  res.status(404).json({success:'fail',message:'There is no such ingredient'})
}
res.status(200).json({
    status:'success',
    data:ingredient
})
    }
    catch(err){
        console.log('Couldnt find the ingredient')
        res.status(400).json({status:'fail',message:err.message})
    }
}

exports.updateIngredient=async(req,res)=>{
    try{
        console.log('req.query:',req.query);
        const {item}=req.query;
        const{dataToUpdate}=req.body;
        console.log('req.body: ',req.body)
const ingredientUpdated=await ExtraIngredient.findOneAndUpdate({item:item.toUpperCase()},dataToUpdate,{new:true,runValidators:true})
console.log('The ingredientUpdated :',ingredientUpdated);
if(!ingredientUpdated){
    throw new Error('Couldnt update any ingredient')
}
res.status(200).json({
    status:'success',
    data:ingredientUpdated
})
    }
    catch(err){
        res.status(404).json({status:'fail',message:err.message})
    }
}


exports.findIngredientToDelete=async(req,res)=>{
    try{
console.log('req.query:',req.query)
const {item}=req.query;
if(!item){
    throw new Error('Please provide an ingredient name')
}


const deletedIngredient=await ExtraIngredient.findOneAndDelete({item:item.toUpperCase()})
if(!deletedIngredient){
    throw new Error('There is no ingredient to delete')
}

res.status(200).json({
    status:'success',
    message:'Ingredient Succesfuly deleted',
    data:deletedIngredient
})
    }
    catch(err){
        res.status(400).json({
            status:'fail',
            message:err.message
        })
    }
}


exports.createIngredient=async(req,res)=>{
    try{
        const{dataToUse}=req.body;
        console.log('req.body:',req.body);
        console.log('dataToUse:',dataToUse)
if(!dataToUse){
    res.status(404).json({status:'fail',message:'Please provide data to create new Ingredient'})
}

const newIngredient= await ExtraIngredient.create({item:dataToUse.item,unit:dataToUse.unit,price:dataToUse.price});
console.log('newIngredient:',newIngredient)
if(!newIngredient){
   return res.status(400).json({status:'fail',message:'Couldnt create new Ingredient!'})
}else{
 return res.status(201).json({status:'success',data: newIngredient})
}

    }
    catch(err){
        res.status(400).json({
            status:'fail',
            message:err.message
        })
    }
}


exports.findPizza=async (req,res)=>{
    try{
        console.log('req.query:',req.query);
        const name=req.query.name;
const pizza=await Pizza.findOne({name:{$regex:"^"+name+"$",$options:"i"}})
if(!pizza){
   return res.status(404).json({status:'fail',message:'There is no pizza with this name'})
}else{
    res.status(200).json({
status:'success',
data:pizza})
}
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
        const{updateData,id}=req.body;
        console.log('updateData:',updateData);
        if(!updateData){
            return res.status(400).json({status:'fail',message:'Please provide data to update the pizza'})
        }
        const updatedPizza=await Pizza.findByIdAndUpdate({_id:id},{name:updateData.name,prices:{small:updateData.prices.small,large:updateData.prices.large},ingredients:updateData.ingredients},{new:true,runValidators:true})
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
res.status(400).json({status:'fail',message:err.message})
    }
}
exports.deletePizza=async(req,res)=>{
    try{


        const {dataBackup}=req.body;
        if(!dataBackup){
            return res.status(400).json({status:'fail',message:'Please provide dataBackup'})
        }
        const id=dataBackup._id;

const pizzaToDelete=await Pizza.findByIdAndDelete({_id:id});
if(!pizzaToDelete){
    return res.status(400).json({status:'fail',message:'Couldnt find this pizza!'})
}else{
    res.status(200).json({
        status:'success',
        message:'Pizza deleted successfully!'
    })
}

    }
    catch(err){
        res.status(500).json({status:'fail',message:err.message})
    }
}