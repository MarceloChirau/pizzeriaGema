const {Pizza,ExtraIngredient}=require('../../models');
const AppError=require('../utils/appError');
const jwt=require('jsonwebtoken');


exports.seedPizzas=async(data)=>{
    try{

        await Pizza.deleteMany();
        const pizza=await Pizza.create(data);
        return pizza
    }catch(err){
throw new AppError('Invalid data',400,{cause:err})
    }
}

exports.seedIngredients=async(data)=>{
    try{
        await ExtraIngredient.deleteMany();
const ingredients=await ExtraIngredient.create(data);
return ingredients;
    }
    catch(err){
        throw new AppError('There is no data available to create the ingredients',400,{cause:err})

    }
}

exports.showPizzas=async()=>{
    try{
        // we check the length because if there is no
    //pizzas the find() method return and empty array
    //and an empty array is truthy
        const pizzas=await Pizza.find();
        if(pizzas.length===0) throw new AppError('There is no pizzas available',400);
        return pizzas;
    }catch(err){
        if(err.isOperational)throw err;
throw new AppError('Database service is currently unavailable',500,{cause:err})
    }
    
}
exports.showIngredients=async()=>{
    const ingredients=await ExtraIngredient.find();
    if(ingredients.length===0)throw new AppError('There is no ingredients to show',404);
    return ingredients;
}

exports.checkBossKey=async(key)=>{
    if(key!==process.env.SECRET_KEY_URL)return null;

        const payload={
            role:'admin',
            site:'Pizzeria Gema',
            description:'Owner',
        }
        const token=jwt.sign(payload,process.env.SECRET_JWT,{expiresIn:'1h'});
        return token;
    

}


exports.verifyAdminToken=(token)=>{
    if (!token) throw new AppError('Token not provided',400) ;
    try{
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        if (decoded.role !== 'admin') {
            throw new AppError('You are not authorized',401)
            // 4. Attach the boss info to the request for later use
        }
    
            return decoded;
    }catch(err){
if(err.isOperational)throw err;
throw new AppError('Invalid or expired session.Please log in again.',401,{cause:err})
    }
    
    

}

exports.findTheIngredient=async(item)=>{

const ingredient=await ExtraIngredient.findOne({item:{$regex:"^"+item+"$",$options:"i"}})
if(!ingredient)throw new AppError('There is no such ingredient!',404);
return ingredient;
}
exports.findThePizza=async(name)=>{
    if(!name)throw new AppError('Please provide a name to find the pizza!',400);
const pizza=await Pizza.findOne({name:{$regex:"^"+name+"$",$options:"i"}});
if(!pizza)throw new AppError('There is no such a pizza in database!',404);
return pizza;


}


exports.deleteIngredient=async(ingredient)=>{
    if (!ingredient) {
        throw new AppError('Ingredient name is required for deletion', 400);
    }
    const deletedIngredient=await ExtraIngredient.findOneAndDelete({item:ingredient.toUpperCase()});
    if(!deletedIngredient){
        throw new AppError('There is no ingredient to delete',404)
    }
    return deletedIngredient;
}
exports.updateTheIngredient=async(item,dataToUpdate)=>{
    if (!ingredient) {
        throw new AppError('Ingredient name is required for deletion', 400);
    }
    const ingredientUpdated=await ExtraIngredient.findOneAndUpdate({item:item.toUpperCase()},dataToUpdate,{new:true,runValidators:true});
    if(!ingredientUpdated)throw new AppError('Couldnt update any ingredient',404);
    return ingredientUpdated;
}

exports.updateThePizza=async(updateData,id)=>{
    if(!updateData || !id)throw new AppError('Please provide data to update and correct id',400);
    const updatedPizza=await Pizza.findByIdAndUpdate({_id:id},{name:updateData.name,prices:{small:updateData.prices.small,large:updateData.prices.large},ingredients:updateData.ingredients},{new:true,runValidators:true})
        if(!updatedPizza) throw new AppError('Couldnt update the pizza',400);    
        return updatedPizza; 
}

exports.createTheIngredient=async(data)=>{
    if(!data)throw new AppError('Data is missing to create ingredient',400);
    const {item,unit,price}=data;
const newIngredient= await ExtraIngredient.create({item:item,unit:unit,price:price});
if(!newIngredient){
throw new AppError('Couldnt create new Ingredient!',400)}
return newIngredient;
}
exports.createThePizza=async(data)=>{
    if(!data)throw new AppError('Please provide data to create pizza');
    const newPizza=await Pizza.create({
        name:data.name,
        prices:{
            small:data.smallPrice,
            large:data.largePrice
        },
        ingredients:data.ingredients.split(','),
        image:req.file.filename
    });
    if(!newPizza)throw new AppError('Couldnt create a new pizza.');
    return newPizza;
}

exports.deleteThePizza=async(data)=>{
    if(!data)throw new AppError('Please provide data to delete pizza');
const pizzaToDelete=await Pizza.findByIdAndDelete({_id:data._id});
if(!pizzaToDelete)throw new AppError('Couldnt find pizza to delete ');
return pizzaToDelete;

}