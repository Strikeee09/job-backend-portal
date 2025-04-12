import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });

export const sendEmail = async ({email,subject,message}) => {
    console.log(process.env.SMTP_HOST, process.env.SMTP_SERVICE, process.env.SMTP_PORT, process.env.SMTP_USER, process.env.SMTP_PASSWORD);
    const transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST,        //simple mail transfer protocol host
        service: process.env.SMTP_SERVICE,  
        port: process.env.SMTP_PORT,  
        auth: {
            user: process.env.SMTP_USER,   
            pass: process.env.SMTP_PASSWORD, 
        },    
    });


    const options = {
        from : process.env.SMTP_MAIL,
        to: email,  
        subject: subject,
        text: message,
    }

    await transporter.sendMail(options)


};