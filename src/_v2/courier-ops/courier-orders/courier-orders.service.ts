import Models from '../../../models';
import Types from "../../../types";
import Utils from '../../../utils';
import Services from '../../../services';

export class CourierOrderMgmtService {
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
}