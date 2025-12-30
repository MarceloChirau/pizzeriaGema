const express=require('express');
const router=express.Router();

const {importAllPizzas,showAllPizzas}=require('./controllers.js');

router
.post('/import',importAllPizzas);

router
.get('/showPizzas',showAllPizzas);



module.exports=router;



