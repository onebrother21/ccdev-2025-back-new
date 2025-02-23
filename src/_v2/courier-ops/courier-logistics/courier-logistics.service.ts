import Models from '../../../models';
import Types from "../../../types";
import Utils from '../../../utils';
import Services from '../../../services';

export class CourierLogisticsService {
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
  };
}