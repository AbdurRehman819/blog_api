const nodeMailer= require('nodemailer');
require('dotenv').config();
const sendEmail=async(options)=>{
    const transporter=nodeMailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.Email_User,
            pass:process.env.Email_Password
        
        }
    });

    const mailOptions={
        from:process.env.Email_User,
        to:options.to,
        subject:options.subject,
        html:options.html
    }
    await transporter.sendMail(mailOptions);
}

module.exports=sendEmail;