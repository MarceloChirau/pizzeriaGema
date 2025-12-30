const Pizza=require('./models');
const fs=require('fs');
const pizzaData=JSON.parse(fs.readFileSync(`${__dirname}/data.json`,'utf-8'));

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

exports.showAllPizzas=async(req,res,next)=>{
    try{
const pizzas=await Pizza.find();
res.status(200).json({
    status:'success',
    results:pizzas.length,
    data:{pizzas}
})
next();
    }
    catch(err){
        console.log('there is an error:',err)
        res.status(404).json({
            status:'fail',
            message:err.message
        })
    }
}
