import { Worker,Queue,QueueOptions,Job } from 'bullmq';
import {
  replaceNotificationData,
  sendEmail,
  sendInAppNotification,
  sendPushNotification,
  sendSMS,
  sendDummy
} from "./process-notifications-helpers";
import { Notification, User } from '../models';
import * as AllTypes from "../types";
import { redisConfig } from "../utils";

const connection = redisConfig();

const processNotifications = async (job:Job) => {
  const notification =  await Notification.findById(job.data.id);
  await notification.populate("audience");
  try {
    const template = AllTypes.INotificationTemplates[notification.type];
    const personalizedMessage = replaceNotificationData(template, notification.data);
    const user = notification.audience[0];
    // Intuitively decide which user property to use based on the notification method
    let to: string | null = null;
    switch (notification.method) {
      case 'email':
        to = user.email || null;
        break;
      case 'sms':
        to = user.mobile || null;
        break;
      case 'push':
        to = user.pushToken || null;
        break;
      case 'in-app':
        to = user.socketId || null;
        break;
      case 'auto':
        try {
          // First attempt to send via WebSocket (check if socketId is available)
          to = user.socketId || null;
        }
        catch (err) {
          // If WebSocket fails, fallback to push (use pushToken)
          to = user.pushToken || null;
        }
        break;
      default:
        throw new Error('Unknown notification method');
    }
    if (!to) {
      throw new Error(`User does not have a valid ${notification.method} to send notification.`);
    }

    // Build request object
    const requestBody = {
      to,
      subject: notification.type,
      text: personalizedMessage,
    };
    // Handle different notification methods (send via respective package)
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

      default:
        throw new Error('Unknown notification method');
    }

    // Mark notification as sent
    notification.setStatus(AllTypes.INotificationStatuses.SENT);
    await notification.save();
    return { ok: true };
  }
  catch (error) {
    console.error('Error processing notification:', error);
    notification.setStatus(AllTypes.INotificationStatuses.FAILED);
    await notification.save();
    throw new Error('Notification failed');
  }
};
// Process notifications worker
const processNotificationsWorker = new Worker('process-notifications',processNotifications,{connection,skipVersionCheck:true})
  .on("resumed",() => console.log('⚡️ [process-notifications-worker]: Resumed -> '))
  .on('error',info => console.log('⚡️ [process-notifications-worker]: Error -> ',info))
  .on("ioredis:close",() => console.log('⚡️ [process-notifications-worker]: IORedis Closed -> '))
  .on("drained",() => console.log('⚡️ [process-notifications-worker]: Drained -> []'))
  .on("progress",info => console.log('⚡️ [process-notifications-worker]: Progess -> ',info))
  .on('completed',info => console.log('⚡️ [process-notifications-worker]: Completed -> ',info.id))
  .on('failed',info => console.log('⚡️ [process-notifications-worker]: Failed -> ',info.id));
console.log('⚡️ [process-notifications-worker]: Initialized');