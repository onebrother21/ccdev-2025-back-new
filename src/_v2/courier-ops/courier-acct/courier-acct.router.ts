import { Router } from 'express';
import { CourierAcctMgmtController as ctrl } from './courier-acct.controller';
import { CourierAcctMgmtValidators as validators } from './courier-acct.validators';
import { PostMiddleware } from '../../../middlewares';
import { V2Routes } from '../../v2-routerstrings';
import Utils from '../../../utils';

const CourierAcctMgmtRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.CourierOps.courier;
  const router = Router();  
  // 📌 Courier Management
  router.post(routes.register,[...validators.registerCourier, ctrl.registerCourier,...PostMiddleware]);
  router.put(routes.updateProfile,[...validators.updateCourierProfile, ctrl.updateCourierProfile,...PostMiddleware]);
  router.get(routes.getProfile,[ctrl.getCourierProfile,...PostMiddleware]);
  router.delete(routes.deleteAccount,[ctrl.deleteCourierProfile,...PostMiddleware]);
  router.delete(routes.deleteAccount+"/x",[ctrl.deleteXCourierProfile,...PostMiddleware]);

  return router;
};
export { CourierAcctMgmtRouter };
export default CourierAcctMgmtRouter;