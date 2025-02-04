import { redisConfig } from "../utils";
import { Worker, Queue, Job } from 'bullmq';
import { Notification } from '../models';//import user to ensure it's registry
import * as AllTypes from "../types";

const connection = redisConfig();

const scheduleNotifications = async (job:Job) => {
  // Initialize process-notifications queue
  const processNotificationsQueue = new Queue('process-notifications',{connection,skipVersionCheck:true});
  const notificationsToProcess = await Notification.find({
    status: { $in: [AllTypes.INotificationStatuses.NEW, AllTypes.INotificationStatuses.FAILED] }
  });
  // Process each notification
  for (const notification of notificationsToProcess) {
    try {
      const job = await processNotificationsQueue.add('process-notification-job',{id:notification.id},{delay:100});
      notification.job = job.id;
      notification.setStatus(AllTypes.INotificationStatuses.SENDING);
      await notification.save();
    }
    catch (error) {
      console.error('Error processing notification:', error);
      notification.setStatus(AllTypes.INotificationStatuses.FAILED);
      await notification.save();
      throw error;
    }
  }
  return { ok: true,count:notificationsToProcess.length };
};
const scheduleNotificationWorker = new Worker('schedule-notifications',scheduleNotifications,{connection,skipVersionCheck:true})
  .on("resumed",() => console.log('⚡️ [schedule-notifications-worker]: Resumed -> '))
  .on('error',info => console.log('⚡️ [schedule-notifications-worker]: Error -> ',info))
  .on("ioredis:close",() => console.log('⚡️ [schedule-notifications-worker]: IORedis Closed -> '))
  .on("drained",() => console.log('⚡️ [schedule-notifications-worker]: Drained -> []'))
  .on("progress",info => console.log('⚡️ [schedule-notifications-worker]: Progess -> ',info))
  .on('completed',info => console.log('⚡️ [schedule-notifications-worker]: Completed -> ',info.id))
  .on('failed',info => console.log('⚡️ [schedule-notifications-worker]: Failed -> ',info.id));
console.log('⚡️ [schedule-notifications-worker]: Initialized');