const User=require('../model/users')
const  jwt=require('jsonwebtoken')
const Task=require('../model/task')


const auth=async (req,res,next)=>{
    try{
    const token= req.header('Authorization').replace('Bearer ','')
    const decoded=jwt.verify(token,process.env.JWT_KEY)
    id=decoded._id
   const user =await User.findOne({ _id:id,'tokens.token':token})
    if(!user){
        throw new Error()
    }  
    req.user=user
    req.token=token
    next()
    }
    catch(e){
        res.status(401).send("Please Authenticate")
    }
}
module.exports=auth