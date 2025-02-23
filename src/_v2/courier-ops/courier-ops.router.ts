import { Router } from 'express';
import { AuthJWT } from '../../middlewares';
import Utils from '../../utils';

import { CourierAcctMgmtRouter } from './courier-acct';
import { CourierOrderMgmtRouter } from './courier-orders';
import { CourierLogisticsRouter } from './courier-logistics';
import { CourierNotificationsRouter } from "./courier-notifications";
import { CourierAnalyticsRouter } from "./courier-analytics";
import { CourierSettingsRouter } from "./courier-settings";

const CourierOpsRouter = (cache:Utils.RedisCache) => {
  const router = Router();
  
  // Apply authentication middleware to all routes
  router.use(AuthJWT());
  
  // 📌 Courier Account Management
  router.use(CourierAcctMgmtRouter(cache));
  
  // 📌 Order & Fulfillment
  router.use(CourierOrderMgmtRouter(cache));
  
  // 📌 Route Navigation & Tracking
  router.use(CourierLogisticsRouter(cache));
  
  // 📌 Notifications & Communication
  router.use(CourierNotificationsRouter(cache));
  
  // 📌 Analytics & Reporting
  router.use(CourierAnalyticsRouter(cache));
  
  // 📌 Settings & Preferences
  router.use(CourierSettingsRouter(cache));

  return router;
};
export { CourierOpsRouter };
export default CourierOpsRouter;