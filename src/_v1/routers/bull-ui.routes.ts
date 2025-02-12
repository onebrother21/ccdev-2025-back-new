import express from 'express';
import { bullUIController } from '../controllers';
import { adminValidators } from '../../validators';
import {
  AuthJWT,
  CheckUserRole,
  CheckAdminScopes,
} from '../../middlewares';

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { createQueue } from '../../utils';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/jobs');
createBullBoard({
  queues: [
    new BullMQAdapter(createQueue("random-sleep")),
    new BullMQAdapter(createQueue("schedule-notifications")),
    new BullMQAdapter(createQueue("format-notification")),
    new BullMQAdapter(createQueue("send-notification")),
    new BullMQAdapter(createQueue("auto-assign-couriers")),
  ],
  serverAdapter,
  options: {
    uiConfig: {
      pollingInterval:{showSetting:true,forceInterval:10 * 60 * 1000},
      miscLinks: [{text: 'Logout', url: '/jobs/logout'}],
    },
  },
});

const router = express.Router();

router.get('/login',bullUIController.RenderLogin);
router.post('/login',bullUIController.Login);
router.get('/logout',bullUIController.Logout);
router.use('/',bullUIController.CheckLogin,serverAdapter.getRouter());
router.post('/',bullUIController.CheckLogin,bullUIController.PostJob);

export default router;