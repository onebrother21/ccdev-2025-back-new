import Models from '../../models';
import Utils from '../../utils';
import Types from "../../types";
import Services from '../../services';

export class CourierMgmtService {
  static findAvaliable = async ({ vendorId, orderId }:{ vendorId:string, orderId:string }) =>  {
    // Get vendor location
    const order = await Models.Order.findById(orderId).populate('vendor');
    if(!order) throw new Utils.AppError(404,'Order not found');
    const vendorLocation = order.vendor.location;
    // Find couriers within a 10km radius (example filter)
    const availableCouriers = await Models.Courier.find({
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
    const order = await Models.Order.findById(orderId);
    if(!order) throw new Utils.AppError(404,'Order not found');
    order.courier = courierId as any;
    await order.setStatus(Types.IOrderStatuses.ASSIGNED,null,true);
    await order.populate("courier");
    // Notify the courier
    const notificationMethod = Types.INotificationSendMethods.PUSH;
    const notificationData =  {orderId};
    await Services.Notification.createNotification("COURIER_ASSIGNED",notificationMethod,[order.courier.user],notificationData);
    return {ok:true};
  }
  static acceptOrder = async ({ orderId, courierId }:{ orderId:string, courierId:string }) => {
    const order = await Models.Order.findById(orderId);
    if(!order) throw new Utils.AppError(404,'Order not found');
    if (order.courier?.toString() !== courierId) throw new Utils.AppError({status:403,message:'Unauthorized'});
    await order.setStatus(Types.IOrderStatuses.ACCEPTED,null,true);
    return {order};
  }
  static rejectOrder = async ({ orderId, courierId,reason }:{ orderId:string, courierId:string,reason:string }) => {
    const order = await Models.Order.findById(orderId);
    if(!order) throw new Utils.AppError({status:404,message:'Order not found' });
    if (order.courier?.toString() !== courierId) throw new Utils.AppError({status:403,message:'Unauthorized'});
    order.courier = null;
    await order.setStatus(Types.IOrderStatuses.REJECTED,{reason},true);
    return {order};
  }
  static fulfillOrder = async ({ orderId,status }:{ orderId:string,status:Types.IOrderStatuses}) => {
    const order = await Models.Order.findById(orderId);
    if(!order) throw new Utils.AppError({status:404,message:'Order not found' });
    await order.setStatus(status,null,true);
    return {order};
  } 
}
