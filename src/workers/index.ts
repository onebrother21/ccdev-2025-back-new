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

export class MyWorkers {
  init = async (startDb:boolean) => {
    const dbString = process.env.DATABASE_URL;
    const logItems = ['error','closed','init','failed','completed'];

    if(startDb && dbString){
      await db.connect(dbString);
      Utils.createWorker("random-sleep",doRandomSleep,{logItems});
      Utils.createWorker("schedule-notifications",scheduleNotifications,{logItems});
      Utils.createWorker("format-notification",formatNotification,{logItems});
      Utils.createWorker("send-notification",sendNotification,{logItems});
      Utils.createWorker("auto-assign-couriers",autoAssignCouriers,{logItems});
      Utils.createWorker("bulk-edit-collection",bulkEditCollection,{logItems});
      Utils.createWorker("log-data",logData,{logItems});
      Utils.createWorker("clock-bugs",clockBugs,{logItems});
    }
  }
}
export default MyWorkers;