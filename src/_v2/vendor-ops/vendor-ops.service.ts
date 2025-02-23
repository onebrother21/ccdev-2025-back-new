import Models from '../../models';
import Types from "../../types";
import Utils from '../../utils';
import Services from '../../services';
import bcrypt from 'bcryptjs';
import { Document } from 'mongoose';
import { AuthService } from "../auth/auth.service";

const queryOpts = { new:true,runValidators: true,context:'query' };
const saltRounds = Number(process.env.SALT_ROUNDS || 10);

export class VendorOpsService {
  /** 📌 Vendor Management */
  /** 📌 Creates vendor profile
   * - refactor validator and controller for this method
   */
  static registerVendor = async (user:Types.IUser,data:any) => {
    const role = Types.IProfileTypes.VENDOR;
    const vendor = new Models.Vendor({
      ...data,
      mgr:user._id,
      users:[user._id],
      location:{type:"Point",coordinates:data.location}
    });
    await vendor.save();
    user.profiles[role] = vendor.id;
    await user.save();
    //Send VENDOR_REGISTERED
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {vendorName:vendor.name};
    await Services.Notification.createNotification("VENDOR_REGISTERED",notificationMethod,[user.id],notificationData);
    return true;
  };
  /** 📌 Creates temp pswd for new acct user */
  static createTempPswd = async (user:Types.IUser) => {
    const vendor = user.profiles[Types.IProfileTypes.VENDOR] as Types.IVendor;
    if(vendor.mgr !== user.id) throw new Utils.AppError(401,"Insufficient permissions");
    const tempPswd = Utils.shortId();
    vendor.tempPswd = {
      code:await bcrypt.hash(tempPswd,saltRounds),
      expires:new Date(Date.now() + 15 * 60 * 1000)
    };
    await vendor.save();
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {tempPswd};
    await Services.Notification.createNotification("VENDOR_ACCT_TEMP_PSWD",notificationMethod,[user.id],notificationData);
    return true;
  };
  static searchVendorsByName = async (name:string) => {
    const vendors = await Models.Vendor.find({name:{$regex:new RegExp(name),$options:"i"}}).sort("name").limit(10);
    return {results:vendors.map(v => v.json())};
  };
  static joinVendorAccount = async (user:Types.IUser,vendorId:string,tempPswd:string) => {
    // fail if missing user, vendorId or passcode
    if(!user || !vendorId || !tempPswd) throw new Utils.AppError(400,'Operation failed');
    const role = Types.IProfileTypes.VENDOR;
    const vendor = await Models.Vendor.findById(vendorId);
    // fail if vendor not found or no temp passcode is set on vendor
    if(!vendor || vendor.tempPswd) throw new Utils.AppError(400,'Operation failed');
    // fail if temp passcode has expired
    if(new Date(vendor.tempPswd.expires) <= new Date()) throw new Utils.AppError(422,'Operation failed');
    // fail if temp passcode does not match
    if(!await bcrypt.compare(tempPswd,vendor.tempPswd.code)) throw new Utils.AppError(401,'Operation failed');
    // success -> unset vendor's temp passcode, add user to vendor users, add vendor to user's profiles, save both models, return ok
    vendor.tempPswd = null;
    vendor.users.push(user.id);
    user.profiles[role] = vendor.id;
    await vendor.save();
    await user.save();
    //Send VENDOR_ACCT_USER_ADDED
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {vendorName:vendor.name,user:user.fullname};
    await Services.Notification.createNotification("VENDOR_ACCT_USER_JOINED",notificationMethod,vendor.users,notificationData);
    return true;
  };
  /** need to revoke auth tokens and force profile refresh */
  static leaveVendorAccount = async (user:Types.IUser,tokenStub:string) => {
    const role = Types.IProfileTypes.VENDOR;
    const vendor = user.profiles[role] as Types.IVendor;
    // prune user from the vendor's users & unset user's vendor profile. if user is vendor mgr, unset vendor mgr
    vendor.users = vendor.users.filter(vendorUser =>(vendorUser instanceof Document ? vendorUser.id : vendorUser) == user.id);
    vendor.mgr == user.id?vendor.mgr = null:null;
    user.profiles[role] = null;
    await Models.DeadToken.create({stub:tokenStub});
    // save models, notify vendor users and return ok
    await vendor.save();
    await user.save();

    //Send VENDOR_ACCT_USER_REMOVED
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {vendorName:vendor.name,user:user.fullname};
    await Services.Notification.createNotification("VENDOR_ACCT_USER_LEFT",notificationMethod,vendor.users,notificationData);
    return await AuthService.switchUserProfile(Types.IProfileTypes.CUSTOMER,user);
  };
  /** need to revoke auth tokens and force profile refresh */
  static removeUserFromAccount = async (user:Types.IUser,userToRemoveId:string) => {
    const role = Types.IProfileTypes.VENDOR;
    const vendor = user.profiles[role] as Types.IVendor;
    //are you the acct manager for this vendor profile
    if(vendor.mgr !== user.id) throw new Utils.AppError(401,"Insufficient permissions");
    // look up user to remove
    const userToRemove = await Models.User.findById(userToRemoveId);
    if(!userToRemove) throw new Utils.AppError(400,'Vendor accout user not found');
    // prune user from the vendor's users & unset user's vendor profile
    vendor.users = vendor.users.filter(vendorUser =>(vendorUser instanceof Document ? vendorUser.id : vendorUser) == userToRemoveId);
    userToRemove.profiles[role] = null;
    // save user and vendor
    await vendor.save();
    await userToRemove.save();
    //Send VENDOR_ACCT_USER_REMOVED
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {vendorName:vendor.name,user:userToRemove.name};
    await Services.Notification.createNotification("VENDOR_ACCT_USER_REMOVED",notificationMethod,vendor.users,notificationData);
    return true;
  };
  static transferVendorMgmt = async (user:Types.IUser,newMgrId:string) => {
    const role = Types.IProfileTypes.VENDOR;
    const vendor = user.profiles[role] as Types.IVendor;
    // fail if user is not the current mgr for this profile
    if(vendor.mgr !== user.id) throw new Utils.AppError(401,"Insufficient permissions");
    // transfer vendor mgr
    vendor.mgr = newMgrId as any;
    const newMgr = await Models.User.findById(newMgrId);
    // save vendor
    await vendor.save();
    //Send VENDOR_ACCT_USER_REMOVED
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {vendorName:vendor.name,newMgr:newMgr.fullname};
    await Services.Notification.createNotification("VENDOR_ACCT_MGR_UPDATED",notificationMethod,vendor.users,notificationData);
    return true;
  };
  /** 📌 Updates vendor profile */
  static updateVendorProfile = async (vendorId:string,{location,items,...data}:any) => {
    if(location) data.location = {type:"Point",coordinates:location};
    const vendor = await Models.Vendor.findByIdAndUpdate(vendorId,data,queryOpts);
    if(!vendor) throw new Utils.AppError(404,"Vendor not found!");
    //await vendor.populate("items.item");
    return vendor;
  };
  /** 📌 Fetches and popluates vendor profile */
  static getVendorProfile = async (vendorId: string) => await Models.Vendor.findById(vendorId);
  /** 📌 Mark a vendor profile for deletion */
  static deleteVendorProfile = async (vendorId:string) => {
    const vendor = await Models.Vendor.findById(vendorId);
    if (!vendor) throw new Utils.AppError(404,"Vendor not found!");
    await vendor.setStatus(Types.IProfileStatuses.DELETED,null,true);
    return true;
  };
  /** 📌 Mark a vendor profile for deletion */
  static deleteXVendorProfile = async (vendorId:string) => {
    const vendor = await Models.Vendor.findByIdAndDelete(vendorId);
    if (!vendor) throw new Utils.AppError(404, "Vendor not found!");
    return true;
  };
  // Product Management
  /** 📌 Get inventory */
  static getInventory = async (vendor:Types.IVendor) => {
    await vendor.populate("items.product");
    const items = vendor.items.slice(-10).map(o => ({
      qty:o.qty,
      product:o.product.json() as any,
      receivedOn:o.receivedOn,
    }));
    return { items };
  }
  /** 📌 Creates a product */
  static createProduct = async (vendor:Types.IVendor,{qty,receivedOn,...productData}: any) => {
    const product = new Models.Product({
      ...productData,
      creator:vendor.id,
      location:vendor.location,
      vendors:[vendor.id]
    });
    await product.save();
    const item = {qty,receivedOn,product};
    vendor.items.push(item);
    await vendor.save();
    return {...item,product:item.product.json()};
  };
  /** 📌 Updates a product */
  static updateProduct = async (vendor: Types.IVendor,productId: string,{ qty, receivedOn, ...productData }: any) => {
    const item = vendor.items.find(({ product }) => (product instanceof Document ? product.id : product) == productId);
    if (!item) throw new Utils.AppError(404, "Product not found in vendor inventory.");
    if(Object.keys(productData).length) item.product = await Models.Product.findByIdAndUpdate(productId,productData,queryOpts);
    else if(!(item.product instanceof Document)) item.product = await Models.Product.findById(productId);
    if (!item.product) throw new Utils.AppError(404, "Product not found.");
    if (qty) item.qty = qty;
    if (receivedOn) item.receivedOn = receivedOn;
    await vendor.save();
    return {
      qty:item.qty,
      receivedOn:item.receivedOn,
      product:item.product.json(),
    };
  };
  /** 📌 Marks a product for deletion */
  static deleteProduct = async (vendorId: string, productId: string) => {return await Models.Product.findOneAndDelete({ _id: productId, vendor: vendorId });}
  /** 📌 Deletes a product */
  static deleteXProduct = async (vendorId: string, productId: string) => {return await Models.Product.findOneAndDelete({ _id: productId, vendor: vendorId });}
  /** 📌 Lists a vendor's products */
  static listProductsByVendor = async (vendorId: string) => {return await Models.Product.find({ vendors:{$in:[vendorId]} });}
  // Order & Fulfillment
  /** 📌 To list all of the vendor's orders */
  static viewOrders = async (vendorId: string) => {return await Models.Order.find({ vendor: vendorId }).populate('customers');}
  /** 📌 To accept an order */
  static acceptOrder = async (vendorId: string, orderId: string) => {
    const order = await Models.Order.findOne({ _id: orderId, vendor: vendorId });
    if (!order) throw new Utils.AppError(404, "Order not found!");
    await order.setStatus(Types.IOrderStatuses.ACCEPTED,null,true);
    return order;
  };
  /** 📌 To reject an order */
  static rejectOrder = async (vendorId: string, orderId: string)  => {
    const order = await Models.Order.findOne({ _id: orderId, vendor: vendorId });
    if (!order) throw new Utils.AppError(404, "Order not found!");
    await order.setStatus(Types.IOrderStatuses.REJECTED,null,true);
    return order;
  };
  /** 📌 To mark an order ready for pickup */
  static markOrderReady = async (vendorId: string, orderId: string) => {
    const order = await Models.Order.findOne({ _id: orderId, vendor: vendorId });
    if (!order) throw new Utils.AppError(404, "Order not found!");
    await order.setStatus(Types.IOrderStatuses.READY,null,true);
    return order;
  };
  /** 📌 To view order details */
  static viewOrderDetails = async (vendorId: string, orderId: string) => {return await Models.Order.findOne({ _id: orderId, vendor: vendorId }).populate('customer');}
  /** 📌 To update an order's status */
  static updateOrderStatus = async (vendorId: string, orderId: string, status: string) => {return await Models.Order.findOneAndUpdate({ _id: orderId, vendor: vendorId }, { status }, { new: true });}
   /** 📌 Manually assigns a courier to an order */
  static assignCourierManually = async (orderId: string, courierId: string) => {
    const order = await Models.Order.findById(orderId);
    if (!order) throw new Utils.AppError(404, "Order not found");
    if (order.status !== Types.IOrderStatuses.READY) throw new Utils.AppError(400, "Order is not ready for pickup");
    const courier = await Models.Courier.findById(courierId);
    if (!courier || !courier.isAvailable) throw new Utils.AppError(400, "Selected courier is not available");
    order.courier = courierId as any;
    await order.setStatus(Types.IOrderStatuses.ASSIGNED,null,true);
    // Notify the courier
    const notificationMethod = Types.INotificationSendMethods.PUSH;
    const notificationData = {orderId};
    await Services.Notification.createNotification("COURIER_ASSIGNED",notificationMethod,[courierId],notificationData);
    return { message: "Courier successfully assigned", orderId, courierId };
  };
  /** 📌 Retrieves the status and location of couriers assigned to vendor orders */
  static trackAssignedCouriers = async (vendorId: string) => {
    const orders = await Models.Order.find({ vendor: vendorId, courier: { $ne: null } })
        .populate('courier', 'name location status');

    const courierStatuses = orders.map(order => ({
        orderId: order._id,
        courier: order.courier
    }));

    return courierStatuses;
  };
  /** 📌 Lists unassigned orders waiting for a courier */
  static viewPendingCourierAssignments = async (vendorId: string) => {
    const orders = await Models.Order.find({ vendor: vendorId, status: 'ready', courier: null }).select('_id customer location createdAt');
    return orders;
  }
  /** 📌 Cancels a courier assignment and resets the order status */
  static cancelCourierAssignment = async (orderId: string) => {
    const order = await Models.Order.findById(orderId);
    if (!order) throw new Utils.AppError(404, "Order not found");
    if (!order.courier) throw new Utils.AppError(400, "No courier assigned to this order");
    const courierId = order.courier.id as any;
    order.courier = null as any;
    await order.setStatus(Types.IOrderStatuses.READY,null,true);// Reset status so a new courier can be assigned

    //send cancel assignment
    const notificationMethod = Types.INotificationSendMethods.PUSH;
    const notificationData =  {orderId};
    await Services.Notification.createNotification("COURIER_ASSIGNMENT_CANCELLED",notificationMethod,[courierId],notificationData);

    return { message: "Courier assignment canceled", orderId };
  }
  /** 📌 Sends an order update notification to the customer */
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

