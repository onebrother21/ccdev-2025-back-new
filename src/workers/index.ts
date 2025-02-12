import dotenv from 'dotenv';
dotenv.config();

import db from '../init/db';
import { createWorker } from '../utils';

import doRandomSleep from './random-sleep';
import scheduleNotifications from './schedule-notifications';
import formatNotification from './format-notification';
import sendNotification from './send-notification';
import autoAssignCouriers from './auto-assign-couriers';
import bulkEditCollection from './bulk-edit-collection';

export class MyWorkers {
  init = async (startDb:boolean) => {
    const dbString = process.env.DATABASE_URL;
    const logItems = ['error','closed','init','failed','completed'];

    if(startDb && dbString){
      await db.connect(dbString);
      createWorker("random-sleep",doRandomSleep,{logItems});
      createWorker("schedule-notifications",scheduleNotifications,{logItems});
      createWorker("format-notification",formatNotification,{logItems});
      createWorker("send-notification",sendNotification,{logItems});
      createWorker("auto-assign-couriers",autoAssignCouriers,{logItems});
      createWorker("bulk-edit-collection",bulkEditCollection,{logItems});
    }
  }
}
export default MyWorkers;