import { Request, Response, Router } from 'express';

import { transporter } from '../controllers/mail.js';
const router: Router = Router();

router.post('/send-email', ((req: Request, res: Response) => {
  return res.status(404).send('Method Not Allowed, dont even try'); // Prevent GET requests
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).send('Missing required fields: to, subject, text');
  }

  const mailOptions = {
    from: `"${process.env.SENDER_NAME}" <${process.env.GMAIL_USER}>`,
    to: to,
    subject: subject,
    text: text,
    html: `<b>${text}</b>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send(error.toString());
    }
    console.log('Email sent: ' + info.response);
    return res.status(200).send('Email sent successfully: ' + info.response);
  });
}) as any);
export default router;
