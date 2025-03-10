import { VendorOpsService } from './vendor-ops.service';
import Types from "../../types";
import Utils from '../../utils';


export class VendorOpsController {
  // Vendor Management
  static registerVendor:IHandler = async (req,res,next) => {
    try {
      const user = req.user as Types.IUser;
      const ok = await VendorOpsService.registerVendor(user,req.body.data);
      res.locals.status = 201;
      res.locals.success = true;
      res.locals.message = "You have registered a new vendor profile!";
      res.locals.data = {ok};
      next();
    } catch (e) { next(e); }
  };
  static createTempPswd:IHandler = async (req,res,next) => {
    try {
      const user = req.user as Types.IUser;
      res.locals.success = true;
      res.locals.data = await VendorOpsService.createTempPswd(user);
      next();
    } catch (e) { next(e); }
  };
  static searchVendorsByName:IHandler = async (req,res,next) => {
    try {
      res.locals.success = true;
      res.locals.data = await VendorOpsService.searchVendorsByName(req.query.q as string);
      next();
    } catch (e) { next(e); }
  };
  static joinVendorAccount:IHandler = async (req,res,next) => {
    try {
      const user = req.user as Types.IUser;
      res.locals.success = true;
      res.locals.data = await VendorOpsService.joinVendorAccount(user,req.params.vendorId,req.body.data.tempPswd);
      next();
    } catch (e) { next(e); }
  };
  /** Leave Vendor Account 
   * 
   *  - auth operation, requires confirmation
   *  - returns user as customer, auth tokens
   */
  static leaveVendorAccount:IHandler = async (req,res,next) => {
    try {
      const user_ = req.user as Types.IUser;
      const tokenStub = res.locals.tokenStub;
      const {user,accessToken,refreshToken} = await VendorOpsService.leaveVendorAccount(user_,tokenStub);
      res.locals.success = true;
      res.locals.token = {accessToken,refreshToken};
      res.locals.data = user;
      req.user = user;
      next();
    } catch(e){ next(e); }
  };
  static removeUserFromAccount:IHandler = async (req,res,next) => {
    try {
      const user = req.user as Types.IUser;
      const userToRemove = req.params.userToRemoveId;
      res.locals.success = true;
      res.locals.data = await VendorOpsService.removeUserFromAccount(user,userToRemove);
      next();
    } catch (e) { next(e); }
  };
  static transferVendorMgmt:IHandler = async (req,res,next) => {
    try {
      const user = req.user as Types.IUser;
      res.locals.success = true;
      res.locals.data = await VendorOpsService.transferVendorMgmt(user,req.params.newMgrId);
      next();
    } catch (e) { next(e); }
  };
  static updateVendorProfile:IHandler = async (req,res,next) => {
    try {
      const vendor_ = req.profile as Types.IVendor;
      const vendor = await VendorOpsService.updateVendorProfile(vendor_.id,req.body.data);
      res.locals.success = true;
      res.locals.data = vendor.json();
      next();
    } catch (e) { next(e); }
  };
  static getVendorProfile:IHandler = async (req,res,next) => {
    try {
      const vendor_ = req.profile as Types.IVendor;
      const vendor = await VendorOpsService.updateVendorProfile(vendor_.id,req.body.data);
      res.locals.success = true;
      res.locals.data = vendor.json();
      next();
    } catch (e) { next(e); }
  };
  static deleteVendorProfile:IHandler = async (req,res,next) => {
    try {
      const vendor = req.profile as Types.IVendor;
      Utils.logger.log({vendor:vendor.id})
      const ok = await VendorOpsService.deleteVendorProfile(vendor.id);
      Utils.logger.log({ok})
      res.locals.success = true;
      res.locals.message =  "Vendor account marked for deletion.";
      res.locals.data = {ok};
      next();
    } catch (e) { next(e); }
  };
  static deleteXVendorProfile:IHandler = async (req,res,next) => {
    try {
      const vendor = req.profile as Types.IVendor;
      const ok = await VendorOpsService.deleteXVendorProfile(vendor.id);
      res.locals.success = true;
      res.locals.message =  "Vendor account deleted successfully.";
      res.locals.data = {ok};
      next();
    } catch (e) { next(e); }
  };
  // Product Management
  static getInventory:IHandler = async (req,res,next) => {
    try {
      const vendor = req.profile as Types.IVendor;
      res.locals.success = true;
      res.locals.data = await VendorOpsService.getInventory(vendor);
      next();
    } catch (e) { next(e); }
  };
  static createProduct:IHandler = async (req,res,next) => {
    try {
      const vendor = req.profile as Types.IVendor;
      res.locals.status = 201;
      res.locals.success = true;
      res.locals.message = "You have added a new product!";
      res.locals.data = await VendorOpsService.createProduct(vendor,req.body.data);
      next();
    } catch (e) { next(e); }
  };
  static updateProduct:IHandler = async (req,res,next) => {
    try {
      const vendor = req.profile as Types.IVendor;
      res.locals.success = true;
      res.locals.data = await VendorOpsService.updateProduct(vendor,req.params.productId,req.body.data);
      next();
    } catch (e) { next(e); }
  };
  static deleteProduct:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
        res.locals.success = true;
        res.locals.data = await VendorOpsService.deleteProduct(vendor.id, req.params.productId);
        next();
    } catch (e) { next(e); }
  };
  static deleteXProduct:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
      try {
          res.locals.success = true;
          res.locals.data = await VendorOpsService.deleteXProduct(vendor.id, req.params.productId);
          next();
      } catch (e) { next(e); }
  };
  /** this is not a venor method */
  static listProductsByVendor:IHandler = async (req,res,next) => {
    try {
      const vendor = req.profile as Types.IVendor;
      const products = await VendorOpsService.listProductsByVendor(vendor.id);
      res.locals.success = true;
      res.locals.data = {results:products.map(o => o.json())};
      next();
    } catch (e) { next(e); }
  };

  // Order & Fulfillment
  static viewOrders:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
      try {
          res.locals.success = true;
          res.locals.data = await VendorOpsService.viewOrders(vendor.id);
          next();
      } catch (e) { next(e); }
  };
  static acceptOrder:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
      try {
          res.locals.success = true;
          res.locals.data = await VendorOpsService.acceptOrder(vendor.id, req.params.orderId);
          next();
      } catch (e) { next(e); }
  };
  static rejectOrder:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
      try {
          res.locals.success = true;
          res.locals.data = await VendorOpsService.rejectOrder(vendor.id, req.params.orderId);
          next();
      } catch (e) { next(e); }
  };
  static markOrderReady:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
      try {
          res.locals.success = true;
          res.locals.data = await VendorOpsService.markOrderReady(vendor.id, req.params.orderId);
          next();
      } catch (e) { next(e); }
  };
  static viewOrderDetails:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
      try {
          res.locals.success = true;
          res.locals.data = await VendorOpsService.viewOrderDetails(vendor.id, req.params.orderId);
          next();
      } catch (e) { next(e); }
  };
  static updateOrderStatus:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
      try {
          res.locals.success = true;
          res.locals.data = await VendorOpsService.updateOrderStatus(vendor.id, req.params.orderId, req.body.data.status);
          next();
      } catch (e) { next(e); }
  };
  // 📌 Manually assigns a courier to an order
  static assignCourierManually:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
        const { orderId, courierId } = req.body.data;
        const data = await VendorOpsService.assignCourierManually(orderId, courierId);
        res.locals.success = true;
        res.locals.data = data;
        next();
    } catch (e) {
        next(e);
    }
  };
  // 📌 Retrieves the status and location of couriers assigned to vendor orders
  static trackAssignedCouriers:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
      try {
          const data = await VendorOpsService.trackAssignedCouriers(vendor.id);
          res.locals.success = true;
          res.locals.data = data;
          next();
      } catch (e) {
          next(e);
      }
  };
  // 📌 Lists unassigned orders waiting for a courier
  static viewPendingCourierAssignments:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
      const data = await VendorOpsService.viewPendingCourierAssignments(vendor.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e);}
  };
  // 📌 Cancels a courier assignment and resets the order status
  static cancelCourierAssignment:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
      try {
          const { orderId } = req.params;
          const data = await VendorOpsService.cancelCourierAssignment(orderId);
          res.locals.success = true;
          res.locals.data = data;
          next();
      } catch (e) {
          next(e);
      }
  };
  // 📌 Sends an order update notification to the customer
  static sendOrderUpdateNotification:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
      const { orderId, message } = req.body.data;
      const data = await VendorOpsService.sendOrderUpdateNotification(orderId, message);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Sends a broadcast notification to all vendor customers
  static sendBroadcastNotification:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
        const { message } = req.body.data;
        const data = await VendorOpsService.sendBroadcastNotification(vendor.id, message);
        res.locals.success = true;
        res.locals.data = data;
        next();
    } catch (e) { next(e); }
  }
  // 📌 Retrieves vendor notifications (e.g., orders, system updates)
  static viewVendorNotifications:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
      const data = await VendorOpsService.viewVendorNotifications(vendor.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Retrieves vendor sales data for a given period
  static getSalesReport:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
      const { startDate, endDate } = req.query;
      const data = await VendorOpsService.getSalesReport(vendor.id, startDate as string, endDate as string);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Analyzes order volume and peak hours
  static getOrderTrends:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
      const data = await VendorOpsService.getOrderTrends(vendor.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Provides insights on customer behavior and preferences
  static getCustomerInsights:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
      const data = await VendorOpsService.getCustomerInsights(vendor.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Updates vendor business hours
  static updateBusinessHours:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
      const { open, close } = req.body.data;
      const data = await VendorOpsService.updateBusinessHours(vendor.id, { open, close });
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Enables or disables automatic order acceptance
  static setAutoAcceptOrders:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
      const { autoAccept } = req.body.data;
      const data = await VendorOpsService.setAutoAcceptOrders(vendor.id, autoAccept);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Defines preferred couriers or delivery conditions
  static setCourierPreferences:IHandler = async (req,res,next) => {
    const vendor = req.profile as Types.IVendor;
    try {
      const { preferences } = req.body.data;
      const data = await VendorOpsService.setCourierPreferences(vendor.id, preferences);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
}
export default VendorOpsController;