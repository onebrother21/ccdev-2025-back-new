import Utils from '../../utils';
import Types from "../../types";
import Models from '../../models';
import Services from '../../services';
import MyQueueNames from "../../workers";

const myQueues = Object.values(MyQueueNames).reduce((o,k) => ({...o,[k]:Utils.createQueue(k)}),{});

export class AdminOpsService {
  static registerAdmin = async (user:Types.IUser,data:any) => {
    const role = Types.IProfileTypes.VENDOR;
    const vendor = new Models.Admin({
      ...data,
      mgr:user._id,
      users:[user._id],
      location:{type:"Point",coordinates:data.location}
    });
    await vendor.save();
    user.profiles[role] = vendor.id;
    await user.save();
    //Send VENDOR_REGISTERED
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {vendorName:vendor.name};
    await Services.Notification.createNotification("VENDOR_REGISTERED",notificationMethod,[user.id],notificationData);
    return true;
  };
  static postJob = async (user:Types.IUser,{type,opts:{delay,every} = {},data}:any) => {
    const opts:any = {};
    let result:any;
    switch(type){
      case "doRandomSleep":{
        if(!delay) throw new Utils.AppError(422,"operation failed");
        opts.delay = delay * 1000; // Convert seconds to milliseconds
        const job = await myQueues["random-sleep"].add('random-sleep-job',{ title:data.title }, opts);
        result = {message:`Random sleep processor added, Job: ${job.id}`};
        break;
      }
      case "scheduleNotifications":{
        if(!every) throw new Utils.AppError(422,"operation failed");
        opts.repeat = {every:every * 60 * 1000}; // Convert minutes to milliseconds
        const job = await myQueues["schedule-notifications"].add('schedule-notifications-job',{},opts);
        result =  {message:`Notification processor on repeat every ${every} ms, Job: ${job.id}`};
        break;
      }
      case "autoAssignCouriers":{
        if(!every) throw new Utils.AppError(422,"operation failed");
        opts.repeat = {every:every * 60 * 1000}; // Convert minutes to milliseconds
        const job = await myQueues["auto-assign-couriers"].add('auto-assign-couriers-job',{},opts);
        result =  {success: true,message:`Auto assigning couriers on repeat every ${every} ms, Job: ${job.id}`};
        break;
      }
      case "bulkEditCollection":{
        if(!(data.modelName && data.newProps)) throw new Utils.AppError(422,"operation failed");
        const job = await myQueues["bulk-edit-collection"].add('bulk-edit-collection-job',data,opts);
        result =  {success: true,message:`Bulk Edit: ${data.modelName.toLocaleUpperCase()} -> Submitted, Job: ${job.id}`};
        break;
      }
      case "logData":{
        if(!data) throw new Utils.AppError(422,"operation failed");
        const job = await myQueues["log-data"].add('log-data-job',data,opts);
        const jobId = job.id || "Unknown";
        result =  {success: true,message:`Log Data -> SUBMITTED, Job: ${jobId}`};
        break;
      }
      case "tokenCleanup":{
        if(!data) throw new Utils.AppError(422,"operation failed");
        opts.repeat = {every:every * 60 * 1000}; // Convert minutes to milliseconds
        const job = await myQueues["token-cleanup"].add('token-cleanup-job',data,opts);
        const jobId = job.id || "Unknown";
        result =  {success: true,message:`Token CleanUp -> SUBMITTED, Job: ${jobId}`};
        break;
      }
      default:throw new Utils.AppError(400,"no worker found");
    }
    //send registration notification
    const notificationMethod = Types.INotificationSendMethods.SMS;
    const notificationData = {type};
    await Services.Notification.createNotification("SYSTEM_ALERT",notificationMethod,[user.id],notificationData);
    return result;
  };
  
  //🔹 Business Management
  /** Registers a new business entity in the system. */
  static registerBusiness = async () => {};
  /** Updates business details like name, industry, and contact information. */
  static updateBusinessProfile = async () => {};
  /** Retrieves business profile details. */
  static getBusinessProfile = async () => {};
  /** Permanently deletes a business account and associated data. */
  static deleteBusinessAccount = async () => {};
  /** Submits required documents for business verification. */
  static verifyBusiness = async () => {};
  // 🔹 Financial Management
  /** Initiates a payout to a vendor’s bank or wallet. */
  static processPayout = async () => {};
  /** Retrieves a history of completed and pending payouts. */
  static getPayoutHistory = async () => {};
  /** Updates the bank account details for receiving payouts. */
  static updateBankDetails = async () => {};
  /** Adds or updates tax-related information for the business. */
  static setTaxInformation = async () => {};
  // 🔹 Order & Fulfillment Oversight
  /** Retrieves all orders across multiple vendors under the business. */
  static viewBusinessOrders = async () => {};
  /** Update the TOS. */
  static updateOrderFulfillmentPolicy = async () => {};
  //🔹 User & Vendor Management
  /**  Reviews and approves vendor applications. */
  static approveVendor = async () => {};
  /** Temporarily suspends a vendor due to policy violations or inactivity. */
  static suspendVendor = async () => {};
  /** Permanently removes a vendor and associated data. */
  static deleteVendor = async () => {};
  /** Adds, updates, or removes users with administrative roles. */
  static manageBusinessUsers = async () => {};
  /** Assigns and updates role-based access permissions. */
  static setUserPermissions = async () => {};
  //🔹 Financial Control
  /** Approves or denies vendor payout requests. */
  static reviewPayoutRequests = async () => {};
  /** Updates the commission percentage taken from vendor sales. */
  static adjustVendorCommission = async () => {};
  /** Retrieves revenue breakdowns for the business platform. */
  static generateRevenueReports = async () => {};
  /** Logs and tracks operational expenses. */
  static trackBusinessExpenses = async () => {};
  //🔹 Order & Fulfillment Oversight
  /** Provides real-time monitoring of order statuses and fulfillment. */
  static monitorOrderActivity = async () => {};
  /** Manages customer/vendor disputes and issues refunds when necessary. */
  static resolveOrderDisputes = async () => {};
  /** Ensures couriers meet service-level agreements for delivery times. */
  static enforceDeliverySLAs = async () => {};
  //🔹 Analytics & Insights
  /** Tracks sales trends and performance across vendors. */
  static analyzeSalesPerformance = async () => {};
  /** Provides insights into customer buying patterns. */
  static getCustomerBehaviorReports = async () => {};
  /** Assesses vendor activity, ratings, and compliance. */
  static monitorVendorPerformance = async () => {};
  /** Creates detailed reports on business operations. */
  static generateOperationalReports = async () => {};
  //🔹 System Settings & Policies
  /** Modifies terms of service, refund policies, and vendor agreements. */
  static updatePlatformPolicies = async () => {};
  /** Adjusts settings like tax rates, currency, and regional availability. */
  static configureBusinessSettings = async () => {};
  /** Creates and manages platform-wide promotions or seasonal discounts. */
  static managePromotions = async () => {};
  /** Logs and responds to security threats or data breaches. */
  static handleSecurityIncidents = async () => {};
  //🔹 Compliance & Support
  /** Ensures vendors comply with business and legal regulations. */
  static auditVendorCompliance = async () => {};
  /** Addresses escalated customer complaints and takes action. */
  static reviewCustomerComplaints = async () => {};
  /** Handles inquiries from vendors, couriers, and customers. */
  static manageSupportTickets = async () => {};
}