  /** 📌 Sends a broadcast notification to all vendor customers */
  static sendBroadcastNotification = async (vendorId: string, message: string) => {
    const vendor = await Models.Vendor.findById(vendorId).populate('orders');
    if (!vendor) throw new Utils.AppError(404, "Vendor not found!");
    const orders = await this.viewOrders(vendorId);
    const customers = orders.map(o => o.customer.id);
    if (!customers.length) throw new Utils.AppError(400, "No customers to notify!");
    const notificationMethod = Types.INotificationSendMethods.PUSH;
    await Services.Notification.createNotification("PROMOTIONAL_OFFER",notificationMethod,customers);
    return { message: "Broadcast sent successfully." };
  }

  /** 📌 Retrieves vendor notifications (e.g., orders, system updates) */
  static viewVendorNotifications = async (vendorId: string) => {
    const notifications = await Services.Notification.getNotifications(vendorId);
    return notifications;
  }

  /** 📌 Retrieves vendor sales data for a given period */
  static getSalesReport = async (vendorId: string, startDate: string, endDate: string) => {
    const report = await Services.Reports.generateSalesReport(vendorId, new Date(startDate), new Date(endDate));
    return report;
  }

  /** 📌 Analyzes order volume and peak hours */
  static getOrderTrends = async (vendorId: string) => {
    const trends = await Services.Reports.getOrderTrends(vendorId);
    return trends;
  }

