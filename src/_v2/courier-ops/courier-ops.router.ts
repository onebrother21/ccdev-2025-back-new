import { Router } from 'express';
import { CourierOpsController as ctrl } from './courier-ops.controller';
import { CourierOpsValidators as validators } from './courier-ops.validators';
import { AuthJWT,PostMiddleware } from '../../middlewares';
import { V2Routes } from '../v2-routerstrings';

const routes = V2Routes.CourierOps;
const router = Router();

// Apply authentication middleware to all routes
router.use(AuthJWT);

// 📌 Courier Management
router.post(routes.courier.register,[...validators.registerCourier, ctrl.registerCourier,...PostMiddleware]);
router.put(routes.courier.updateProfile,[...validators.updateCourierProfile, ctrl.updateCourierProfile,...PostMiddleware]);
router.get(routes.courier.getProfile,[ctrl.getCourierProfile,...PostMiddleware]);
router.delete(routes.courier.deleteAccount,[ctrl.deleteCourierProfile,...PostMiddleware]);
router.delete(routes.courier.deleteAccount+"/x",[ctrl.deleteXCourierProfile,...PostMiddleware]);

// 📌 Order & Fulfillment
router.get(routes.order.list,[ctrl.viewOrders,...PostMiddleware]);
router.post(routes.order.accept,[...validators.acceptOrder, ctrl.acceptOrder,...PostMiddleware]);
router.post(routes.order.reject,[...validators.rejectOrder, ctrl.rejectOrder,...PostMiddleware]);
router.post(routes.order.markAsPickedUp,[...validators.markOrderPickedUp, ctrl.markOrderPickedUp,...PostMiddleware]);
router.post(routes.order.markAsDelivered,[...validators.markOrderDelivered, ctrl.markOrderDelivered,...PostMiddleware]);
router.get(routes.order.details,[ctrl.viewOrderDetails,...PostMiddleware]);
router.put(routes.order.updateStatus,[...validators.updateOrderStatus, ctrl.updateOrderStatus,...PostMiddleware]);

// 📌 Route Navigation & Tracking
router.post(routes.navigation.getRoute,[...validators.getDeliveryRoute, ctrl.getDeliveryRoute,...PostMiddleware]);
router.get(routes.navigation.updateLoc,[...validators.updateCourierProfile,ctrl.updateCourierLocation,...PostMiddleware]);
router.get(routes.navigation.trackLoc,[...validators.trackCourierLocation,ctrl.trackCourierLocation,...PostMiddleware]);

// 📌 Notifications & Communication
router.post(routes.notifications.orderUpdate,[ctrl.sendOrderUpdateNotification,...PostMiddleware]);
router.get(routes.notifications.list,[ctrl.viewCourierNotifications,...PostMiddleware]);

// 📌 Analytics & Reporting
router.get(routes.analytics.earningsReport,[ctrl.getEarningsReport,...PostMiddleware]);
router.get(routes.analytics.deliveryStats,[ctrl.getOrderDeliveryStats,...PostMiddleware]);
router.get(routes.analytics.customerRatings,[ctrl.getCustomerRatings,...PostMiddleware]);

// 📌 Settings & Preferences
router.put(routes.settings.businessHours,[ctrl.updateBusinessHours,...PostMiddleware]);
router.put(routes.settings.autoAccept,[ctrl.setAutoAcceptOrders,...PostMiddleware]);
router.put(routes.settings.courierPrefs,[ctrl.setCourierPreferences,...PostMiddleware]);

export default router;