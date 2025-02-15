import { Job } from 'bullmq';
import Models from '../models';
import Types from "../types";
import Utils from '../utils';

export const scheduleNotifications = async (job:Job) => {
  // Initialize process-notifications queue
  const formatNotificationsQueue = Utils.createQueue('format-notification',{logItems:["error","closed"]});
  const notificationsToProcess = await Models.Notification.find({
    status: { $in: [Types.INotificationStatuses.NEW, Types.INotificationStatuses.FAILED] }
  });
  // Process each notification
  for (const notification of notificationsToProcess) {
    await notification.populate("audience");
    const {id,type,method,data} = notification;
    for (let i = 0,l = notification.audience.length;i<l;i++) {
      const user = notification.audience[i];
      const userContact = user.getUserContactByMethod(notification.method);
      const isLast = i == notification.audience.length - 1;
      try {
        const jobData = {id,type,method,data,userContact,isLast};
        const job = await formatNotificationsQueue.add('format-notification-job',jobData,{jobId:Utils.shortId(),delay:100});
        notification.job = job.id as string;
        await notification.setStatus(Types.INotificationStatuses.SENDING,null,true);
      }
      catch (error) {
        console.error('Error processing notification:', error);
        await notification.setStatus(Types.INotificationStatuses.FAILED,null,true);
        throw error;
      }
    }
  }
  return { ok: true,count:notificationsToProcess.length };
};
export default scheduleNotifications;