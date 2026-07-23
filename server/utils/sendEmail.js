const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
dotenv.config()


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass:process.env.SMTP_PASS
  },
});

module.exports = transporter;

// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=587
// SMTP_SECURE=false
// SMTP_USER=riteshpatidar088@gmail.com
// SMTP_PASSWORD='wjdn hlzw outy lqme'
