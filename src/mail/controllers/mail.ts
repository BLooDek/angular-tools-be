import nodemailer from 'nodemailer';
export const transporter = nodemailer.createTransport({
  service: 'gmail', // Use the built-in Gmail service
  auth: {
    user: process.env.MAIL_USER, // Your Gmail address from .env file
    pass: process.env.MAIL_PASSWORD, // Your App Password from .env file
  },
});
