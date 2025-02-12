import { Job } from 'bullmq';
import { Notification } from '../models';//import user to ensure it's registry
import * as AllTypes from "../types";
import { CommonUtils, createQueue, logger } from '../utils';

export const scheduleNotifications = async (job:Job) => {
  // Initialize process-notifications queue
  const formatNotificationsQueue = createQueue('format-notification',{logItems:["error","closed"]});
  const notificationsToProcess = await Notification.find({
    status: { $in: [AllTypes.INotificationStatuses.NEW, AllTypes.INotificationStatuses.FAILED] }
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
        const job = await formatNotificationsQueue.add('format-notification-job',jobData,{jobId:CommonUtils.shortId(),delay:100});
        notification.job = job.id as string;
        await notification.setStatus(AllTypes.INotificationStatuses.SENDING,null,true);
      }
      catch (error) {
        console.error('Error processing notification:', error);
        await notification.setStatus(AllTypes.INotificationStatuses.FAILED,null,true);
        throw error;
      }
    }
  }
  return { ok: true,count:notificationsToProcess.length };
};
export default scheduleNotifications;