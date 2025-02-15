import Models from '../../models';
import Types from "../../types";
import Utils from '../../utils';
import Services from '../../services';

export class CustomerOpsService {
  // 1️⃣ Account & Profile Management  
  static async registerCustomer(data: any) {
    return await Models.Customer.create(data);
  }
  static async updateCustomerProfile(customerId: string, updates: any) {
    return await Models.Customer.findByIdAndUpdate(customerId, updates, { new: true });
  }
  static async getCustomerProfile(customerId: string) {return await Models.Customer.findById(customerId);}
  static async deleteCustomerAccount(customerId: string) {return await Models.Customer.findByIdAndDelete(customerId);}
  static async deleteXCustomerAccount(customerId: string) {
    return await Models.Customer.findByIdAndDelete(customerId);
  }

  // 2️⃣ Product Discovery & Ordering  
  static async browseProducts() {return await Models.Product.find();}
  static async searchProducts(query: string) {return await Models.Product.find({ name: { $regex: query, $options: "i" } });}
  static async getProductDetails(productId: string) {return await Models.Product.findById(productId);}
  static async addToCart(customerId: string, productId: string, qty: number) {
    const customer = await Models.Customer.findById(customerId);
    if (!customer) throw new Utils.AppError(404, "Customer not found");
    customer.cart.push({ item: productId as any, qty });
    await customer.save();
    return customer.cart;
  }
  static async updateCart(customerId: string, cartItems: any[]) {
    return await Models.Customer.findByIdAndUpdate(customerId, { cart: cartItems }, { new: true });
  }
  static async clearCart(customerId: string) {
    return await Models.Customer.findByIdAndUpdate(customerId, { cart: [] }, { new: true });
  }
  static async getCart(customerId: string) {
    const customer = await Models.Customer.findById(customerId).populate("cart.product");
    return customer?.cart || [];
  }
  static async placeOrder(customerId: string, orderData: any) {
    const order = await Models.Order.create({ ...orderData, customer: customerId });
    const notifyMethod = Types.INotificationSendMethods.SMS;
    const notifyData = {orderId:order.id};
    await Services.Notification.createNotification("ORDER_PLACED",notifyMethod,[customerId],notifyData);
    return order;
  }

  // 3️⃣ Order Management & Tracking  
  static async viewOrders(customerId: string) {return await Models.Order.find({ customer: customerId });}
  static async getOrderDetails(orderId: string) {return await Models.Order.findById(orderId).populate(["vendor", "courier"]);}
  static async cancelOrder(orderId: string, customerId: string) {
    const order = await Models.Order.findById(orderId);
    if (!order) throw new Utils.AppError(400, "Order cannot be canceled");
    await order.setStatus(Types.IOrderStatuses.CANCELLED);
    return order;
  }
  static async trackOrder(orderId: string) {return await Models.Order.findById(orderId).populate("courier");}
  static async rateOrder(orderId: string, rating: number, review: string) {
    const order = await Models.Order.findById(orderId);
    if (!order) throw new Utils.AppError(404, "Order not found");
    //order.rating = rating;
    //order.review = review;
    await order.save();
    return order;
  }
  // 4️⃣ Payments & Transactions  
  static async addPaymentMethod(customerId: string, paymentData: any) {
    return await Models.Payment.create({ customer: customerId, ...paymentData });
  }
  static async removePaymentMethod(paymentId: string, customerId: string) {
    return await Models.Payment.findByIdAndDelete(paymentId,{customer: customerId });
  }
  static async getPaymentMethods(customerId: string) {return await Models.Payment.find({ customer: customerId });}
  static async processPayment(orderId: string, paymentData: any) {
    const order = await Models.Order.findById(orderId);
    if (!order) throw new Utils.AppError(404, "Order not found");
    const payment = await Models.Payment.findById(orderId);
    if (!payment) throw new Utils.AppError(404, "Payment not found");
    payment.set(paymentData);
    await payment.setStatus(Types.IPaymentStatuses.PAID);
    await order.save();
    return payment;
  }
  static async getTransactionHistory(customerId: string) {return await Models.Payment.find({ customer: customerId });}
  // 5️⃣ Courier & Delivery Tracking  
  static async trackCourierLocation(courierId: string) {return (await Models.Courier.findById(courierId)).location.coordinates;}
  static async contactCourier(user:Types.IUser,courierId: string, message: string) {
    return await Services.Message.createMessage(user,[{id:courierId,ref:"couriers"}],message);
  }
  static async scheduleDelivery(orderId: string, deliveryTime: Date) {
    return await Models.Order.findByIdAndUpdate(orderId, { scheduledTime: deliveryTime }, { new: true });
  }
  static async reportDeliveryIssue(orderId: string, issue: string) {
    return await Models.Order.findByIdAndUpdate(orderId, { deliveryIssue: issue }, { new: true });
  }
  // 6️⃣ Notifications & Communication  
  static async getCustomerNotifications(customerId: string) {
    return await Services.Notification.getNotifications(customerId);
  }
  static async markNotificationAsRead(notificationId: string, customerId: string) {
   // return await Services.Notification.markAsSeen(notificationId,customerId);
   return { ok:true };
  }
  static async subscribeToPromotions(customerId: string) {
    return await Models.Customer.findByIdAndUpdate(customerId, { subscribedToPromotions: true }, { new: true });
  }
  static async unsubscribeFromPromotions(customerId: string) {
    return await Models.Customer.findByIdAndUpdate(customerId, { subscribedToPromotions: false }, { new: true });
  }

  // 7️⃣ Support & Feedback  
  static async submitSupportTicket(customerId: string, message: string) {
    return await Services.Message.createMessage(customerId as any,[],message);
  }

  static async getSupportTickets(customerId: string) {
    return await Services.Message.getMessages(customerId);
  }

  static async chatWithSupport(customerId: string, message: string) {
    return await Services.Message.createMessage(customerId as any,[],message);
  }

  static async submitFeedback(customerId: string, feedback: string) {
    return await Services.Message.createMessage(customerId as any,[],feedback);
  }
}
