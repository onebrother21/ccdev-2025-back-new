import { Router } from 'express';
import { CourierAnalyticsController as ctrl } from './courier-analytics.controller';
import { CourierAnalyticsValidators as validators } from './courier-analytics.validators';

import { AuthJWT,PostMiddleware } from '../../../middlewares';
import { V2Routes } from '../../v2-routerstrings';
import Utils from '../../../utils';

const CourierAnalyticsRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.CourierOps.analytics;
  const router = Router();
  
  // 📌 Analytics & Reporting
  router.get(routes.earningsReport,[ctrl.getEarningsReport,...PostMiddleware]);
  router.get(routes.deliveryStats,[ctrl.getOrderDeliveryStats,...PostMiddleware]);
  router.get(routes.customerRatings,[ctrl.getCustomerRatings,...PostMiddleware]);

  return router;
};
export { CourierAnalyticsRouter };
export default CourierAnalyticsRouter;