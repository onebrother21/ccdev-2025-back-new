import Types from "../../../types";
import { CourierNotificationsService } from "./courier-notifications.service";
export class CourierNotificationsController {
  // 📌 Sends an order update notification to the customer
  static sendOrderUpdateNotification:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.ICourier;
    try {
      const { orderId, message } = req.body;
      const data = await CourierNotificationsService.sendOrderUpdateNotification(orderId, message);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Retrieves courier notifications (e.g., orders, system updates)
  static viewCourierNotifications:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.ICourier;
    try {
      const data = await CourierNotificationsService.viewCourierNotifications(courier.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
}
export default CourierNotificationsController;