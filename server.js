const http = require('http');
const https=require('https');
const fs=require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./.env'});
const app=require('./app');



const DB=process.env.DATABASE;
mongoose.connect(DB).then(()=>{
    console.log('DB connection succesful!');
})



const options={
    key:fs.readFileSync('./localhost-key.pem'),
    cert:fs.readFileSync('./localhost.pem')
}




const port=process.env.PORT || 3000;

https.createServer(options,app).listen(port,'0.0.0.0',()=>{
    console.log(`App is running on port ...${port}`);

})

http.createServer(app).listen(3001, '0.0.0.0', () => {
    console.log('Temporary HTTP backdoor running on port 3001');
});

// app.listen(port,()=>{
//     console.log(`App is running on port ...${port}`);
// })