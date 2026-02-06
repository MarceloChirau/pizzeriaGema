const express=require('express');
const cors=require('cors');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');
const cookieParser = require('cookie-parser');
const {globalError}=require('./globalError');
const path=require('path');

const hpp=require('hpp');
const pizzaRouter=require('./routes');
const userRouter=require('./userRouter');
const bookingRouter=require('./bookingRoutes.js');
const {webhookCheckout}=require('./bookingController.js')

const app=express();
app.set('trust proxy', 1);

app.use(cookieParser());


app.use(helmet({contentSecurityPolicy: false}));

// app.use(cors({
//     origin:process.env.NODE_ENV==='production'?  'https://pizzeriagema.onrender.com':'http://localhost:3000',
//     credentials:true
// }));

const allowedOrigins = ['https://localhost:3000', 'https://127.0.0.1:3000', 'https://192.168.1.213:3000','https://pizzeriagema.onrender.com'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked by CORS:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


const limiter=rateLimit({
    windowMs:15*60*1000, //15 minutes
    max:1000, //limit each api to 100 requests per window
    message:'Too many requests from this IP, please try again later'
});
app.use(limiter);

// In app.js (BEFORE express.json)
app.post('/booking/webhook', express.raw({type: 'application/json'}), webhookCheckout);


app.use(express.json({limit:'20kb'})); // i can adjust this  according to my needs of how musch data i can receive


app.use(hpp());



app.use('/gema',pizzaRouter);
app.use('/user',userRouter);
app.use('/booking',bookingRouter);

app.use(express.static(path.join(__dirname,'public')));

//catch all route(for 404)
//this catches anything that didnt match the routes above
app.all(/(.*)/,(req,res,next)=>{
    const err=new Error(`Can't find ${req.originalUrl} on this server`);
    err.status='fail';
    err.statusCode=404;
    next(err);
});

app.use(globalError);

module.exports=app;