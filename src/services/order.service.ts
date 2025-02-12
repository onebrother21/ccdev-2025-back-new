import { Order,Courier,User } from '../models';
import * as AllTypes from '../types';

export class OrderService {

  // 2.1 Create an Order
  static async createOrder(orderData: any) {
    const newOrder = new Order(orderData);
    await newOrder.save();
    await newOrder.populate(`creator customer`);
    return newOrder;
  }

  // 2.2 Get Order by ID
  static async getOrderById(orderId: string) {
    return Order.findById(orderId).populate('customer').populate('products');
  }

  // 2.3 Update Order Status
  static async updateOrderStatus(orderId: string,name:AllTypes.IOrderStatuses,info?:any){
    const status = {name,time:new Date(),...(info?{info}:{})};
    return Order.findByIdAndUpdate(orderId,{$push:{statusUpdates:[status]}},{ new: true });
  }

  // 2.4 Assign Fulfillment
  static async assignFulfillment(orderId: string, courierId: string) {
    const courier = await Courier.findById(courierId);
    if (!courier) throw new Error('Courier not found');
    return Order.findByIdAndUpdate(orderId, { assignedCourier: courierId }, { new: true });
  }

  // 2.5 Track Fulfillment
  static async trackOrderFulfillment(orderId: string) {
    return Order.findById(orderId).populate('assignedCourier');
  }

  // 2.6 Complete Order
  static async completeOrder(orderId: string):Promise<AllTypes.IOrder> {
    const status = {name:AllTypes.IOrderStatuses.DELIVERED,time:new Date()};
    return Order.findByIdAndUpdate(orderId,{$push:{statusUpdates:[status]}},{ new: true });
  }
}