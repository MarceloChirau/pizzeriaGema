const express=require('express');
const cors=require('cors');
const app=express();

app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));


//here we use the routes:
// We will create these next! 
// app.use('/api/v1/pizzas', pizzaRouter);


//base route:
app.get('/',(req,res)=>{
    res.status(200).json({
        status:'success',
        message:'Welcome to Pizzeria Gema!'
    })
})
module.exports=app;