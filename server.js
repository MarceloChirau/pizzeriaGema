const http = require('http');
const https=require('https');
const fs=require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./.env'});
const app=require('./app');



const DB=process.env.ANOTHER_DATABASE;
mongoose.connect(DB).then(()=>{
    console.log('DB connection succesful!');
})







console.log(process.env.NODE_ENV);
const port=process.env.PORT || 3000;

if(process.env.NODE_ENV==='development'){
    const options={
        key:fs.readFileSync('./localhost-key.pem'),
        cert:fs.readFileSync('./localhost.pem') 
    }
    https.createServer(options,app).listen(port,'0.0.0.0',()=>{
        console.log(`Development HTTPS running on port ...${port}`);
    
    })

}else{
    app.listen(port,()=>{
        console.log(`Production server running on port ${port}`);
    })
}




