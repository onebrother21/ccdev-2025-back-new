import { Router } from 'express';
import { VendorOpsController as ctrl } from './vendor-ops.controller';
import { VendorOpsValidators as validators } from './vendor-ops.validators';
import { AuthJWT,PostMiddleware } from '../../middlewares';
import { V2Routes } from '../v2-routerstrings';
import { RedisCache } from 'init/redis-cache';

const VendorOpsRouter = (cache:RedisCache) => {
  const routes = V2Routes.VendorOps;
  const router = Router();

  // Apply authentication middleware to all routes
  router.use(AuthJWT);

  // 📌 Vendor Management
  router.post(routes.profile.register,[...validators.registerVendor,ctrl.registerVendor,...PostMiddleware]);
  router.put(routes.profile.update,[...validators.updateVendorProfile, ctrl.updateVendorProfile,...PostMiddleware]);
  router.get(routes.profile.get,[ctrl.getVendorProfile,...PostMiddleware]);
  router.delete(routes.profile.delete,[ctrl.deleteVendorProfile,...PostMiddleware]);
  router.delete(routes.profile.deleteX,[ctrl.deleteXVendorProfile,...PostMiddleware]);

  // 📌 Product Management
  router.post(routes.products.create,[...validators.createProduct, ctrl.createProduct,...PostMiddleware]);
  router.put(routes.products.update,[...validators.updateProduct, ctrl.updateProduct,...PostMiddleware]);
  router.delete(routes.products.delete,[...validators.deleteProduct, ctrl.deleteProduct,...PostMiddleware]);
  router.delete(routes.products.delete+"/x",[...validators.deleteProduct, ctrl.deleteXProduct,...PostMiddleware]);
  router.get(routes.products.list,[ctrl.listVendorProducts,...PostMiddleware]);

  // 📌 Order & Fulfillment
  router.get(routes.order.list,[ctrl.viewOrders,...PostMiddleware]);
  router.post(routes.order.accept,[...validators.acceptOrder, ctrl.acceptOrder,...PostMiddleware]);
  router.post(routes.order.reject,[...validators.rejectOrder, ctrl.rejectOrder,...PostMiddleware]);
  router.post(routes.order.markReady,[...validators.markOrderReady, ctrl.markOrderReady,...PostMiddleware]);
  router.get(routes.order.details,[ctrl.viewOrderDetails,...PostMiddleware]);
  router.put(routes.order.updateStatus,[...validators.updateOrderStatus, ctrl.updateOrderStatus,...PostMiddleware]);

  // 📌 Courier Assignment & Delivery
  router.post(routes.courier.assign,[...validators.assignCourierManually, ctrl.assignCourierManually,...PostMiddleware]);
  router.get(routes.courier.track,[ctrl.trackAssignedCouriers,...PostMiddleware]);
  router.get(routes.courier.pending,[ctrl.viewPendingCourierAssignments,...PostMiddleware]);
  router.delete(routes.courier.cancel,[...validators.cancelCourierAssignment, ctrl.cancelCourierAssignment,...PostMiddleware]);

  // 📌 Notifications & Communication
  router.post(routes.notifications.orderUpdate,[ctrl.sendOrderUpdateNotification,...PostMiddleware]);
  router.post(routes.notifications.broadcast,[ctrl.sendBroadcastNotification,...PostMiddleware]);
  router.get(routes.notifications.list,[ctrl.viewVendorNotifications,...PostMiddleware]);

  // 📌 Analytics & Reporting
  router.get(routes.analytics.salesReport,[ctrl.getSalesReport,...PostMiddleware]);
  router.get(routes.analytics.orderTrends,[ctrl.getOrderTrends,...PostMiddleware]);
  router.get(routes.analytics.customerInsights,[ctrl.getCustomerInsights,...PostMiddleware]);

  // 📌 Settings & Preferences
  router.put(routes.settings.businessHours,[ctrl.updateBusinessHours,...PostMiddleware]);
  router.put(routes.settings.autoAccept,[ctrl.setAutoAcceptOrders,...PostMiddleware]);
  router.put(routes.settings.courierPrefs,[ctrl.setCourierPreferences,...PostMiddleware]);

  return router;
};
export { VendorOpsRouter };
export default VendorOpsRouter;