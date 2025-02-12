import { Courier,Order } from '../../models';
import { AppError, CommonUtils, logger, transStrings } from '../../utils';
import * as AllTypes from "../../types";

import { NotificationService,ProfilesService } from '../../services';

export class CourierMgmtService {
  static findAvaliable = async ({ vendorId, orderId }:{ vendorId:string, orderId:string }) =>  {
    // Get vendor location
    const order = await Order.findById(orderId).populate('vendor');
    if(!order) throw new AppError({status:404,message:'Order not found' });
    const vendorLocation = order.vendor.location;
    // Find couriers within a 10km radius (example filter)
    const availableCouriers = await Courier.find({
      isAvailable: true,
      location: {
        $near: {
          $geometry: vendorLocation,
          $maxDistance: 10000, // 10km
        },
      },
    });
    return {availableCouriers};
  };
  static assignCourier = async ({ orderId, courierId }:{ orderId:string, courierId:string }) => {
    const order = await Order.findById(orderId);
    if(!order) throw new AppError({status:404,message:'Order not found' });
    order.courier = courierId as any;
    await order.setStatus(AllTypes.IOrderStatuses.ASSIGNED,null,true);
    await order.populate("courier");
    // Notify the courier
    const notificationMethod = AllTypes.INotificationSendMethods.PUSH;
    const notificationData =  {orderId};
    await NotificationService.createNotification("COURIER_ASSIGNED",notificationMethod,[order.courier.user],notificationData);
    return {ok:true};
  }
  static acceptOrder = async ({ orderId, courierId }:{ orderId:string, courierId:string }) => {
    const order = await Order.findById(orderId);
    if(!order) throw new AppError({status:404,message:'Order not found' });
    if (order.courier?.toString() !== courierId) throw new AppError({status:403,message:'Unauthorized'});
    await order.setStatus(AllTypes.IOrderStatuses.ACCEPTED,null,true);
    return {order};
  }
  static rejectOrder = async ({ orderId, courierId,reason }:{ orderId:string, courierId:string,reason:string }) => {
    const order = await Order.findById(orderId);
    if(!order) throw new AppError({status:404,message:'Order not found' });
    if (order.courier?.toString() !== courierId) throw new AppError({status:403,message:'Unauthorized'});
    order.courier = null;
    await order.setStatus(AllTypes.IOrderStatuses.REJECTED,{reason},true);
    return {order};
  }
  static fulfillOrder = async ({ orderId,status }:{ orderId:string,status:AllTypes.IOrderStatuses}) => {
    const order = await Order.findById(orderId);
    if(!order) throw new AppError({status:404,message:'Order not found' });
    await order.setStatus(status,null,true);
    return {order};
  } 
}
