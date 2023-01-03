const nodemailer= require ('nodemailer');

const sendemail= async(options)=>{

    const transpoter= nodemailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }
    })
    const mailoptions = {
        from:"",
        to:options.email,
        subject:options.subject,
        text:options.text

    }
    
   await transpoter.sendMail(mailoptions) 

}

module.exports = sendemail;