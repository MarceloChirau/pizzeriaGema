const {Pizza}=require('../../models');
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

exports.showPizzas=async()=>{
    try{
        // we check the length because if there is no
    //pizzas the find() method return and empty array
    //and an empty array is truthy
        const pizzas=await Pizza.find();
        if(!pizzas.length===0) throw new AppError('There is no pizzas available',400);
        return pizzas;
    }catch(err){
        if(err.isOperational)throw err;
throw new AppError('Database service is currently unavailable',500,{cause:err})
    }
    
}


exports.checkBossKey=async(key)=>{
    if(key!==process.env.SECRET_KEY_URL)return null;

        const payload={
            role:'admin',
            site:'Pizzeria Gema',
            description:'Owner',
        }
        const token=jwt.sign(payload,process.env.SECRET_JWT,{expiresIN:'1h'});
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