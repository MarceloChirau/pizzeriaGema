const globalError=(err,req,res,next)=>{
 err.statusCode=err.statusCode || 500;
 err.status=err.status || 'error';//if it is 4xx is 'fail' if it is 5xx it is 'error'
    if(process.env.NODE_ENV==='development'){

    return    res.status(err.statusCode).json({
            status:err.status,
            error:err,
            code:err.code,
            reason:err.reason,
            cause:err.cause,
            message:err.message,
            info:err.info,
            errorNumber:err.errno,
            stack:err.stack
        })
    }else if (process.env.NODE_ENV==='production'){
if(err.isOperational){
//an expected error from user like a user searches
//for a pizza that doesnt exist
  return  res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
}else{
    //programming like internal bug,like syntax
    // or typo error from programmer
    console.error('ERROR:',err)//we log it for the developer
    return res.status(500).json({
        status:'error',
        message:'something went wrong'
    })
}

}
}


module.exports=globalError;