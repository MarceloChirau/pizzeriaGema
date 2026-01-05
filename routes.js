const express=require('express');
const router=express.Router();
const path = require('path');
const multer=require('multer');


const {importAllPizzas,showAllPizzas,bossLogIn,protectAdmin,findPizza,updatePizza,createPizza,deletePizza}=require('./controllers.js');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{  // args not random but provided by multer: req=standard expr.request,file=obj that contains
        cb(null,'public/img');   // information about the file beign upoloaded and cb=callback this is the function i must call to tell
    },                           //to tell multer i finished processing, it follows error-first pattern:cb(error,result)
    filename:(req,file,cb)=>{
        const extension=path.extname(file.originalname);//path.extname(string): This looks at a string and returns everything from the last "dot" to the end
        cb(null,`pizza-${Date.now()}${extension}`); //Example: path.extname('pizza-photo.png') returns '.png'.
    }
})
const upload=multer({storage:storage});


router
.post('/import',importAllPizzas);

router
.get('/showPizzas',showAllPizzas);

router
.get('/menu',(req,res)=>{
    res.sendFile(path.join(__dirname,'./public/index.html'))
});


router
.get('/admin/login/:key',bossLogIn);


router
.get('/admin/dashboard', protectAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, './public/admin.html'));
    // res.send('redirect works')
});

router
.get('/findPizza',protectAdmin,findPizza)

router
.patch('/updatePizza',protectAdmin,updatePizza);


router
.post('/createPizza',upload.single('image'),createPizza)

router
.delete('/deletePizza', protectAdmin,deletePizza);

module.exports=router;



