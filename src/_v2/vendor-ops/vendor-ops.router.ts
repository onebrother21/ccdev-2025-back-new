import { Router } from 'express';
import { VendorOpsController as ctrl } from './vendor-ops.controller';
import { VendorOpsValidators as validators } from './vendor-ops.validators';
import { AuthJWT,PostMiddleware } from '../../middlewares';
import { Routes } from '../v2-routerstrings';

const routes = Routes.VendorOps;
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
router.post(routes.product.create,[...validators.createProduct, ctrl.createProduct,...PostMiddleware]);
router.put(routes.product.update,[...validators.updateProduct, ctrl.updateProduct,...PostMiddleware]);
router.delete(routes.product.delete,[...validators.deleteProduct, ctrl.deleteProduct,...PostMiddleware]);
router.delete(routes.product.delete+"/x",[...validators.deleteProduct, ctrl.deleteXProduct,...PostMiddleware]);
router.get(routes.product.list,[ctrl.listVendorProducts,...PostMiddleware]);

// 📌 Order & Fulfillment
router.get(routes.order.list, ctrl.viewOrders);
router.post(routes.order.accept,[...validators.acceptOrder, ctrl.acceptOrder]);
router.post(routes.order.reject,[...validators.rejectOrder, ctrl.rejectOrder]);
router.post(routes.order.markReady,[...validators.markOrderReady, ctrl.markOrderReady]);
router.get(routes.order.details, ctrl.viewOrderDetails);
router.put(routes.order.updateStatus,[...validators.updateOrderStatus, ctrl.updateOrderStatus]);

// 📌 Courier Assignment & Delivery
router.post(routes.courier.assign,[...validators.assignCourierManually, ctrl.assignCourierManually]);
router.get(routes.courier.track,ctrl.trackAssignedCouriers);
router.get(routes.courier.pending,ctrl.viewPendingCourierAssignments);
router.delete(routes.courier.cancel,[...validators.cancelCourierAssignment, ctrl.cancelCourierAssignment]);

// 📌 Notifications & Communication
router.post(routes.notifications.orderUpdate, ctrl.sendOrderUpdateNotification);
router.post(routes.notifications.broadcast, ctrl.sendBroadcastNotification);
router.get(routes.notifications.list, ctrl.viewVendorNotifications);

// 📌 Analytics & Reporting
router.get(routes.analytics.salesReport, ctrl.getSalesReport);
router.get(routes.analytics.orderTrends, ctrl.getOrderTrends);
router.get(routes.analytics.customerInsights, ctrl.getCustomerInsights);

// 📌 Settings & Preferences
router.put(routes.settings.businessHours, ctrl.updateBusinessHours);
router.put(routes.settings.autoAccept, ctrl.setAutoAcceptOrders);
router.put(routes.settings.courierPrefs, ctrl.setCourierPreferences);

export default router;