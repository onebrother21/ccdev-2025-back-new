import { Router } from 'express';
import { CourierOpsController } from './courier-ops.controller';
import { CourierOpsValidators } from './courier-ops.validators';
import { AuthJWT } from '../../middlewares';
import { Routes } from '../v2-routerstrings';

const CourierOpsRouter = Router();

// Apply authentication middleware to all routes
CourierOpsRouter.use(AuthJWT);

// 📌 Courier Management
CourierOpsRouter.post(Routes.CourierOps.courier.register, CourierOpsValidators.registerCourier, CourierOpsController.registerCourier);
CourierOpsRouter.put(Routes.CourierOps.courier.updateProfile, CourierOpsValidators.updateCourierProfile, CourierOpsController.updateCourierProfile);
CourierOpsRouter.get(Routes.CourierOps.courier.getProfile, CourierOpsController.getCourierProfile);
CourierOpsRouter.delete(Routes.CourierOps.courier.deleteAccount, CourierOpsController.deleteCourierProfile);
CourierOpsRouter.delete(Routes.CourierOps.courier.deleteAccount+"/x", CourierOpsController.deleteXCourierProfile);

// 📌 Order & Fulfillment
CourierOpsRouter.get(Routes.CourierOps.order.list, CourierOpsController.viewOrders);
CourierOpsRouter.post(Routes.CourierOps.order.accept, CourierOpsValidators.acceptOrder, CourierOpsController.acceptOrder);
CourierOpsRouter.post(Routes.CourierOps.order.reject, CourierOpsValidators.rejectOrder, CourierOpsController.rejectOrder);
CourierOpsRouter.post(Routes.CourierOps.order.markAsPickedUp, CourierOpsValidators.markOrderPickedUp, CourierOpsController.markOrderPickedUp);
CourierOpsRouter.post(Routes.CourierOps.order.markAsDelivered, CourierOpsValidators.markOrderDelivered, CourierOpsController.markOrderDelivered);
CourierOpsRouter.get(Routes.CourierOps.order.details, CourierOpsController.viewOrderDetails);
CourierOpsRouter.put(Routes.CourierOps.order.updateStatus, CourierOpsValidators.updateOrderStatus, CourierOpsController.updateOrderStatus);

// 📌 Route Navigation & Tracking
CourierOpsRouter.post(Routes.CourierOps.navigation.getRoute, CourierOpsValidators.getDeliveryRoute, CourierOpsController.getDeliveryRoute);
CourierOpsRouter.get(Routes.CourierOps.navigation.updateLoc,CourierOpsValidators.updateCourierProfile,CourierOpsController.updateCourierLocation);
CourierOpsRouter.get(Routes.CourierOps.navigation.trackLoc,CourierOpsValidators.trackCourierLocation,CourierOpsController.trackCourierLocation);

// 📌 Notifications & Communication
CourierOpsRouter.post(Routes.CourierOps.notifications.orderUpdate, CourierOpsController.sendOrderUpdateNotification);
CourierOpsRouter.get(Routes.CourierOps.notifications.list, CourierOpsController.viewCourierNotifications);

// 📌 Analytics & Reporting
CourierOpsRouter.get(Routes.CourierOps.analytics.earningsReport, CourierOpsController.getEarningsReport);
CourierOpsRouter.get(Routes.CourierOps.analytics.deliveryStats, CourierOpsController.getOrderDeliveryStats);
CourierOpsRouter.get(Routes.CourierOps.analytics.customerRatings, CourierOpsController.getCustomerRatings);

// 📌 Settings & Preferences
CourierOpsRouter.put(Routes.CourierOps.settings.businessHours, CourierOpsController.updateBusinessHours);
CourierOpsRouter.put(Routes.CourierOps.settings.autoAccept, CourierOpsController.setAutoAcceptOrders);
CourierOpsRouter.put(Routes.CourierOps.settings.courierPrefs, CourierOpsController.setCourierPreferences);

export default CourierOpsRouter;