import { Job } from 'bullmq';
import { Notification,Courier,Order } from '../models';
import * as AllTypes from "../types";
import { calculateDistance, CommonUtils, createQueue,logger } from '../utils';
import { NotificationService } from '../services';

export const autoAssignCouriers = async (job:Job) => {
  try {
    logger.info("Processing courier assignment...");
    // 1. Find all unassigned orders
    const unassignedTypes = [AllTypes.IOrderStatuses.NEW,AllTypes.IOrderStatuses.PLACED];
    const unassignedOrders = await Order.find({status:{ $in:unassignedTypes }}).populate("vendor");
    for (const order of unassignedOrders) {
      const vendorLocation = order.vendor.location;
      // 2. Find available couriers within range
      const availableCouriers = await Courier.find({
        isAvailable: true,
        location: {
          $near: {
            $geometry: vendorLocation,
            $maxDistance: 10000, // 10km
          },
        },
      },null,{limit:20});
      // 3. Sort couriers by distance
      const sortedCouriers = availableCouriers
        .map(courier => ({
          courier,
          distance: calculateDistance(
            vendorLocation.coordinates,
            courier.location.coordinates,
            {unit:"mi",toFixed:4}
          ),
        }))
        .sort((a, b) => a.distance - b.distance); // Closest first

      // 4. Assign to the first available courier who has not rejected the order
      for (const { courier } of sortedCouriers) {
        if (!order.rejectedBy.includes(courier.id)) {
          order.courier = courier._id as any;
          order.setStatus(AllTypes.IOrderStatuses.ASSIGNED,null,true);
          // Notify the courier
          const notificationMethod = AllTypes.INotificationSendMethods.PUSH;
          const notificationData = {orderId:order.id};
          await NotificationService.createNotification("COURIER_ASSIGNED",notificationMethod,[courier.user],notificationData);
          logger.info(`Order ${order._id} assigned to Courier ${courier._id}`);
          break;
        }
      }
    }
  }
  catch (error) {
    console.error('Error assigning couriers:', error);
    throw error;
  }
};
export default autoAssignCouriers;