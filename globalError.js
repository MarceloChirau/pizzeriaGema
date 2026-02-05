exports.globalError=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.status=err.status || 'error';
    if(process.env.NODE_ENV==='development'){
       return res.status(err.statusCode).json({
            status:err.status,
            error:err,
            message:err.message,
            stack:err.stack
        })
    }else{
        // PRODUCTION: Don't leak leak details to the client
        // Only send message if the error is "Operational"
        if(err.isOperational){

        return    res.status(err.statusCode).json({
                status:err.status,
                message:err.message,
        })
        }else{
            // Programming or unknown error: don't leak details
console.log('ERROR:',err);
return res.status(500).json({
    status:'error',
    message:"Something went wrong"
})
        }

    }
}
