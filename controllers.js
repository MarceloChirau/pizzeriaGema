const {Pizza,ExtraIngredient}=require('./models');
const {seedPizzas,
    showPizzas,
    checkBossKey,
    verifyAdminToken,
    findTheIngredient,
    seedIngredients,
    showIngredients,
    deleteIngredient,
    updateTheIngredient,
    createTheIngredient,
    findThePizza,
    updateThePizza,
    createThePizza,
    deleteThePizza
}=require('./src/services/pizzaServices.js')
const catchAsync=require('./src/utils/catchAsync')
const fs=require('fs');
const pizzaData=JSON.parse(fs.readFileSync(`${__dirname}/data.json`,'utf-8'));
const extraData=JSON.parse(fs.readFileSync(`${__dirname}/extra.json`,'utf-8'));
const crypto=require('crypto');
const jwt=require('jsonwebtoken');


exports.importAllExtraIngredients=catchAsync(async(req,res)=>{
const extraIngredients=seedIngredients(extraData);
return res.status(201).json({result:extraIngredients.length,status:'success',data:extraIngredients})
});

exports.showAllIngredients=catchAsync(async(req,res,next)=>{
const extraIngredients=await showIngredients();
res.status(200).json({status:'success',data:extraIngredients})
})


exports.importAllPizzas=catchAsync(async(req,res,next)=>{

// now intead of using these two mongoose model methods
// we will use pizzaServices that are detached from req,and res objects
// so we keep the controller thin
        // await Pizza.deleteMany();
        // const pizzas=await Pizza.create(pizzaData);
        //seedPizzas is a service now which i can even 
        //try in a terminal with a test script
        const pizzas=await seedPizzas(pizzaData);
        res.status(201).json({
            status:'success',
            results:pizzas.length,
            data:{pizzas}
        })
    //we got rid of try catch by using aq util helper catchAsync which
    //if something goes wrong, catches the error and sends it to global error handler
})

exports.showAllPizzas=catchAsync(async(req,res,next)=>{
//again using service here which also has custom AppEror
    const pizzas=await showPizzas();
    res.status(200).json({
        status:'success',
        results:pizzas.length,
        data:{pizzas}
   })

} )

exports.bossLogIn= catchAsync(async(req,res,next)=>{
    const {key}=req.params;
        const token=await checkBossKey(key);
        if(token){
            res.cookie('admin_token',token,{
                httpOnly:true,
                secure:process.env.NODE_ENV==='production',  
                sameSite:'None',  //or 'Strict'
                maxAge:7*24*60*60*1000
            });
           return res.redirect('/gema/admin/dashboard');
}
else{
    return res.redirect('/gema/menu');
}
})

exports.protectAdmin = catchAsync(async (req, res, next) => {
        const token = req.cookies.admin_token;
        const decoded =await verifyAdminToken(token);
        if(!decoded){
            res.clearCookie('admin_token');
            res.status(401).json({status:'fail',message:'Invalid or Expired token'})
        }
        req.admin = decoded;
        next(); 
});


exports.findIngredient=catchAsync(async(req,res)=>{
        const{item}=req.query;

const ingredient=await findTheIngredient(item);
res.status(200).json({
    status:'success',
    data:ingredient
})
})

exports.updateIngredient=catchAsync( async(req,res)=>{
        const {item}=req.query;
        const{dataToUpdate}=req.body;
const ingredientUpdated=await updateTheIngredient(item,dataToUpdate);

res.status(200).json({
    status:'success',
    data:ingredientUpdated
})
    
})


exports.findIngredientToDelete=catchAsync( async(req,res)=>{
const {item}=req.query;

const deletedIngredient=await deleteIngredient(item);

res.status(200).json({
    status:'success',
    message:'Ingredient Succesfuly deleted',
    data:deletedIngredient
})
    
})


exports.createIngredient=catchAsync( async(req,res)=>{
        const{dataToUse}=req.body;
const newIngredient= await createTheIngredient(dataToUse);
 return res.status(201).json({status:'success',data: newIngredient});
})


exports.findPizza=catchAsync( async (req,res)=>{
        const name=req.query.name;
const pizza=await findThePizza(name);

    res.status(200).json({
status:'success',
data:pizza});

});
    

exports.updatePizza=catchAsync( async(req,res)=>{
        const{updateData,id}=req.body;
        const updatedPizza=await updateThePizza(updateData,id);
res.status(200).json({status:'success',data:updatedPizza})
})


exports.createPizza=catchAsync( async(req,res)=>{
    const data=req.body;
        const newPizza=await createThePizza(data);
        res.status(201).json({status:'success',data:newPizza});
    });

exports.deletePizza=catchAsync( async(req,res)=>{
        const {data}=req.body;
const pizzaToDelete=await deleteThePizza(data);
    res.status(200).json({
        status:'success',
        message:'Pizza deleted successfully!',data:pizzaToDelete
    })
})