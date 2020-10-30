const express= require('express')

const User=require('../model/users')
const auth=require('../middleware/auth')

const router=new express.Router()

router.use(express.json())
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const multer=require('multer')
const sharp = require('sharp')
const {WelcomeEmail,CancelEmail }=require('../emails/account')

const upload=multer({
   
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        //if(!file.originalname.endsWith('.pdf')){
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb (new Error('Please Upload an Image'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatars',auth,upload.single('avatar'),async(req,res)=>{
    const buffer= await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()    
    req.user.avatar=buffer
    await req.user.save()
    
    res.send('Uploaded')

},(error,req,res,next)=>{
    res.status(400).send(error.message)
})

router.delete('/users/me/avatars',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
    const user=await User.findById(req.params.id)
    if(!user|| !user.avatar){
        throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
}
catch(e){
    res.status(404).send()
}
})
router.post('/users',async(req,res)=>{
    // --------------POST Using Async Await----------------
    const user=new User(req.body)
    
    try{
        const token=await jwt.sign({_id:user.id.toString()},'signature')
       // console.log(token)
        user.tokens=user.tokens.concat({ token }),
        await user.save()
        WelcomeEmail(user.email,user.name)
        res.status(201).send({user,token})

    }catch(e){
        res.status(400).send(e)
        //console.log(e)
    }

})
    // ------------ POST Using promises------------------
    // user.save().then((data)=>{
    //     res.status(201).send(data)
    //     console.log(data)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
    //})


//------------User Login-------------------

router.post('/users/login',async(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    try{
    const userL=await User.findOne({email})
    if(!userL){
        res.status(400).send('Invalid Login')
    }

    const Hashpassword=userL.password
    const isMatch= await bcryptjs.compare(password,Hashpassword)
    if(!isMatch){
        res.status(400).send('Invalid Login')
    }
    else{
    const token=await jwt.sign({_id:userL.id.toString()},process.env.JWT_KEY)
    //console.log(token)
    userL.tokens=userL.tokens.concat({ token }),
    await userL.save()
    
    res.send({userL,token})
    
    }
}
catch(e){
    res.status(400).send(e)
    console.log(e)
}

})

//-----------------------Logout-----------------------------
router.post('/users/logout',auth,async(req,res)=>{
    try{
     //   console.log(req.user.tokens)
        req.user.tokens=req.user.tokens.filter((token)=>{
            //console.log(token.token!==req.token)
            
            return token.token!==req.token
            
            })
      //  console.log(req.user.tokens)
        await req.user.save()
        res.send("Logged Out ")
    }
    catch(e){
      //  console.log(e)
        res.status(500).send()

    }
})



router.get('/users/me',auth,async(req,res)=>{
       // --------------GET Using Async Await----------------

      res.send(req.user)

})
    // ------------GET Using promises------------------    
    // User.find({}).then((data)=>{
    //     res.send(data)
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })
    //})


    // ------------GET single Using promises------------------ 
//     User.findById(req.params.id).then((data)=>{
//         console.log(data)
//         if(!data)
//         res.status(404).send('404 Not found')
//         res.send(data)
//     }).catch((error)=>{
//         res.status(500).send(error)
//     })
// })
//console.log('asd')

// ------------UPDATE Documents-----------------


router.patch('/users/me',auth,async(req,res)=>{
    const field=Object.keys(req.body)
    console.log(field)
    const fields=['name','age','email','password','__v','_id']
    
    try{
        
        field.forEach(f=>req.user[f]=req.body[f])
        console.log(req.user)
        await req.user.save()
        console.log(fields)
        
        if(fields.includes(field[0])){
            //console.log(true)
        }
        else{
            return res.status(400).send('Invalid update request')
        }
        res.send(req.user)    
    }
    catch(e){
         res.status(400).send(e)
        }
    
})


// --------------DELEtE documents----------------
    

router.delete('/users/me',auth,async(req,res)=>{
      try{
              await req.user.remove() 
              CancelEmail(req.user.email,req.user.name) 
              res.send(req.user)
      }
      catch(e){
          res.status(400).send(e)
      }
  
  })    
  
  
module.exports=router