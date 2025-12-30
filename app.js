const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');

const hpp=require('hpp');

const pizzaRouter=require('./routes');
const app=express();


app.use(helmet());
app.use(cors());
const limiter=rateLimit({
    windowMs:15*60*1000, //15 minutes
    max:100 //limit each api to 100 requests per window
});
app.use(limiter);
app.use(express.json({limit:'20kb'})); // i can adjust this  according to my needs of how musch data i can receive

app.use(hpp());

app.use('/gema',pizzaRouter);
app.use(express.static(`${__dirname}/public`));




module.exports=app;