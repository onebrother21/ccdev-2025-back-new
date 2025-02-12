import { Customer,Order,Product,Payment, Courier } from "../../models";//Payment
import { NotificationService,ReportsService,GeoService, MessageService } from "../../services";
import { AppError } from "../../utils";
import * as AllTypes from "../../types";


export class CustomerOpsService {
  // 1️⃣ Account & Profile Management  
  static async registerCustomer(data: any) {
    return await Customer.create(data);
  }
  static async updateCustomerProfile(customerId: string, updates: any) {
    return await Customer.findByIdAndUpdate(customerId, updates, { new: true });
  }
  static async getCustomerProfile(customerId: string) {return await Customer.findById(customerId);}
  static async deleteCustomerAccount(customerId: string) {return await Customer.findByIdAndDelete(customerId);}
  static async deleteXCustomerAccount(customerId: string) {
    return await Customer.findByIdAndDelete(customerId);
  }

  // 2️⃣ Product Discovery & Ordering  
  static async browseProducts() {return await Product.find();}
  static async searchProducts(query: string) {return await Product.find({ name: { $regex: query, $options: "i" } });}
  static async getProductDetails(productId: string) {return await Product.findById(productId);}
  static async addToCart(customerId: string, productId: string, qty: number) {
    const customer = await Customer.findById(customerId);
    if (!customer) throw new AppError(404, "Customer not found");
    customer.cart.push({ item: productId as any, qty });
    await customer.save();
    return customer.cart;
  }
  static async updateCart(customerId: string, cartItems: any[]) {
    return await Customer.findByIdAndUpdate(customerId, { cart: cartItems }, { new: true });
  }
  static async clearCart(customerId: string) {
    return await Customer.findByIdAndUpdate(customerId, { cart: [] }, { new: true });
  }
  static async getCart(customerId: string) {
    const customer = await Customer.findById(customerId).populate("cart.product");
    return customer?.cart || [];
  }
  static async placeOrder(customerId: string, orderData: any) {
    const order = await Order.create({ ...orderData, customer: customerId });
    const notifyMethod = AllTypes.INotificationSendMethods.SMS;
    const notifyData = {orderId:order.id};
    await NotificationService.createNotification("ORDER_PLACED",notifyMethod,[customerId],notifyData);
    return order;
  }

  // 3️⃣ Order Management & Tracking  
  static async viewOrders(customerId: string) {return await Order.find({ customer: customerId });}
  static async getOrderDetails(orderId: string) {return await Order.findById(orderId).populate(["vendor", "courier"]);}
  static async cancelOrder(orderId: string, customerId: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError(400, "Order cannot be canceled");
    await order.setStatus(AllTypes.IOrderStatuses.CANCELLED);
    return order;
  }
  static async trackOrder(orderId: string) {return await Order.findById(orderId).populate("courier");}
  static async rateOrder(orderId: string, rating: number, review: string) {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError(404, "Order not found");
    //order.rating = rating;
    //order.review = review;
    await order.save();
    return order;
  }
  // 4️⃣ Payments & Transactions  
  static async addPaymentMethod(customerId: string, paymentData: any) {
    return await Payment.create({ customer: customerId, ...paymentData });
  }
  static async removePaymentMethod(paymentId: string, customerId: string) {
    return await Payment.findByIdAndDelete(paymentId,{customer: customerId });
  }
  static async getPaymentMethods(customerId: string) {return await Payment.find({ customer: customerId });}
  static async processPayment(orderId: string, paymentData: any) {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError(404, "Order not found");
    const payment = await Payment.findById(orderId);
    if (!payment) throw new AppError(404, "Payment not found");
    payment.set(paymentData);
    await payment.setStatus(AllTypes.IPaymentStatuses.PAID);
    await order.save();
    return payment;
  }
  static async getTransactionHistory(customerId: string) {return await Payment.find({ customer: customerId });}
  // 5️⃣ Courier & Delivery Tracking  
  static async trackCourierLocation(courierId: string) {return (await Courier.findById(courierId)).location.coordinates;}
  static async contactCourier(user:AllTypes.IUser,courierId: string, message: string) {
    return await MessageService.createMessage(user,[{id:courierId,ref:"couriers"}],message);
  }
  static async scheduleDelivery(orderId: string, deliveryTime: Date) {
    return await Order.findByIdAndUpdate(orderId, { scheduledTime: deliveryTime }, { new: true });
  }
  static async reportDeliveryIssue(orderId: string, issue: string) {
    return await Order.findByIdAndUpdate(orderId, { deliveryIssue: issue }, { new: true });
  }
  // 6️⃣ Notifications & Communication  
  static async getCustomerNotifications(customerId: string) {
    return await NotificationService.getNotifications(customerId);
  }
  static async markNotificationAsRead(notificationId: string, customerId: string) {
   // return await NotificationService.markAsSeen(notificationId,customerId);
   return { ok:true };
  }
  static async subscribeToPromotions(customerId: string) {
    return await Customer.findByIdAndUpdate(customerId, { subscribedToPromotions: true }, { new: true });
  }
  static async unsubscribeFromPromotions(customerId: string) {
    return await Customer.findByIdAndUpdate(customerId, { subscribedToPromotions: false }, { new: true });
  }

  // 7️⃣ Support & Feedback  
  static async submitSupportTicket(customerId: string, message: string) {
    return await MessageService.createMessage(customerId as any,[],message);
  }

  static async getSupportTickets(customerId: string) {
    return await MessageService.getMessages(customerId);
  }

  static async chatWithSupport(customerId: string, message: string) {
    return await MessageService.createMessage(customerId as any,[],message);
  }

  static async submitFeedback(customerId: string, feedback: string) {
    return await MessageService.createMessage(customerId as any,[],feedback);
  }
}
