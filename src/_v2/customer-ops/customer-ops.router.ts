import { Router } from "express";
import { CustomerOpsController as ctrl } from "./customer-ops.controller";
import { CustomerOpsValidators as validators } from "./customer-ops.validators";
import { AuthJWT,PostMiddleware } from "../../middlewares";
import { V2Routes } from "../v2-routerstrings";
import Utils from "../../utils";

const CustomerOpsRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.CustomerOps;
  const router = Router();
  router.use(AuthJWT);
  
  // 1️⃣ Account & Profile Management
  router.post(routes.Register,[...validators.registerCustomer,ctrl.registerCustomer,...PostMiddleware]);
  router.put(routes.UpdateProfile,[...validators.updateCustomerProfile,ctrl.updateCustomerProfile,...PostMiddleware]);
  router.get(routes.GetProfile,[ctrl.getCustomerProfile,...PostMiddleware]);
  router.delete(routes.DeleteAccount,[ctrl.deleteCustomerAccount,...PostMiddleware]);
  router.delete(routes.DeleteXAccount,[ctrl.deleteXCustomerAccount,...PostMiddleware]);
  
  // 2️⃣ Product Discovery & Ordering
  router.get(routes.BrowseProducts,[ctrl.browseProducts,...PostMiddleware]);
  router.get(routes.SearchProducts,[...validators.searchProducts,ctrl.searchProducts,...PostMiddleware]);
  router.get(routes.GetProductDetails,[...validators.getProductDetails,ctrl.getProductDetails,...PostMiddleware]);
  router.post(routes.AddToCart,[...validators.addToCart,ctrl.addToCart,...PostMiddleware]);
  router.put(routes.UpdateCart,[...validators.updateCart,ctrl.updateCart,...PostMiddleware]);
  router.delete(routes.ClearCart,[ctrl.clearCart,...PostMiddleware]);
  
  // 3️⃣ Order Management & Tracking
  router.post(routes.PlaceOrder,[...validators.placeOrder,ctrl.placeOrder,...PostMiddleware]);
  router.get(routes.ViewOrders,[ctrl.viewOrders,...PostMiddleware]);
  router.get(routes.GetOrderDetails,[...validators.getOrderDetails,ctrl.getOrderDetails,...PostMiddleware]);
  router.put(routes.CancelOrder,[...validators.cancelOrder,ctrl.cancelOrder,...PostMiddleware]);
  router.get(routes.TrackOrder,[...validators.trackOrder,ctrl.trackOrder,...PostMiddleware]);
  router.post(routes.RateOrder,[...validators.rateOrder,ctrl.rateOrder,...PostMiddleware]);
  
  // 4️⃣ Payments & Transactions
  router.post(routes.AddPaymentMethod,[...validators.addPaymentMethod,ctrl.addPaymentMethod,...PostMiddleware]);
  router.get(routes.GetTransactionHistory,[ctrl.getTransactionHistory,...PostMiddleware]);
  
  // 5️⃣ Courier & Delivery Tracking
  router.get(routes.TrackCourierLocation,[...validators.trackCourierLocation,ctrl.trackCourierLocation,...PostMiddleware]);
  router.post(routes.ContactCourier,[...validators.contactCourier,ctrl.contactCourier,...PostMiddleware]);
  
  // 6️⃣ Notifications & Communication
  router.get(routes.GetNotifications,[ctrl.getCustomerNotifications,...PostMiddleware]);
  router.put(routes.MarkNotificationAsRead,[...validators.markNotificationAsRead,ctrl.markNotificationAsRead,...PostMiddleware]);
  
  // 7️⃣ Support & Feedback
  router.post(routes.SubmitFeedback,[...validators.submitFeedback,ctrl.submitFeedback,...PostMiddleware]);

  return router;
};
export { CustomerOpsRouter };
export default CustomerOpsRouter;