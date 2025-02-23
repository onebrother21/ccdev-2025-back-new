import Models from '../../../models';
import Types from "../../../types";
import Utils from '../../../utils';
import Services from '../../../services';

export class CourierAnalyticsService {
  // Earnings & Analytics
  /** 📌 Retrieves courier earnings over a specified period. */
  static getEarningsReport = async (courierId: string, startDate: string, endDate: string) => {
    const report = await Services.Reports.getEarningsReport(courierId,new Date(startDate),new Date(endDate));
    return report;
  }
  /** 📌 Analyzes delivery times and success rates. */
  static getOrderDeliveryStats = async (courierId: string) => {
    const trends = await Services.Reports.getOrderDeliveryStats(courierId);
    return trends;
  }
  /** 📌 Retrieves customer ratings and feedback for the courier. */
  static getCustomerRatings = async (courierId: string) => {
    const insights = await Services.Reports.getCustomerRatings(courierId);
    return insights;
  }
}