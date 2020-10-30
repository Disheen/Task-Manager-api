const express= require('express')
require('./db/mongoose')
const router=require('./Router/userRouter')
const bcrytpjs=require('bcryptjs')
const app= express()
const TaskRouter=require('./Router/taskRouter')
const port=process.env.PORT
app.listen(port,()=>{
    console.log('Port '+port+ ' listening')

})
app.use(TaskRouter)

app.use(router)
app.use(express.json())

const Task=require('./model/task')
const User=require('./model/users')

//const main=async()=>{
    // const task=await Task.findById('5f9b156cdd50303b68c4f22e')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)
    // console.log(task)

    //const user=await User.findById('5f9b0587e0884331b45154f8')
    //console.log(user)
    //await user.populate('mytasks').execPopulate()
   // console.log(user)
    

//}
//main()