  /** 📌 Provides insights on customer behavior and preferences */
  static getCustomerInsights = async (vendorId: string) => {
    const insights = await Services.Reports.getCustomerInsights(vendorId);
    return insights;
  }

  /** 📌 Updates vendor business hours */
  static updateBusinessHours = async (vendorId: string, hours: { open: string, close: string }) => {
    const vendor = await Models.Vendor.findByIdAndUpdate(vendorId, { businessHours: hours }, { new: true });
    if (!vendor) throw new Utils.AppError(404, "Vendor not found!");
    return { message: "Business hours updated successfully." };
  }

  /** 📌 Enables or disables automatic order acceptance */
  static setAutoAcceptOrders = async (vendorId: string, autoAccept: boolean) => {
    const vendor = await Models.Vendor.findByIdAndUpdate(vendorId, { autoAcceptOrders: autoAccept }, { new: true });
    if (!vendor) throw new Utils.AppError(404, "Vendor not found!");
    return { message: `Auto-accept orders ${autoAccept ? "enabled" : "disabled"}.` };
  }

  /** 📌 Defines preferred couriers or delivery conditions */
  static setCourierPreferences = async (vendorId: string, preferences: any) => {
    const vendor = await Models.Vendor.findByIdAndUpdate(vendorId, { courierPreferences: preferences }, { new: true });
    if (!vendor) throw new Utils.AppError(404, "Vendor not found!");
    return { message: "Courier preferences updated successfully." };
  }
}