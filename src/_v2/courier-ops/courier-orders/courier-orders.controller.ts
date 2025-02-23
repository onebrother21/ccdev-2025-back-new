import Types from "../../../types";
import { CourierOrderMgmtService } from "./courier-orders.service";

export class CourierOrderMgmtController {
  // Order & Fulfillment
  static viewOrders:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOrderMgmtService.viewAssignedOrders(courier.id);
      next();
    } catch (e) { next(e); }
  };
  static acceptOrder:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOrderMgmtService.acceptOrderAssignment(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static rejectOrder:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOrderMgmtService.rejectOrderAssignment(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static markOrderPickedUp:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOrderMgmtService.markOrderPickedUp(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static markOrderDelivered:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOrderMgmtService.markOrderDelivered(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static viewOrderDetails:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOrderMgmtService.viewOrderDetails(courier.id, req.params.orderId);
      next();
    } catch (e) { next(e); }
  };
  static updateOrderStatus:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.IVendor;
    try {
      res.locals.success = true;
      res.locals.data = await CourierOrderMgmtService.updateOrderStatus(courier.id, req.params.orderId, req.body.status);
      next();
    } catch (e) { next(e); }
  };
}
export default CourierOrderMgmtController;