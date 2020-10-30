const sgMail=require('@sendgrid/mail')
sgMail.setApiKey(process.env.SG_KEY)
const WelcomeEmail=(email,name)=>{
sgMail.send({
            to:email,
            from:'sdisheen93@gmail.com',
            subject:'Welcome mail',
            text:`Welcome to the app ${name}`
        }).then(()=>{
            console.log('Sent')
        }).catch((e)=>{
        console.log(e)
    })
}

const CancelEmail=(email,name)=>{
    sgMail.send({
                to:email,
                from:'sdisheen93@gmail.com',
                subject:'Exit Mail',
                text:`Dear ${name}, I hope to see you back soon.We are sorry that you are not satisfied with out services`
            }).then(()=>{
                console.log('Sent')
            }).catch((e)=>{
            console.log(e)
        })
    }
    
module.exports={ WelcomeEmail,CancelEmail }