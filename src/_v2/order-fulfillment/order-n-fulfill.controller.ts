import * as AllTypes from '../../types';
import { OrderService,NotificationService } from '../../services';

export class OrderAndFulfilmentController {

  // 2.1 Create an Order
  static CreateOrder:IHandler = async (req, res,next) => {
    try {
      const orderData = req.body;
      const newOrder = await OrderService.createOrder(orderData);
      res.locals = {success:true,datat:newOrder.json()};
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error creating order', error });
    }
  };

  // 2.2 View Order Details
  static ViewOrder:IHandler = async (req, res,next) => {
    try {
      const orderId = req.params.orderId;
      const order = await OrderService.getOrderById(orderId);
      if (!order) res.status(404).json({ message: 'Order not found' });
      else {
        res.locals = {success:true,data:order.json()};
        next();
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order details', error });
    }
  };

  // 2.3 Update Order Status (Admin Only)
  static UpdateOrderStatus:IHandler = async (req, res,next) => {
    try {
      const orderId = req.params.orderId;
      const { status } = req.body; // Example: Pending, In Progress, Fulfilled
      const updatedOrder = await OrderService.updateOrderStatus(orderId,status);
      res.locals = {success:true,data:updatedOrder.json()};
      next();
    } catch (error) {
      res.status(422).json({ message: 'Error updating order status', error });
    }
  };

  // 2.4 Assign Fulfillment (Admin Only)
  static AssignFulfillment:IHandler = async (req, res,next) => {
    try {
      const { orderId, courierId } = req.body; // Assign a courier/vendor to fulfill the order
      const assignedOrder = await OrderService.assignFulfillment(orderId, courierId);
      res.locals = {success:true,data:assignedOrder};
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error assigning fulfillment', error });
    }
  };

  // 2.5 Track Order Fulfillment (Customer or Admin)
  static TrackFulfillment:IHandler = async (req, res,next) => {
    try {
      const orderId = req.params.orderId;
      const order = await OrderService.trackOrderFulfillment(orderId);
      if (!order) res.status(404).json({ message: 'Order not found' });
      else{
        res.locals = {success:true,data:order.json()};
        next();
      }
    } catch (error) {
      res.status(500).json({ message: 'Error tracking order fulfillment', error });
    }
  };

  // 2.6 Complete Order (Courier/Vendor)
  static CompleteOrder:IHandler = async (req,res,next) => {
    try {
      const orderId = req.params.orderId;
      const completedOrder = await OrderService.completeOrder(orderId);
      // Notify customer
      await NotificationService.createNotification(
        "ORDER_COMPLETE",
        AllTypes.INotificationSendMethods.AUTO,
        [completedOrder.customer.id],
        {name:"jb smooth",orderNumber:completedOrder.reqno}
      );
      res.locals = {success:true,data:completedOrder.json()};
      next();
    } catch (error) {
      res.status(422).json({ message: 'Error completing order', error });
    }
  };
}
export default OrderAndFulfilmentController;