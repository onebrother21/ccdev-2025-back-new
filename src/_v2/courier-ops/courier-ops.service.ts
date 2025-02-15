import Models from '../../models';
import Types from "../../types";
import Utils from '../../utils';
import Services from '../../services';

export class CourierOpsService {
  /** 📌 Courier Management */
  /** 📌 Creates courier profile */
  static registerCourier = async (user:Types.IUser,data:any) => {
    const role = Types.IProfileTypes.VENDOR;
    const courier = new Models.Courier({
      ...data,
      mgr:user._id,
      users:[user._id],
      name:user.name.first + " " + user.name.last,
      displayName:user.username,
      location:{type:"Point",coordinates:data.location}
    });
    await courier.setStatus(Types.IProfileStatuses.NEW,null,true);
    user.profiles[role] = courier.id;
    await user.save();
    //send ACCOUNT_UPDATE
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {accountNo:courier.id};
    await Services.Notification.createNotification("ACCOUNT_UPDATE",notificationMethod,[user.id],notificationData);
    return { ok:true };
  };
  /** 📌 Updates courier profile */
  static updateCourierProfile = async (courierId: string, data: any) => {
    const courier = await Models.Courier.findByIdAndUpdate(courierId, data, { new: true });
    if (!courier) throw new Utils.AppError(404, "Courier not found!");
    return { courier };
  };
  /** 📌 Fetches and popluates courier profile */
  static getCourierProfile = async (courierId: string) => {return await Models.Courier.findById(courierId);};
  /** 📌 Mark a courier profile for deletion */
  static deleteCourierProfile = async (courierId: string) => {
    const courier = await Models.Courier.findById(courierId);
    if (!courier) throw new Utils.AppError(404, "Courier not found!");
    await courier.setStatus(Types.IProfileStatuses.DELETED,null,true);
    return { message: "Courier account deleted successfully." };
  };
  /** 📌 Mark a courier profile for deletion */
  static deleteXCourierProfile = async (courierId: string) => {
    const courier = await Models.Courier.findByIdAndDelete(courierId);
    if (!courier) throw new Utils.AppError(404, "Courier not found!");
    return { message: "Courier account deleted successfully." };
  };
  /** 📌 Updates a courier avaiability */
  static setCourierAvailability = async (courierId: string) => {
    const courier = await Models.Courier.findById(courierId);
    if (!courier) throw new Utils.AppError(404, "Courier not found!");
    await courier.setStatus(Types.IProfileStatuses.ACTIVE,null,true);
    return { message: "Courier set to avaiable." };
  };
  //Order & Delivery Management
  /** 📌 To retrieve all orders currently assigned to the courier. */
  static viewAssignedOrders = async (courierId: string) => {return await Models.Order.find({ courier: courierId }).populate('customers');}
  /** 📌 To accept an order */
  static acceptOrderAssignment = async (courierId: string, orderId: string) => {
    const order = await Models.Order.findOne({ _id: orderId, courier: courierId });
    if (!order) throw new Utils.AppError(404, "Order not found!");
    await order.setStatus(Types.IOrderStatuses.ACCEPTED,null,true);
    return order;
  };
  /** 📌 To reject an order */
  static rejectOrderAssignment = async (courierId: string, orderId: string)  => {
    const order = await Models.Order.findOne({ _id: orderId, courier: courierId });
    if (!order) throw new Utils.AppError(404, "Order not found!");
    await order.setStatus(Types.IOrderStatuses.REJECTED,null,true);
    return order;
  };
  /** 📌 To an order as picked up from the courier. */
  static markOrderPickedUp = async (courierId: string, orderId: string) => {
    const order = await Models.Order.findOne({ _id: orderId, courier: courierId });
    if (!order) throw new Utils.AppError(404, "Order not found!");
    await order.setStatus(Types.IOrderStatuses.READY,null,true);
    return order;
  };
  /** 📌 To mark an order as successfully delivered. */
  static markOrderDelivered = async (courierId: string, orderId: string) => {
    const order = await Models.Order.findOne({ _id: orderId, courier: courierId });
    if (!order) throw new Utils.AppError(404, "Order not found!");
    await order.setStatus(Types.IOrderStatuses.READY,null,true);
    return order;
  };
  /** 📌 To view order details */
  static viewOrderDetails = async (courierId: string, orderId: string) => {return await Models.Order.findOne({ _id: orderId, courier: courierId }).populate('customer');}
  /** 📌 To update an order's status */
  static updateOrderStatus = async (courierId: string, orderId: string, status: string) => {return await Models.Order.findOneAndUpdate({ _id: orderId, courier: courierId }, { status }, { new: true });}
  
  //Navigation & Tracking
  /** 📌 Retrieves the optimal route from the vendor to the customer. */
  static async getDeliveryRoute(orderId: string) {
    const order = await Models.Order.findById(orderId).populate('vendor customer');
    if (!order) throw new Utils.AppError(404, 'Order not found.');
    const route = {};//await GeoService.getOptimalRoute(order.vendor.location, order.customer.location);
    return { orderId, route };
  }
  /** 📌 Updates the courier’s real-time location. */
  static async updateCourierLocation(courierId: string, location: { lat: number; lng: number }) {
    const courier = await Models.Courier.findByIdAndUpdate(courierId, { location }, { new: true });
    if (!courier) throw new Utils.AppError(404, 'Courier not found.');
    return { courierId, location };
  }
  /** 📌 Retrieves a courier’s current location (for customers/vendors). */
  static async trackCourierLocation(courierId: string) {
    const courier = await Models.Courier.findById(courierId).select('location');
    if (!courier) throw new Utils.AppError(404, 'Courier not found.');
    return { courierId, location: courier.location };
  } 
  // Earnings & Analytics
  /** 📌 Retrieves courier earnings over a specified period. */
  static getEarningsReport = async (courierId: string, startDate: string, endDate: string) => {
    const report = await Services.Reports.getEarningsReport(courierId,new Date(startDate),new Date(endDate));
    return report;
  }
  /** 📌 Analyzes delivery times and success rates. */
  static getOrderDeliveryStats = async (courierId: string) => {
    const trends = await Services.Reports.getOrderDeliveryStats(courierId);
    return trends;
  }
  /** 📌 Retrieves customer ratings and feedback for the courier. */
  static getCustomerRatings = async (courierId: string) => {
    const insights = await Services.Reports.getCustomerRatings(courierId);
    return insights;
  }
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

  // Courier settings
  /** 📌 Updates courier business hours */
  static updateBusinessHours = async (courierId: string, hours: { open: string, close: string }) => {
    const courier = await Models.Vendor.findByIdAndUpdate(courierId, { businessHours: hours }, { new: true });
    if (!courier) throw new Utils.AppError(404, "Vendor not found!");
    return { message: "Business hours updated successfully." };
  }
  /** 📌 Enables or disables automatic order acceptance */
  static setAutoAcceptOrders = async (courierId: string, autoAccept: boolean) => {
    const courier = await Models.Vendor.findByIdAndUpdate(courierId, { autoAcceptOrders: autoAccept }, { new: true });
    if (!courier) throw new Utils.AppError(404, "Vendor not found!");
    return { message: `Auto-accept orders ${autoAccept ? "enabled" : "disabled"}.` };
  }
  /** 📌 Defines preferred customers or delivery conditions */
  static setCourierPreferences = async (courierId: string, preferences: any) => {
    const courier = await Models.Vendor.findByIdAndUpdate(courierId, { courierPreferences: preferences }, { new: true });
    if (!courier) throw new Utils.AppError(404, "Vendor not found!");
    return { message: "Courier preferences updated successfully." };
  }
}