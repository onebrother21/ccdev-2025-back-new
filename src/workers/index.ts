import dotenv from 'dotenv';
dotenv.config();

import { Queue, QueueOptions } from 'bullmq';
import { redisConfig } from '../utils';
import db from '../init/db';

// Configuration interface
interface INotificationQueueConfig {
  interval: number; // Repeat job every 'interval' minutes
}

const dbString = process.env.DATABASE_URL;
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const host = process.env.HOST;
const connection = redisConfig();
const createQueue = (name:string,opts:any) => new Queue(name,opts);

class MyWorkers {
  opts:QueueOptions = {
    connection,
    skipVersionCheck:true,
    defaultJobOptions:{
      removeOnComplete: {
        //age: 3600, // keep up to 1 hour
        count: 10, // keep up to 1000 jobs
      },
      removeOnFail: {
        age: 24 * 3600, // keep up to 24 hours
      },
    },
  }
  queues:Record<string,Queue> = {};
  constructor(){
    const scheduleNotifications = createQueue('schedule-notifications',this.opts);
    scheduleNotifications.on("resumed",() => console.log('⚡️ [schedule-notifications-queue]: Resumed -> '))
    scheduleNotifications.on('error',info => console.log('⚡️ [schedule-notifications-queue]: Error -> ',info))
    scheduleNotifications.on("ioredis:close",() => console.log('⚡️ [schedule-notifications-queue]: IORedis Closed -> '))
    scheduleNotifications.on("cleaned",info => console.log('⚡️ [schedule-notifications-queue]: Cleaned -> ',info))
    scheduleNotifications.on("progress",info => console.log('⚡️ [schedule-notifications-queue]: Progess -> ',info))
    scheduleNotifications.on('waiting',info => console.log('⚡️ [schedule-notifications-queue]: Waiting -> ',info))
    scheduleNotifications.on('removed',info => console.log('⚡️ [schedule-notifications-queue]: Removed -> ',info));

    const processNotifications = createQueue('process-notifications',this.opts);
    processNotifications.on("resumed",() => console.log('⚡️ [process-notifications-queue]: Resumed -> '))
    processNotifications.on('error',info => console.log('⚡️ [process-notifications-queue]: Error -> ',info))
    processNotifications.on("ioredis:close",() => console.log('⚡️ [process-notifications-queue]: IORedis Closed -> '))
    processNotifications.on("cleaned",info => console.log('⚡️ [process-notifications-queue]: Cleaned -> ',info))
    processNotifications.on("progress",info => console.log('⚡️ [process-notifications-queue]: Progess -> ',info))
    processNotifications.on('waiting',info => console.log('⚡️ [process-notifications-queue]: Waiting -> ',info))
    processNotifications.on('removed',info => console.log('⚡️ [process-notifications-queue]: Removed -> ',info))
    
    this.queues = {
      scheduleNotifications,
      processNotifications,
      //doRandomSleep:createQueue('random-sleep',this.opts),
    };
  }
  init = async (startDb:boolean) => {
    if(startDb) await db.connect(dbString);
    //await import("./random-sleep");
    await import("./schedule-notifications");
    await import("./process-notifications");
  }
}
export default MyWorkers;