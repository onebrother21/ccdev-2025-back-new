import { Router } from 'express';
import { CourierNotificationsController as ctrl } from './courier-notifications.controller';
import { CourierNotificationsValidators as validators } from './courier-notifications.validators';

import { PostMiddleware } from '../../../middlewares';
import { V2Routes } from '../../v2-routerstrings';
import Utils from '../../../utils';

const CourierNotificationsRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.CourierOps.notifications;
  const router = Router();
  
  // 📌 Notifications & Communication
  router.post(routes.orderUpdate,[ctrl.sendOrderUpdateNotification,...PostMiddleware]);
  router.get(routes.list,[ctrl.viewCourierNotifications,...PostMiddleware]);

  return router;
};
export { CourierNotificationsRouter };
export default CourierNotificationsRouter;