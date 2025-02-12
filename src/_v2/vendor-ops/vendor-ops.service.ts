import { Vendor,Product,Order,Courier } from '../../models';
import { NotificationService ,ReportsService } from '../../services';
import { AppError } from '../../utils';
import * as AllTypes from "../../types";

const queryOpts = { new:true,runValidators: true,context:'query' };

export class VendorOpsService {
  /** 📌 Vendor Management */
  /** 📌 Creates vendor profile */
  static registerVendor = async (user:AllTypes.IUser,data:any) => {
    const role = AllTypes.IProfileTypes.VENDOR;
    const vendor = new Vendor({
      ...data,
      mgr:user._id,
      users:[user._id],
      location:{type:"Point",coordinates:data.location}
    });
    await vendor.save();
    user.profiles[role] = vendor.id;data
    await user.save();
    //send ACCOUNT_UPDATE
    const notificationMethod = AllTypes.INotificationSendMethods.EMAIL;
    const notificationData =  {accountNo:vendor.id};
    await NotificationService.createNotification("ACCOUNT_UPDATE",notificationMethod,[user.id],notificationData);
    return true;
  };
  /** 📌 Updates vendor profile */
  static updateVendorProfile = async (vendorId:string,data:any) => {
    if(data.location) data.location = {type:"Point",coordinates:data.location};
    const vendor = await Vendor.findByIdAndUpdate(vendorId,data,queryOpts);
    if (!vendor) throw new AppError(404,"Vendor not found!");
    return vendor;
  };
  /** 📌 Fetches and popluates vendor profile */
  static getVendorProfile = async (vendorId: string) => await Vendor.findById(vendorId);
  /** 📌 Mark a vendor profile for deletion */
  static deleteVendorProfile = async (vendorId: string) => {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) throw new AppError(404,"Vendor not found!");
    await vendor.setStatus(AllTypes.IProfileStatuses.DELETED,null,true);
    return true;
  };
  /** 📌 Mark a vendor profile for deletion */
  static deleteXVendorProfile = async (vendorId: string) => {
    const vendor = await Vendor.findByIdAndDelete(vendorId);
    if (!vendor) throw new AppError(404, "Vendor not found!");
    return true;
  };
  // Product Management
  /** 📌 Creates a product */
  static createProduct = async (vendor:AllTypes.IVendor, {qty,receivedOn,...productData}: any) => {
    const product = await Product.create({
      ...productData,
      creator:vendor.id,
      location:vendor.location,
      vendors:[vendor.id]
    });
    vendor.items.push({qty,receivedOn,item:product});
    await vendor.save();
    return product;
  };
  /** 📌 Updates a product */
  static updateProduct = async (vendorId: string, productId: string, productData: any) => {
    return await Product.findOneAndUpdate(
      { _id:productId,vendor:vendorId },
      productData,
      queryOpts
    );
  };
  /** 📌 Marks a product for deletion */
  static deleteProduct = async (vendorId: string, productId: string) => {return await Product.findOneAndDelete({ _id: productId, vendor: vendorId });}
  /** 📌 Deletes a product */
  static deleteXProduct = async (vendorId: string, productId: string) => {return await Product.findOneAndDelete({ _id: productId, vendor: vendorId });}
  /** 📌 Lists a vendor's products */
  static listVendorProducts = async (vendorId: string) => {return await Product.find({ vendors:{$in:[vendorId]} });}
  // Order & Fulfillment
  /** 📌 To list all of the vendor's orders */
  static viewOrders = async (vendorId: string) => {return await Order.find({ vendor: vendorId }).populate('customers');}
  /** 📌 To accept an order */
  static acceptOrder = async (vendorId: string, orderId: string) => {
    const order = await Order.findOne({ _id: orderId, vendor: vendorId });
    if (!order) throw new AppError(404, "Order not found!");
    await order.setStatus(AllTypes.IOrderStatuses.ACCEPTED,null,true);
    return order;
  };
  /** 📌 To reject an order */
  static rejectOrder = async (vendorId: string, orderId: string)  => {
    const order = await Order.findOne({ _id: orderId, vendor: vendorId });
    if (!order) throw new AppError(404, "Order not found!");
    await order.setStatus(AllTypes.IOrderStatuses.REJECTED,null,true);
    return order;
  };
  /** 📌 To mark an order ready for pickup */
  static markOrderReady = async (vendorId: string, orderId: string) => {
    const order = await Order.findOne({ _id: orderId, vendor: vendorId });
    if (!order) throw new AppError(404, "Order not found!");
    await order.setStatus(AllTypes.IOrderStatuses.READY,null,true);
    return order;
  };
  /** 📌 To view order details */
  static viewOrderDetails = async (vendorId: string, orderId: string) => {return await Order.findOne({ _id: orderId, vendor: vendorId }).populate('customer');}
  /** 📌 To update an order's status */
  static updateOrderStatus = async (vendorId: string, orderId: string, status: string) => {return await Order.findOneAndUpdate({ _id: orderId, vendor: vendorId }, { status }, { new: true });}
   /** 📌 Manually assigns a courier to an order */
  static assignCourierManually = async (orderId: string, courierId: string) => {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError(404, "Order not found");
    if (order.status !== AllTypes.IOrderStatuses.READY) throw new AppError(400, "Order is not ready for pickup");
    const courier = await Courier.findById(courierId);
    if (!courier || !courier.isAvailable) throw new AppError(400, "Selected courier is not available");
    order.courier = courierId as any;
    await order.setStatus(AllTypes.IOrderStatuses.ASSIGNED,null,true);
    // Notify the courier
    const notificationMethod = AllTypes.INotificationSendMethods.PUSH;
    const notificationData = {orderId};
    await NotificationService.createNotification("COURIER_ASSIGNED",notificationMethod,[courierId],notificationData);
    return { message: "Courier successfully assigned", orderId, courierId };
  };
  /** 📌 Retrieves the status and location of couriers assigned to vendor orders */
  static trackAssignedCouriers = async (vendorId: string) => {
    const orders = await Order.find({ vendor: vendorId, courier: { $ne: null } })
        .populate('courier', 'name location status');

    const courierStatuses = orders.map(order => ({
        orderId: order._id,
        courier: order.courier
    }));

    return courierStatuses;
  };
  /** 📌 Lists unassigned orders waiting for a courier */
  static viewPendingCourierAssignments = async (vendorId: string) => {
    const orders = await Order.find({ vendor: vendorId, status: 'ready', courier: null }).select('_id customer location createdAt');
    return orders;
  }
  /** 📌 Cancels a courier assignment and resets the order status */
  static cancelCourierAssignment = async (orderId: string) => {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError(404, "Order not found");
    if (!order.courier) throw new AppError(400, "No courier assigned to this order");
    const courierId = order.courier.id as any;
    order.courier = null as any;
    await order.setStatus(AllTypes.IOrderStatuses.READY,null,true);// Reset status so a new courier can be assigned

    //send cancel assignment
    const notificationMethod = AllTypes.INotificationSendMethods.PUSH;
    const notificationData =  {orderId};
    await NotificationService.createNotification("COURIER_ASSIGNMENT_CANCELLED",notificationMethod,[courierId],notificationData);

    return { message: "Courier assignment canceled", orderId };
  }
  /** 📌 Sends an order update notification to the customer */
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

  /** 📌 Sends a broadcast notification to all vendor customers */
  static sendBroadcastNotification = async (vendorId: string, message: string) => {
    const vendor = await Vendor.findById(vendorId).populate('orders');
    if (!vendor) throw new AppError(404, "Vendor not found!");
    const orders = await this.viewOrders(vendorId);
    const customers = orders.map(o => o.customer.id);
    if (!customers.length) throw new AppError(400, "No customers to notify!");
    const notificationMethod = AllTypes.INotificationSendMethods.PUSH;
    await NotificationService.createNotification("PROMOTIONAL_OFFER",notificationMethod,customers);
    return { message: "Broadcast sent successfully." };
  }

  /** 📌 Retrieves vendor notifications (e.g., orders, system updates) */
  static viewVendorNotifications = async (vendorId: string) => {
    const notifications = await NotificationService.getNotifications(vendorId);
    return notifications;
  }

  /** 📌 Retrieves vendor sales data for a given period */
  static getSalesReport = async (vendorId: string, startDate: string, endDate: string) => {
    const report = await ReportsService.generateSalesReport(vendorId, new Date(startDate), new Date(endDate));
    return report;
  }

  /** 📌 Analyzes order volume and peak hours */
  static getOrderTrends = async (vendorId: string) => {
    const trends = await ReportsService.getOrderTrends(vendorId);
    return trends;
  }

  /** 📌 Provides insights on customer behavior and preferences */
  static getCustomerInsights = async (vendorId: string) => {
    const insights = await ReportsService.getCustomerInsights(vendorId);
    return insights;
  }

  /** 📌 Updates vendor business hours */
  static updateBusinessHours = async (vendorId: string, hours: { open: string, close: string }) => {
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { businessHours: hours }, { new: true });
    if (!vendor) throw new AppError(404, "Vendor not found!");
    return { message: "Business hours updated successfully." };
  }

  /** 📌 Enables or disables automatic order acceptance */
  static setAutoAcceptOrders = async (vendorId: string, autoAccept: boolean) => {
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { autoAcceptOrders: autoAccept }, { new: true });
    if (!vendor) throw new AppError(404, "Vendor not found!");
    return { message: `Auto-accept orders ${autoAccept ? "enabled" : "disabled"}.` };
  }

  /** 📌 Defines preferred couriers or delivery conditions */
  static setCourierPreferences = async (vendorId: string, preferences: any) => {
    const vendor = await Vendor.findByIdAndUpdate(vendorId, { courierPreferences: preferences }, { new: true });
    if (!vendor) throw new AppError(404, "Vendor not found!");
    return { message: "Courier preferences updated successfully." };
  }
}