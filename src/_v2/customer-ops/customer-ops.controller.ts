import { CustomerOpsService } from "./customer-ops.service";
import Services from "../../services";
import Types from "../../types";
import Utils from '../../utils';
export class CustomerOpsController {
  // 1️⃣ Account & Profile Management
  static registerCustomer: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.registerCustomer(req.body);
      next();
    } catch (e) {
      throw e;
    }
  };
  static updateCustomerProfile: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.updateCustomerProfile(req.user.id, req.body);
      next();
    } catch (e) {
      throw e;
    }
  };
  static getCustomerProfile: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.getCustomerProfile(req.user.id);
      next();
    } catch (e) {
      throw e;
    }
  };
  static deleteCustomerAccount: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.deleteCustomerAccount(req.user.id);
      next();
    } catch (e) {
      throw e;
    }
  };
  static deleteXCustomerAccount: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.deleteCustomerAccount(req.user.id);
      next();
    } catch (e) {
      throw e;
    }
  };

  // 2️⃣ Product Discovery & Ordering
  static browseProducts: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.browseProducts();
      next();
    } catch (e) {
      throw e;
    }
  };

  static searchProducts: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.searchProducts(req.query.q as string);
      next();
    } catch (e) {
      throw e;
    }
  };

  static getProductDetails: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.getProductDetails(req.params.productId);
      next();
    } catch (e) {
      throw e;
    }
  };

  static addToCart: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.addToCart(req.user.id, req.body.productId, req.body.quantity);
      next();
    } catch (e) {
      throw e;
    }
  };

  static updateCart: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.updateCart(req.user.id, req.body.cartItems);
      next();
    } catch (e) {
      throw e;
    }
  };

  static clearCart: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.clearCart(req.user.id);
      next();
    } catch (e) {
      throw e;
    }
  };

  static placeOrder: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.placeOrder(req.user.id, req.body);
      next();
    } catch (e) {
      throw e;
    }
  };

  // 3️⃣ Order Management & Tracking
  static viewOrders: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.viewOrders(req.user.id);
      next();
    } catch (e) {
      throw e;
    }
  };

  static getOrderDetails: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.getOrderDetails(req.params.orderId);
      next();
    } catch (e) {
      throw e;
    }
  };

  static cancelOrder: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.cancelOrder(req.params.orderId, req.user.id);
      next();
    } catch (e) {
      throw e;
    }
  };

  static trackOrder: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.trackOrder(req.params.orderId);
      next();
    } catch (e) {
      throw e;
    }
  };

  static rateOrder: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.rateOrder(req.params.orderId, req.body.rating, req.body.review);
      next();
    } catch (e) {
      throw e;
    }
  };

  // 4️⃣ Payments & Transactions
  static addPaymentMethod: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.addPaymentMethod(req.user.id, req.body);
      next();
    } catch (e) {
      throw e;
    }
  };

  static getTransactionHistory: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.getTransactionHistory(req.user.id);
      next();
    } catch (e) {
      throw e;
    }
  };

  // 5️⃣ Courier & Delivery Tracking
  static trackCourierLocation: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.trackCourierLocation(req.params.courierId);
      next();
    } catch (e) {
      throw e;
    }
  };

  static contactCourier: IHandler = async (req, res, next) => {
    try {
      const user = req.user as Types.IUser;
      const courierId = req.params.courierId;
      const {message} = req.body.data;
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.contactCourier(user,courierId,message);
      next();
    } catch (e) {
      throw e;
    }
  };

  // 6️⃣ Notifications & Communication
  static getCustomerNotifications: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await Services.Notification.getNotifications(req.user.id);
      next();
    } catch (e) {
      throw e;
    }
  };

  static markNotificationAsRead: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.markNotificationAsRead(req.params.notificationId, req.user.id);
      next();
    } catch (e) {
      throw e;
    }
  };

  // 7️⃣ Support & Feedback
  static submitFeedback: IHandler = async (req, res, next) => {
    try {
      res.locals.success = true;
      res.locals.data = await CustomerOpsService.submitFeedback(req.user.id, req.body.feedback);
      next();
    } catch (e) {
      throw e;
    }
  };
}