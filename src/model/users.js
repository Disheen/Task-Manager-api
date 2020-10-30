const mongoose =require('mongoose')
const validator=require('validator')
const bcrytpjs=require('bcryptjs')
const Task=require('./task')
const sharp =require('sharp')


const USerSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
            },
    age:{
        type:Number,
        validate(value){
            if(value<18)
            throw new Error('Age limit is not exceeded')
        
        }
          
       },
       email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:true,
        validate(value){
             if(!validator.isEmail(value))  
             throw new Error("Invalid Email ID") 
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password sould not contain "password"')
            }
        }
    },
    tokens:[{
        token:{
        type:String,
        required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

USerSchema.virtual('mytasks',{
    ref:'tasks',
    localField:'_id',
    foreignField:'owner'
})
USerSchema.methods.toJSON=function(){
    const user=this
    //console.log(this)
    const UP={
        _id:user._id,
        name:user.name,
        email:user.email,
        age:user.email,
        createdAt:user.createdAt,
        updatedAt:user.updatedAt
    }
    return UP   
}

USerSchema.pre('save',async function(next){
    const user=this

    if(user.isModified('password')){
        user.password=await bcrytpjs.hash(user.password,8)
      
    }

    next()
})
USerSchema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})
const User=mongoose.model('users',USerSchema)

module.exports=User