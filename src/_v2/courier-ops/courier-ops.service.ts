import { Courier,Vendor,Customer,Order } from '../../models';
import { NotificationService,ReportsService } from '../../services';
import { AppError } from '../../utils';
import * as AllTypes from "../../types";

export class CourierOpsService {
  /** 📌 Courier Management */
  /** 📌 Creates courier profile */
  static registerCourier = async (user:AllTypes.IUser,data:any) => {
    const role = AllTypes.IProfileTypes.VENDOR;
    const courier = new Courier({
      ...data,
      mgr:user._id,
      users:[user._id],
      name:user.name.first + " " + user.name.last,
      displayName:user.username,
      location:{type:"Point",coordinates:data.location}
    });
    await courier.setStatus(AllTypes.IProfileStatuses.NEW,null,true);
    user.profiles[role] = courier.id;
    await user.save();
    //send ACCOUNT_UPDATE
    const notificationMethod = AllTypes.INotificationSendMethods.EMAIL;
    const notificationData =  {accountNo:courier.id};
    await NotificationService.createNotification("ACCOUNT_UPDATE",notificationMethod,[user.id],notificationData);
    return { ok:true };
  };
  /** 📌 Updates courier profile */
  static updateCourierProfile = async (courierId: string, data: any) => {
    const courier = await Courier.findByIdAndUpdate(courierId, data, { new: true });
    if (!courier) throw new AppError(404, "Courier not found!");
    return { courier };
  };
  /** 📌 Fetches and popluates courier profile */
  static getCourierProfile = async (courierId: string) => {return await Courier.findById(courierId);};
  /** 📌 Mark a courier profile for deletion */
  static deleteCourierProfile = async (courierId: string) => {
    const courier = await Courier.findById(courierId);
    if (!courier) throw new AppError(404, "Courier not found!");
    await courier.setStatus(AllTypes.IProfileStatuses.DELETED,null,true);
    return { message: "Courier account deleted successfully." };
  };
  /** 📌 Mark a courier profile for deletion */
  static deleteXCourierProfile = async (courierId: string) => {
    const courier = await Courier.findByIdAndDelete(courierId);
    if (!courier) throw new AppError(404, "Courier not found!");
    return { message: "Courier account deleted successfully." };
  };
  /** 📌 Updates a courier avaiability */
  static setCourierAvailability = async (courierId: string) => {
    const courier = await Courier.findById(courierId);
    if (!courier) throw new AppError(404, "Courier not found!");
    await courier.setStatus(AllTypes.IProfileStatuses.ACTIVE,null,true);
    return { message: "Courier set to avaiable." };
  };
  //Order & Delivery Management
  /** 📌 To retrieve all orders currently assigned to the courier. */
  static viewAssignedOrders = async (courierId: string) => {return await Order.find({ courier: courierId }).populate('customers');}
  /** 📌 To accept an order */
  static acceptOrderAssignment = async (courierId: string, orderId: string) => {
    const order = await Order.findOne({ _id: orderId, courier: courierId });
    if (!order) throw new AppError(404, "Order not found!");
    await order.setStatus(AllTypes.IOrderStatuses.ACCEPTED,null,true);
    return order;
  };
  /** 📌 To reject an order */
  static rejectOrderAssignment = async (courierId: string, orderId: string)  => {
    const order = await Order.findOne({ _id: orderId, courier: courierId });
    if (!order) throw new AppError(404, "Order not found!");
    await order.setStatus(AllTypes.IOrderStatuses.REJECTED,null,true);
    return order;
  };
  /** 📌 To an order as picked up from the courier. */
  static markOrderPickedUp = async (courierId: string, orderId: string) => {
    const order = await Order.findOne({ _id: orderId, courier: courierId });
    if (!order) throw new AppError(404, "Order not found!");
    await order.setStatus(AllTypes.IOrderStatuses.READY,null,true);
    return order;
  };
  /** 📌 To mark an order as successfully delivered. */
  static markOrderDelivered = async (courierId: string, orderId: string) => {
    const order = await Order.findOne({ _id: orderId, courier: courierId });
    if (!order) throw new AppError(404, "Order not found!");
    await order.setStatus(AllTypes.IOrderStatuses.READY,null,true);
    return order;
  };
  /** 📌 To view order details */
  static viewOrderDetails = async (courierId: string, orderId: string) => {return await Order.findOne({ _id: orderId, courier: courierId }).populate('customer');}
  /** 📌 To update an order's status */
  static updateOrderStatus = async (courierId: string, orderId: string, status: string) => {return await Order.findOneAndUpdate({ _id: orderId, courier: courierId }, { status }, { new: true });}
  
