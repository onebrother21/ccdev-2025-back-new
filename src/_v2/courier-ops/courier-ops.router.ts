import { Router } from 'express';
import { CourierOpsController as ctrl } from './courier-ops.controller';
import { CourierOpsValidators as validators } from './courier-ops.validators';
import { AuthJWT } from '../../middlewares';
import { V2Routes } from '../v2-routerstrings';

const routes = V2Routes.CourierOps;
const router = Router();

// Apply authentication middleware to all routes
router.use(AuthJWT);

// 📌 Courier Management
router.post(routes.courier.register, validators.registerCourier, ctrl.registerCourier);
router.put(routes.courier.updateProfile, validators.updateCourierProfile, ctrl.updateCourierProfile);
router.get(routes.courier.getProfile, ctrl.getCourierProfile);
router.delete(routes.courier.deleteAccount, ctrl.deleteCourierProfile);
router.delete(routes.courier.deleteAccount+"/x", ctrl.deleteXCourierProfile);

// 📌 Order & Fulfillment
router.get(routes.order.list, ctrl.viewOrders);
router.post(routes.order.accept, validators.acceptOrder, ctrl.acceptOrder);
router.post(routes.order.reject, validators.rejectOrder, ctrl.rejectOrder);
router.post(routes.order.markAsPickedUp, validators.markOrderPickedUp, ctrl.markOrderPickedUp);
router.post(routes.order.markAsDelivered, validators.markOrderDelivered, ctrl.markOrderDelivered);
router.get(routes.order.details, ctrl.viewOrderDetails);
router.put(routes.order.updateStatus, validators.updateOrderStatus, ctrl.updateOrderStatus);

// 📌 Route Navigation & Tracking
router.post(routes.navigation.getRoute, validators.getDeliveryRoute, ctrl.getDeliveryRoute);
router.get(routes.navigation.updateLoc,validators.updateCourierProfile,ctrl.updateCourierLocation);
router.get(routes.navigation.trackLoc,validators.trackCourierLocation,ctrl.trackCourierLocation);

// 📌 Notifications & Communication
router.post(routes.notifications.orderUpdate, ctrl.sendOrderUpdateNotification);
router.get(routes.notifications.list, ctrl.viewCourierNotifications);

// 📌 Analytics & Reporting
router.get(routes.analytics.earningsReport, ctrl.getEarningsReport);
router.get(routes.analytics.deliveryStats, ctrl.getOrderDeliveryStats);
router.get(routes.analytics.customerRatings, ctrl.getCustomerRatings);

// 📌 Settings & Preferences
router.put(routes.settings.businessHours, ctrl.updateBusinessHours);
router.put(routes.settings.autoAccept, ctrl.setAutoAcceptOrders);
router.put(routes.settings.courierPrefs, ctrl.setCourierPreferences);

export default router;