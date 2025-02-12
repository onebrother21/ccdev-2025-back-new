import { Job } from 'bullmq';
import { Notification } from '../models';
import * as AllTypes from "../types";
import { CommonUtils, createQueue } from '../utils';

type NotificationObj = {
  userContact:string;
  data:any;
  type:AllTypes.INotification["type"];
}
// Helper function to replace placeholders in templates
const replaceNotificationData = (template: string, data: Record<string, any>) => {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || '');
};
export const formatNotification = async (job:Job) => {
  const sendNotificationsQueue = createQueue('send-notification',{logItems:["error","closed"]});
  try {
    const template = AllTypes.INotificationTemplates[job.data.type];
    const personalizedMessage = replaceNotificationData(template,job.data.data);
    const requestBody = {
      to:job.data.userContact,
      subject:job.data.type,
      text: personalizedMessage,
    };
    await sendNotificationsQueue.add("send-notification-job",{...job.data,requestBody},{jobId:CommonUtils.shortId(),delay:100});
    return { ok: true };
  }
  catch (error) {
    console.error('Error processing notification:', error);
    const notification = await Notification.findById(job.data.id);
    if(notification) await notification.setStatus(AllTypes.INotificationStatuses.FAILED,null,true);
    throw error;
  }
};
export default formatNotification;