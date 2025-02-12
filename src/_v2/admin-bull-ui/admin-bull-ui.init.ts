import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { createQueue } from '../../utils';

const getQueueAdaptors = (queueNames:string[]) => {
  const adapters = [];
  for(const queue of queueNames) adapters.push(new BullMQAdapter(createQueue(queue)));
  return adapters;
};
export const getBullBoardRouter = ({refreshInterval,basePath,queueNames,logout}:any) => {
  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath(basePath);
  createBullBoard({
    queues:getQueueAdaptors(queueNames),
    serverAdapter,
    options: {
      uiConfig: {
        pollingInterval:{showSetting:true,forceInterval:refreshInterval},
        miscLinks: [
          ...logout?[{text: 'Logout', url: '/jobs/logout'}]:[]
        ]
      },
    },
  });
  return serverAdapter.getRouter();
}