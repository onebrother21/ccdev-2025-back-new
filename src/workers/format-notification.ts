import { Job } from 'bullmq';
import Models from '../models';
import Types from "../types";
import Utils from '../utils';

type NotificationObj = {
  userContact:string;
  data:any;
  type:Types.INotification["type"];
}
// Helper function to replace placeholders in templates
const replaceNotificationData = (template: string, data: Record<string, any>) => {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || '');
};
export const formatNotification = async (job:Job) => {
  const sendNotificationsQueue = Utils.createQueue('send-notification',{logItems:["error","closed"]});
  try {
    const template = Types.INotificationTemplates[job.data.type];
    const personalizedMessage = replaceNotificationData(template,job.data.data);
    const requestBody = {
      to:job.data.userContact,
      subject:job.data.type,
      text: personalizedMessage,
    };
    await sendNotificationsQueue.add("send-notification-job",{...job.data,requestBody},{jobId:Utils.shortId(),delay:100});
    return { ok: true };
  }
  catch (error) {
    console.error('Error processing notification:', error);
    const notification = await Models.Notification.findById(job.data.id);
    if(notification) await notification.setStatus(Types.INotificationStatuses.FAILED,null,true);
    throw error;
  }
};
export default formatNotification;