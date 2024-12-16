const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

const sendEmail = async ({ sender, subject, message}) => {
    return await transport.sendMail({
        from: sender,
        to: 'j.guthmann@jonathan-gp.fr',
        subject: subject,
        text: message,
        html: message
    });
}

module.exports = { sendEmail }