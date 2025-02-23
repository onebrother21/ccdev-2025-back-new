import Types from "../../../types";
import { CourierLogisticsService } from "./courier-logistics.service";

export class CourierLogisticsController {
  // 📌 Sends an order update notification to the customer
  static getDeliveryRoute:IHandler = async (req,res,next) => {
    try {
        res.locals.success = true;
        res.locals.data = await CourierLogisticsService.getDeliveryRoute(req.params.orderId);
        next();
    } catch (e) { throw e; }
  };
  // 📌 Sends an order update notification to the customer
  static updateCourierLocation:IHandler = async (req,res,next) => {
    try {
        res.locals.success = true;
        res.locals.data = await CourierLogisticsService.updateCourierLocation(req.user.id, req.body.location);
        next();
    } catch (e) { throw e; }
  };
  // 📌 Sends an order update notification to the customer
  static trackCourierLocation:IHandler = async (req,res,next) => {
    try {
        res.locals.success = true;
        res.locals.data = await CourierLogisticsService.trackCourierLocation(req.params.courierId);
        next();
    } catch (e) { throw e; }
  };
  static FindAvailableCouriers:IHandler = async (req,res,next) => {
    try {
      const {availableCouriers:couriers} = await CourierLogisticsService.findAvaliable(req.query as any);
      res.locals = {succes:true,data:{couriers}};
    } catch(e){ next(e); }
  };
  static AssignCourier:IHandler = async (req,res,next) => {
    try {
      const { ok } = await CourierLogisticsService.assignCourier(req.body);
      res.locals = { success:true,message: 'Courier assigned successfully' };
    } catch (error) { next(error); }
  };
}
export default CourierLogisticsController;