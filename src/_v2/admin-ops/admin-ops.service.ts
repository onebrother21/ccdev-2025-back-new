import { AppError, CommonUtils, createQueue } from '../../utils';
import * as AllTypes from "../../types";

import { NotificationService } from '../../services';


const randomSleepQ = createQueue("random-sleep");
const scheduleNotificationsQ = createQueue("schedule-notifications");
const autoAssignCouriersQ = createQueue("auto-assign-couriers");
const bulkEditCollectionQ = createQueue("bulk-edit-collection");

export class AdminOpsService {
  static postJob = async (user:AllTypes.IUser,{type,opts:{delay,every} = {},data}:any) => {
    const opts:any = {};
    switch(type){
      case "doRandomSleep":{
        if(!delay) throw new AppError(422,"operation failed");
        opts.delay = delay * 1000; // Convert seconds to milliseconds
        await randomSleepQ.add('sleep-job', { title:data.title }, opts);
        return {message:`Random sleep processor added`};
      }
      case "scheduleNotifications":{
        if(!every) throw new AppError(422,"operation failed");
        opts.repeat = {every:every * 60 * 1000}; // Convert minutes to milliseconds
        scheduleNotificationsQ.add('schedule-notifications-job',{},opts);
        return {message:`Notification processor on repeat every ${every} ms.`};
      }
      case "autoAssignCouriers":{
        if(!every) throw new AppError(422,"operation failed");
        opts.repeat = {every:every * 60 * 1000}; // Convert minutes to milliseconds
        autoAssignCouriersQ.add('auto-assign-couriers-job',{},opts);
        return {success: true,message:`Auto assigning couriers on repeat every ${every} ms.`};
      }
      case "bulkEditCollection":{
        if(!(data.modelName && data.newProps)) throw new AppError(422,"operation failed");
        bulkEditCollectionQ.add('bulk-edit-collection-job',data,opts);
        return {success: true,message:`Bulk Edit: ${data.modelName.toLocaleUpperCase()} -> Submitted`};
      }
    }
    //send registration notification
    const notificationMethod = AllTypes.INotificationSendMethods.SMS;
    const notificationData = {type};
    await NotificationService.createNotification("SYSTEM_ALERT",notificationMethod,[user.id],notificationData);
  };
}