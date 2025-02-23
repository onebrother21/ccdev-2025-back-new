import Types from "../../../types";
import { CourierAnalyticsService } from "./courier-analytics.service";

export class CourierAnalyticsController {
  // 📌 Retrieves courier sales data for a given period
  static getEarningsReport:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.ICourier;
    try {
      const { startDate, endDate } = req.query;
      const data = await CourierAnalyticsService.getEarningsReport(courier.id, startDate as string, endDate as string);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Analyzes order volume and peak hours
  static getOrderDeliveryStats:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.ICourier;
    try {
      const data = await CourierAnalyticsService.getOrderDeliveryStats(courier.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
  // 📌 Provides insights on customer behavior and preferences
  static getCustomerRatings:IHandler = async (req,res,next) => {
    const courier = req.profile as Types.ICourier;
    try {
      const data = await CourierAnalyticsService.getCustomerRatings(courier.id);
      res.locals.success = true;
      res.locals.data = data;
      next();
    } catch (e) { next(e); }
  }
}
export default CourierAnalyticsController;