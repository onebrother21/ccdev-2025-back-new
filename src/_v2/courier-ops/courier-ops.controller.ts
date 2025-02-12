import { CourierOpsService } from "./courier-ops.service";
import * as AllTypes from "../../types";


export class CourierOpsController {
  // Courier Management
  static registerCourier:IHandler = async (req,res,next) => {
    const user = req.user as AllTypes.IUser;
    try {
      res.locals.success = true;
      res.locals.message = "You have registered a new courier profile!";
      res.locals.data = await CourierOpsService.registerCourier(user,req.body);
      next();
    } catch (e) { next(e); }
  };
  static updateCourierProfile:IHandler = async (req,res,next) => {
    const Courier = req.profile as AllTypes.ICourier;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.updateCourierProfile(Courier.id, req.body);
      next();
    } catch (e) { next(e); }
  };
  static getCourierProfile:IHandler = async (req,res,next) => {
    const Courier = req.profile as AllTypes.ICourier;
    try {
        res.locals.success = true;
        res.locals.data = await CourierOpsService.getCourierProfile(Courier.id);
        next();
    } catch (e) { next(e); }
  };
  static deleteCourierProfile:IHandler = async (req,res,next) => {
    const Courier = req.profile as AllTypes.ICourier;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.deleteCourierProfile(Courier.id);
      next();
    } catch (e) { next(e); }
  };
  static deleteXCourierProfile:IHandler = async (req,res,next) => {
    const Courier = req.profile as AllTypes.ICourier;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.deleteXCourierProfile(Courier.id);
      next();
    } catch (e) { next(e); }
  };

  // Order & Fulfillment
  static viewOrders:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.viewAssignedOrders(courier.id);
      next();
    } catch (e) { next(e); }
  };
  static acceptOrder:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.acceptOrderAssignment(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static rejectOrder:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.rejectOrderAssignment(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static markOrderPickedUp:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.markOrderPickedUp(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static markOrderDelivered:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.markOrderDelivered(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static viewOrderDetails:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.viewOrderDetails(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static updateOrderStatus:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOpsService.updateOrderStatus(courier.id, req.params.orderId, req.body.status);
      next();
    } catch (e) { next(e); }
  };
  // 📌 Sends an order update notification to the customer
  static getDeliveryRoute:IHandler = async (req,res,next) => {
    try {
        res.locals.success = true;
        res.locals.data = await CourierOpsService.getDeliveryRoute(req.params.orderId);
        next();
    } catch (e) { throw e; }
  };
  // 📌 Sends an order update notification to the customer
  static updateCourierLocation:IHandler = async (req,res,next) => {
    try {
        res.locals.success = true;
        res.locals.data = await CourierOpsService.updateCourierLocation(req.user.id, req.body.location);
        next();
    } catch (e) { throw e; }
  };
  // 📌 Sends an order update notification to the customer
  static trackCourierLocation:IHandler = async (req,res,next) => {
    try {
        res.locals.success = true;
        res.locals.data = await CourierOpsService.trackCourierLocation(req.params.courierId);
        next();
    } catch (e) { throw e; }
  };
  // 📌 Sends an order update notification to the customer
  static sendOrderUpdateNotification:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.ICourier;
    try {
      const { orderId, message } = req.body;
      const data = await CourierOpsService.sendOrderUpdateNotification(orderId, message);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Retrieves courier notifications (e.g., orders, system updates)
  static viewCourierNotifications:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.ICourier;
    try {
      const data = await CourierOpsService.viewCourierNotifications(courier.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Retrieves courier sales data for a given period
  static getEarningsReport:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.ICourier;
    try {
      const { startDate, endDate } = req.query;
      const data = await CourierOpsService.getEarningsReport(courier.id, startDate as string, endDate as string);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Analyzes order volume and peak hours
  static getOrderDeliveryStats:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.ICourier;
    try {
      const data = await CourierOpsService.getOrderDeliveryStats(courier.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Provides insights on customer behavior and preferences
  static getCustomerRatings:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.ICourier;
    try {
      const data = await CourierOpsService.getCustomerRatings(courier.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Updates courier business hours
  static updateBusinessHours:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.ICourier;
    try {
      const { open, close } = req.body;
      const data = await CourierOpsService.updateBusinessHours(courier.id, { open, close });
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Enables or disables automatic order acceptance
  static setAutoAcceptOrders:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.ICourier;
    try {
      const { autoAccept } = req.body;
      const data = await CourierOpsService.setAutoAcceptOrders(courier.id, autoAccept);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Defines preferred couriers or delivery conditions
  static setCourierPreferences:IHandler = async (req,res,next) => {
    const courier = req.profile as AllTypes.ICourier;
    try {
      const { preferences } = req.body;
      const data = await CourierOpsService.setCourierPreferences(courier.id, preferences);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
}
export default CourierOpsController;