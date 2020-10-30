const mongoose =require('mongoose')
const validator=require('validator')
const bcrytpjs=require('bcryptjs')

// const TaskSchema= new mongoose.Schema({
    
//         description:{
//             type:String,
//             required:true,
//             trim:true,
//                 },
//         completed:{
//             type:Boolean,
//             default:false
              
//            },
//         owner:{
//             type:mongoose.Schema.Types.ObjectId,
//             required:true
//         }
           
//     })
// const Task=mongoose.model('tasks',TaskSchema)



const TaskSchema= new mongoose.Schema({
    description:{
       type:String,
       required:true,
       trim:true,
           },
   completed:{
       type:Boolean,
       default:false
         
      },
      taskID:{
          type:Number,
          unique:true
      },
      owner:{
                   type:mongoose.Schema.Types.ObjectId,
                   required:true,
                   ref:'users'
             
               }
  },
  {
      timestamps:true  
  }
)
const Task=mongoose.model('tasks',TaskSchema  )
// const task=new Task({
//     description:"asdfg",
//     completed:false,

   
// })
//task.save()

module.exports=Task