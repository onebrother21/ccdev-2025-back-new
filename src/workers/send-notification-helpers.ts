
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import axios from 'axios';
import Utils from '../utils';
import { getUserSocket } from '../init/sockets';

//dummy func
const sendDummy = async (to: string, subject: string, text: string) => {
  await Utils.sleep(5);
  return Utils.longId();
};
// Function for sending email
const sendTestEmail = async (to: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5ff7693d5260e6",
      pass: "b81277f7cfa005"
    }
  });
  const info = await transporter.sendMail({
    from: 'hashdash-support@mailtrap.io',
    to,
    subject,
    text,
  });
  return info.messageId;
};
const sendEmail = async (to: string, subject: string, text: string) => {
  // Looking to send emails in production? Check out our Email API/SMTP product!

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });
  const info = await transporter.sendMail({
    from: 'your-email@gmail.com',
    to,
    subject,
    text,
  });
  return info.messageId;
};

// Function for sending SMS
const sendSMS = async (to: string, body: string) => {
  const client = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
  const message = await client.messages.create({
    body,
    from: '+1234567890', // Your Twilio number
    to,
  });
  return message.sid;
};

// Function for sending push notifications
const sendPushNotification = async (to: string, title: string, body: string) => {
  const response = await axios.post('https://fcm.googleapis.com/fcm/send', {
    to,
    notification: { title, body },
  }, {
    headers: {
      Authorization: `Bearer YOUR_FCM_SERVER_KEY`,
    },
  });

  return response.data;
};

// Function for sending in-app notifications (using Socket.io for this example)
const sendInAppNotification = async (to:string, message: string) => {
  const socket = getUserSocket(to);
  if(!socket) throw "no socket found";
  socket.emit('notification',{ message });
  return {socketId:socket.id};
};

export {
  sendDummy,
  sendEmail,
  sendSMS,
  sendPushNotification,
  sendInAppNotification,
};