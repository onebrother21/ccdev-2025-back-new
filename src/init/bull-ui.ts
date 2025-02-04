import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import MyWorkers from "../workers";

const workers = new MyWorkers();
export const getBullUiServerAdapter = () => {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/jobs');
  createBullBoard({
    queues: [
      //new BullMQAdapter(workers.queues.doRandomSleep),
      new BullMQAdapter(workers.queues.scheduleNotifications),
      new BullMQAdapter(workers.queues.processNotifications)
    ],
    serverAdapter,
    options: {
      uiConfig: {
        pollingInterval:{showSetting:true,forceInterval:10 * 60 * 1000},
        miscLinks: [{text: 'Logout', url: '/jobs/logout'}],
      },
    },
  });
  return {serverAdapter};
};