


const asyncHandler = (fn)=>(req,res,next)=>{
   return Promise.resolve((fn(req,res,next)))
         .catch((err)=>next(err));
}
export{asyncHandler}




// const asyncHandlerWithError = (fn)=>(req,res,next)=>{
//     try{
//         fn(req,res,next);
//     }
//     catch(err){
//         console.log("error is ",err);
//     }
// }
// export {asyncHandlerWithError}