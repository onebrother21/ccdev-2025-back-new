import { Job } from 'bullmq';
import {
  sendEmail,
  sendInAppNotification,
  sendPushNotification,
  sendSMS,
  sendDummy
} from "./send-notification-helpers";
import Models from '../models';
import Types from "../types";
import Utils from '../utils';

type NotificationObj = {
  userContact:string;
  data:any;
  type:Types.INotification["type"];
}

export const sendNotifications = async (job:Job) => {
  const notification = await Models.Notification.findById(job.data.id);
  if(!notification) throw new Error('Notification does not exist');
  const requestBody = job.data.requestBody;
  try{
    switch (notification.method) {
      case 'email':
        const emailMessageId = await sendDummy(requestBody.to, requestBody.subject, requestBody.text);
        notification.meta = { emailMessageId };
        break;

      case 'sms':
        const smsSid = await sendDummy(requestBody.to, requestBody.subject, requestBody.text);
        notification.meta = { smsSid };
        break;

      case 'push':
        const pushResponse = await sendDummy(requestBody.to, requestBody.subject, requestBody.text);
        notification.meta = { pushResponse };
        break;

      case 'in-app':
        await sendDummy(requestBody.to, requestBody.subject, requestBody.text);
        notification.meta = { socketId: requestBody.to };
        break;

      case 'auto':
        try {
          await sendDummy(requestBody.to, requestBody.subject, requestBody.text);
          notification.meta = { socketId: requestBody.to };
        } 
        catch (err) {
          // If WebSocket fails, fallback to push
          const pushResponse = await sendDummy(requestBody.to, requestBody.subject, requestBody.text);
          notification.meta = { pushResponse };
        }
        break;

      default:throw new Error('Unknown notification method');
    }

    // Mark notification as sent
    const status = job.data.isLast?Types.INotificationStatuses.SENT:Types.INotificationStatuses.SENT_SOME;
    await notification.setStatus(status,null,true);
    return { ok: true };
  }
  catch (error) {
    console.error('Error processing notification:', error);
    await notification.setStatus(Types.INotificationStatuses.FAILED,null,true);
    throw error;
  }
};
export default sendNotifications;