  //Navigation & Tracking
  /** 📌 Retrieves the optimal route from the vendor to the customer. */
  static async getDeliveryRoute(orderId: string) {
    const order = await Order.findById(orderId).populate('vendor customer');
    if (!order) throw new AppError(404, 'Order not found.');
    const route = {};//await GeoService.getOptimalRoute(order.vendor.location, order.customer.location);
    return { orderId, route };
  }
  /** 📌 Updates the courier’s real-time location. */
  static async updateCourierLocation(courierId: string, location: { lat: number; lng: number }) {
    const courier = await Courier.findByIdAndUpdate(courierId, { location }, { new: true });
    if (!courier) throw new AppError(404, 'Courier not found.');
    return { courierId, location };
  }
  /** 📌 Retrieves a courier’s current location (for customers/vendors). */
  static async trackCourierLocation(courierId: string) {
    const courier = await Courier.findById(courierId).select('location');
    if (!courier) throw new AppError(404, 'Courier not found.');
    return { courierId, location: courier.location };
  } 
  // Earnings & Analytics
  /** 📌 Retrieves courier earnings over a specified period. */
  static getEarningsReport = async (courierId: string, startDate: string, endDate: string) => {
    const report = await ReportsService.getEarningsReport(courierId,new Date(startDate),new Date(endDate));
    return report;
  }
  /** 📌 Analyzes delivery times and success rates. */
  static getOrderDeliveryStats = async (courierId: string) => {
    const trends = await ReportsService.getOrderDeliveryStats(courierId);
    return trends;
  }
  /** 📌 Retrieves customer ratings and feedback for the courier. */
  static getCustomerRatings = async (courierId: string) => {
    const insights = await ReportsService.getCustomerRatings(courierId);
    return insights;
  }
  // Notification Mgmt
  /** 📌 Sends an order update notification to the customer/vendor */
  static sendOrderUpdateNotification = async (orderId: string, message: string) => {
    const order = await Order.findById(orderId).populate('customer');
    if (!order) throw new AppError(404, "Order not found!");

    const customer = order.customer.id;
    if (!customer) throw new AppError(400, "Customer ID missing!");

    //send cancel assignment
    const notificationMethod = AllTypes.INotificationSendMethods.PUSH;
    const notificationData =  {orderId};
    await NotificationService.createNotification("ORDER_UPDATE",notificationMethod,[customer],notificationData);

    return { message: "Notification sent successfully." };
  }
  /** 📌 Retrieves courier notifications (e.g., orders, system updates) */
  static viewCourierNotifications = async (courierId: string) => {
    const notifications = await NotificationService.getNotifications(courierId);
    return notifications;
  }

  // Courier settings
  /** 📌 Updates courier business hours */
  static updateBusinessHours = async (courierId: string, hours: { open: string, close: string }) => {
    const courier = await Vendor.findByIdAndUpdate(courierId, { businessHours: hours }, { new: true });
    if (!courier) throw new AppError(404, "Vendor not found!");
    return { message: "Business hours updated successfully." };
  }
  /** 📌 Enables or disables automatic order acceptance */
  static setAutoAcceptOrders = async (courierId: string, autoAccept: boolean) => {
    const courier = await Vendor.findByIdAndUpdate(courierId, { autoAcceptOrders: autoAccept }, { new: true });
    if (!courier) throw new AppError(404, "Vendor not found!");
    return { message: `Auto-accept orders ${autoAccept ? "enabled" : "disabled"}.` };
  }
  /** 📌 Defines preferred customers or delivery conditions */
  static setCourierPreferences = async (courierId: string, preferences: any) => {
    const courier = await Vendor.findByIdAndUpdate(courierId, { courierPreferences: preferences }, { new: true });
    if (!courier) throw new AppError(404, "Vendor not found!");
    return { message: "Courier preferences updated successfully." };
  }
}