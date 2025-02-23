import { Router } from 'express';
import { CourierLogisticsController as ctrl } from './courier-logistics.controller';
import { CourierLogisticsValidators as validators } from './courier-logistics.validators';
import { AuthJWT,PostMiddleware } from '../../../middlewares';
import { V2Routes } from '../../v2-routerstrings';
import Utils from '../../../utils';

const CourierLogisticsRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.CourierOps.navigation;
  const router = Router();
  
  // 📌 Route Navigation & Tracking
  router.get(routes.FindAvailable,[...validators.FindAvailableCouriers,ctrl.FindAvailableCouriers,...PostMiddleware]);
  router.post(routes.AssignCourier,[...validators.AssignCourier,ctrl.AssignCourier,...PostMiddleware]);
  router.post(routes.getRoute,[...validators.getDeliveryRoute, ctrl.getDeliveryRoute,...PostMiddleware]);
  router.get(routes.updateLoc,[...validators.updateCourierLocation,ctrl.updateCourierLocation,...PostMiddleware]);
  router.get(routes.trackLoc,[...validators.trackCourierLocation,ctrl.trackCourierLocation,...PostMiddleware]);

  return router;
};
export { CourierLogisticsRouter };
export default CourierLogisticsRouter;