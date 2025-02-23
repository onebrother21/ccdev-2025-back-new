import Models from '../../../models';
import Types from "../../../types";
import Utils from '../../../utils';
import Services from '../../../services';

export class CourierNotificationsService {
  // Notification Mgmt
  /** 📌 Sends an order update notification to the customer/vendor */
  static sendOrderUpdateNotification = async (orderId: string, message: string) => {
    const order = await Models.Order.findById(orderId).populate('customer');
    if (!order) throw new Utils.AppError(404, "Order not found!");

    const customer = order.customer.id;
    if (!customer) throw new Utils.AppError(400, "Customer ID missing!");

    //send cancel assignment
    const notificationMethod = Types.INotificationSendMethods.PUSH;
    const notificationData =  {orderId};
    await Services.Notification.createNotification("ORDER_UPDATE",notificationMethod,[customer],notificationData);

    return { message: "Notification sent successfully." };
  }
  /** 📌 Retrieves courier notifications (e.g., orders, system updates) */
  static viewCourierNotifications = async (courierId: string) => {
    const notifications = await Services.Notification.getNotifications(courierId);
    return notifications;
  }
}