import { Router } from 'express';
import { CourierOrderMgmtController as ctrl } from './courier-orders.controller';
import { CourierOrderMgmtValidators as validators } from './courier-orders.validators';
import { AuthJWT,PostMiddleware } from '../../../middlewares';
import { V2Routes } from '../../v2-routerstrings';
import Utils from '../../../utils';

const CourierOrderMgmtRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.CourierOps.order;
  const router = Router();
  
  // 📌 Order & Fulfillment
  router.get(routes.list,[ctrl.viewOrders,...PostMiddleware]);
  router.post(routes.accept,[...validators.acceptOrder, ctrl.acceptOrder,...PostMiddleware]);
  router.post(routes.reject,[...validators.rejectOrder, ctrl.rejectOrder,...PostMiddleware]);
  router.post(routes.markAsPickedUp,[...validators.markOrderPickedUp, ctrl.markOrderPickedUp,...PostMiddleware]);
  router.post(routes.markAsDelivered,[...validators.markOrderDelivered, ctrl.markOrderDelivered,...PostMiddleware]);
  router.get(routes.details,[ctrl.viewOrderDetails,...PostMiddleware]);
  router.put(routes.updateStatus,[...validators.updateOrderStatus, ctrl.updateOrderStatus,...PostMiddleware]);
  
  return router;
};
export { CourierOrderMgmtRouter };
export default CourierOrderMgmtRouter;