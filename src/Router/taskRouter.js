const express= require('express')
const mongoose=require('mongoose')
const Task=require('../model/task')
const auth=require('../middleware/auth')
const routertask=new express.Router()

routertask.use(express.json())
// const bcryptjs=require('bcryptjs')
// const jwt=require('jsonwebtoken')


routertask.post('/tasks',auth,async(req,res)=>{
    try{
    //const task1=new Task(req.body)
    const task=new Task({
        ...req.body,
        owner:req.user._id,
        
    })
    console.log(task)
    task.save()
    res.status(201).send(task)

    }
    catch(e){
        res.status(400).send(e)
        console.log(e)
    }
    

})
    


routertask.get('/tasks/:id',auth, async(req,res)=>{
    // --------------GET Using Async Await----------------
    const _id =req.params.id
   try{ 
   const taskG=await Task.findOne({_id,owner:req.user._id})  
   if(!taskG){
       res.status(404).send('Task Not Found')
   }
   res.status(200).send(taskG)
   }
   catch(e){
       res.status(500).send(e)
   }

})

routertask.get('/tasks',auth,async(req,res)=>{
    try{
        const match={}
        const sort={}
        // const task= await Task.find({})
        // res.send(task)
        if(req.query.completed){
            match.completed=req.query.completed=='true'
        }
        if(req.query.sortBy){
            const parts=req.query.sortBy.split('-')
            sort[parts[0]]=parts[1]==='asc'?1:-1

        }
        const user=req.user
        await user.populate(
            {
                path:'mytasks',
                match,
                options:{
                    limit:parseInt(req.query.limit),
                    skip:parseInt(req.query.skip),
                    sort,
        
                },
            
 
            }).execPopulate()
        res.send(user.mytasks)

    }
    catch(e){
        res.status(500).send()
    }
})

routertask.patch('/tasks/:id',auth,async(req,res)=>{
    field=Object.keys(req.body)
    const fields=['description','completed','__v','_id']
    const _id=req.params.id
    //console.log(mongoose.Types.ObjectId.isValid(req.params.id));

    
    
    try{
            
       field.forEach((f)=>{
           if(fields.includes(f)){
           isField=true
        }
           else{
               isField=false
               res.status(400).send('Invalid update  request')
    
             }
       })
       const taskG=await Task.findOne({_id,owner:req.user._id})  
        if(!taskG){
            res.status(404).send('Task Not Found')
        }
        console.log(taskG)
            field.forEach(f=>taskG[f]=req.body[f])
            await taskG.save()
            res.status(200).send(taskG)
    
    } 
       

    catch(e){
         res.status(400).send(e)
         console.log(e)
         }
    
})

routertask.delete('/tasks/:id',auth,async(req,res)=>{
    try{
    const _id =req.params.id
    console.log(req)
    const taskD=await Task.findOneAndDelete({_id,owner:req.user._id})
    if(!taskD)
    res.status(404).send('Invalid request')
    res.send(taskD)
    }
    catch(e){
        res.status(400).send(e)
        }

})


module.exports=routertask