import Types from "../../../types";
import { CourierAcctMgmtService } from "./courier-acct.service";

export class CourierAcctMgmtController {
  // Courier Management
  static registerCourier:IHandler = async (req,res,next) => {
    const user = req.user as Types.IUser;
    try {
      res.locals.success = true;
      res.locals.message = "You have registered a new courier profile!";
      res.locals.data = await CourierAcctMgmtService.registerCourier(user,req.body);
      next();
    } catch (e) { next(e); }
  };
  static updateCourierProfile:IHandler = async (req,res,next) => {
    const Courier = req.profile as Types.ICourier;
    try {
      res.locals.success = true;
      res.locals.data = await CourierAcctMgmtService.updateCourierProfile(Courier.id, req.body);
      next();
    } catch (e) { next(e); }
  };
  static getCourierProfile:IHandler = async (req,res,next) => {
    const Courier = req.profile as Types.ICourier;
    try {
        res.locals.success = true;
        res.locals.data = await CourierAcctMgmtService.getCourierProfile(Courier.id);
        next();
    } catch (e) { next(e); }
  };
  static deleteCourierProfile:IHandler = async (req,res,next) => {
    const Courier = req.profile as Types.ICourier;
    try {
      res.locals.success = true;
      res.locals.data = await CourierAcctMgmtService.deleteCourierProfile(Courier.id);
      next();
    } catch (e) { next(e); }
  };
  static deleteXCourierProfile:IHandler = async (req,res,next) => {
    const Courier = req.profile as Types.ICourier;
    try {
      res.locals.success = true;
      res.locals.data = await CourierAcctMgmtService.deleteXCourierProfile(Courier.id);
      next();
    } catch (e) { next(e); }
  };
}
export default CourierAcctMgmtController;