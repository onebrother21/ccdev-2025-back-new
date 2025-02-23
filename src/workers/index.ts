import dotenv from 'dotenv';
dotenv.config();

import db from '../init/db';
import Utils from '../utils';

import doRandomSleep from './random-sleep';
import scheduleNotifications from './schedule-notifications';
import formatNotification from './format-notification';
import sendNotification from './send-notification';
import autoAssignCouriers from './auto-assign-couriers';
import bulkEditCollection from './bulk-edit-collection';
import logData from './log-data';
import clockBugs from './clock-bugs';
import tokenCleanUp from './token-cleanup';

enum MyQueueNames {
  RANDOM_SLEEP = "random-sleep",
  SCHEDULE_NOTIFICATIONS = "schedule-notifications",
  FORMAT_NOTIFICATIONS = "format-notification",
  SEND_NOTIFICATIONS = "send-notification",
  AUTO_ASSIGN_COURIERS = "auto-assign-couriers",
  BULK_EDIT_COLLECTION = "bulk-edit-collection",
  LOG_DATA = "log-data",
  CLOCK_BUGS = "clock-bugs",
  TOKEN_CLEANUP = 'token-cleaup',
}
const MyWorkerProcessors = {
  [MyQueueNames.RANDOM_SLEEP]:doRandomSleep,
  [MyQueueNames.SCHEDULE_NOTIFICATIONS]:scheduleNotifications,
  [MyQueueNames.FORMAT_NOTIFICATIONS]:formatNotification,
  [MyQueueNames.SEND_NOTIFICATIONS]:sendNotification,
  [MyQueueNames.AUTO_ASSIGN_COURIERS]:autoAssignCouriers,
  [MyQueueNames.BULK_EDIT_COLLECTION]:bulkEditCollection,
  [MyQueueNames.LOG_DATA]:logData,
  [MyQueueNames.CLOCK_BUGS]:clockBugs,
  [MyQueueNames.TOKEN_CLEANUP]:tokenCleanUp,
}
const dbString = process.env.DATABASE_URL;
const logItems = ['error','closed','init','failed','completed'];
export class MyWorkers {
  init = async (startDb:boolean) => {
    if(startDb && dbString){
      await db.connect(dbString);
      for(const k in MyQueueNames) Utils.createWorker(k,MyWorkerProcessors[k],{logItems});
    }
  }
}
export default MyWorkers;
export { MyQueueNames };