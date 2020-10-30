const mongoose=require('mongoose')
const validator= require('validator')
const User = require('../model/users')
const Task = require('../model/task')


mongoose.connect(process.env.MONGO_DB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true
})

// const User=mongoose.model('User',{
//     name:{
//         type:String,
//         required:true,
//         trim:true
//             },
//     age:{
//         type:Number,
//         validate(value){
//             if(value<18)
//             throw new Error('Age limit is not exceeded')
        
//         },
//         default:18
       
//        },
//        email:{
//         type:String,
//         trim:true,
//         lowercase:true,
//         required:true,
//         validate(value){
//              if(!validator.isEmail(value))  
//              throw new Error("Invalid Email ID") 
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         trim:true,
//         minlength:7,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Password sould not contain "password"')
//             }
//         }
//     }
// })
// const D1=new User({
//     email:'    DISH@GMAIL.COM'  ,
//     name:'          Disheen     ',
//     password:'         Password'
    
   
// })
// D1.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })

// const tasks=mongoose.model('task',{
//     task:{
//         type:String
//     },
//     completed:{
//         type:Boolean
//     }
// })
// const t=new tasks({
//     task:'Mopping',
//     completed:true
// })
// t.save().then((me)=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })

//  User.insertMany([{name:'Dishee',email:'sdishe@gmail.com',password:'pass@123',age:20},
//                  {name:'Dishee',email:'sdishe@gmail.com',password:'pass@1234',age:29 }])