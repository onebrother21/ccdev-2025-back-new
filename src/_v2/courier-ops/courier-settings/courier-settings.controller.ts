import Types from "../../../types";
import { CourierSettingsService } from "./courier-settings.service";

export class CourierSettingsController {
  // 📌 Updates courier business hours
  static updateBusinessHours:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.ICourier;
    try {
      const { open, close } = req.body;
      const data = await CourierSettingsService.updateBusinessHours(courier.id, { open, close });
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Enables or disables automatic order acceptance
  static setAutoAcceptOrders:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.ICourier;
    try {
      const { autoAccept } = req.body;
      const data = await CourierSettingsService.setAutoAcceptOrders(courier.id, autoAccept);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Defines preferred couriers or delivery conditions
  static setCourierPreferences:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.ICourier;
    try {
      const { preferences } = req.body;
      const data = await CourierSettingsService.setCourierPreferences(courier.id, preferences);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
}
export default CourierSettingsController;