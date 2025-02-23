import { Router } from 'express';
import { AdminOpsController as ctrl } from './admin-ops.controller';
import { AdminOpsValidators as validators } from './admin-ops.validators';
import { AuthJWT,PostMiddleware } from '../../middlewares';
import { V2Routes } from '../v2-routerstrings';
import Utils from '../../utils';

const AdminOpsRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.AdminOps
  const router = Router();
  
  router.use(AuthJWT());
  router.post(routes.system.createBusinessVars,[ctrl.registerAdmin,...PostMiddleware]);
  // 🔹 System Business Vars & Keys
  router.post(routes.system.createBusinessVars,[ctrl.createBusinessVars,...PostMiddleware]);
  router.get(routes.system.getBusinessVars,[ctrl.getBusinessVars(cache),...PostMiddleware]);
  router.put(routes.system.updateBusinessVars,[ctrl.updateBusinessVars(cache),...PostMiddleware]);
  router.get(routes.system.generateKeys,[ctrl.generateKeys,...PostMiddleware]);
  //🔹 System Job Processors
  router.post(routes.jobs.create,[...validators.PostJob,ctrl.postJob,...PostMiddleware]);
  router.post(routes.jobs.logVars,[...validators.PostJob,ctrl.postLogVarsJob,...PostMiddleware]);
  //🔹 Business Management
  router.post(routes.business.registerBusiness,[ctrl.registerBusiness,...PostMiddleware]);
  router.post(routes.business.verifyBusiness,[ctrl.verifyBusiness,...PostMiddleware]);
  router.post(routes.business.updateBusiness,[ctrl.updateBusinessProfile,...PostMiddleware]);
  router.post(routes.business.getBusiness,[ctrl.getBusinessProfile,...PostMiddleware]);
  router.post(routes.business.deleteBusiness,[ctrl.deleteBusinessAccount,...PostMiddleware]);
  // 🔹 User & Vendor Mgmt
  router.post(routes.admin.approveVendor,[ctrl.approveVendor,...PostMiddleware]);
  router.post(routes.admin.suspendVendor,[ctrl.suspendVendor,...PostMiddleware]);
  router.post(routes.admin.deleteVendor,[ctrl.deleteVendor,...PostMiddleware]);
  router.post(routes.admin.manageBusinessUsers,[ctrl.manageBusinessUsers,...PostMiddleware]);
  router.post(routes.admin.setUserPermissions,[ctrl.setUserPermissions,...PostMiddleware]);
  // 🔹 Financial Control
  router.post(routes.financials.processPayouts,[ctrl.processPayout,...PostMiddleware]);
  router.post(routes.financials.getPayoutHistory,[ctrl.getPayoutHistory,...PostMiddleware]);
  router.post(routes.financials.updateBankDetails,[ctrl.updateBankDetails,...PostMiddleware]);
  router.post(routes.financials.setTaxInformation,[ctrl.setTaxInformation,...PostMiddleware]);
  
  router.post(routes.financials.reviewPayoutRequests,[ctrl.reviewPayoutRequests,...PostMiddleware]);
  router.post(routes.financials.adjustVendorCommission,[ctrl.adjustVendorCommission,...PostMiddleware]);
  router.post(routes.financials.generateRevenueReports,[ctrl.generateRevenueReports,...PostMiddleware]);
  router.post(routes.financials.trackBusinessExpenses,[ctrl.trackBusinessExpenses,...PostMiddleware]);
  // 🔹 Order & Fulfillment Oversight
  router.post(routes.orders.monitorOrderActivity,[ctrl.monitorOrderActivity,...PostMiddleware]);
  router.post(routes.orders.resolveOrderDisputes,[ctrl.resolveOrderDisputes,...PostMiddleware]);
  router.post(routes.orders.enforceDeliverySLAs,[ctrl.enforceDeliverySLAs,...PostMiddleware]);
  router.post(routes.orders.viewBusinessOrders,[ctrl.viewBusinessOrders,...PostMiddleware]);
  router.post(routes.orders.updateOrderFulfillmentPolicy,[ctrl.updateOrderFulfillmentPolicy,...PostMiddleware]);
  // 🔹 Analytics & Insights
  router.post(routes.analytics.analyzeSalesPerformance,[ctrl.analyzeSalesPerformance,...PostMiddleware]);
  router.post(routes.analytics.getCustomerBehaviorReports,[ctrl.getCustomerBehaviorReports,...PostMiddleware]);
  router.post(routes.analytics.monitorVendorPerformance,[ctrl.monitorVendorPerformance,...PostMiddleware]);
  router.post(routes.analytics.generateOperationalReports,[ctrl.generateOperationalReports,...PostMiddleware]);
  // 🔹 System Settings & Policies
  router.post(routes.settings.updatePlatformPolicies,[ctrl.updatePlatformPolicies,...PostMiddleware]);
  router.post(routes.settings.configureBusinessSettings,[ctrl.configureBusinessSettings,...PostMiddleware]);
  router.post(routes.settings.managePromotions,[ctrl.managePromotions,...PostMiddleware]);
  router.post(routes.settings.handleSecurityIncidents,[ctrl.handleSecurityIncidents,...PostMiddleware]);
  // 🔹 Compliance & Support
  router.post(routes.support.auditVendorCompliance,[ctrl.auditVendorCompliance,...PostMiddleware]);
  router.post(routes.support.reviewCustomerComplaints,[ctrl.reviewCustomerComplaints,...PostMiddleware]);
  router.post(routes.support.manageSupportTickets,[ctrl.manageSupportTickets,...PostMiddleware]);

  return router;
};
export { AdminOpsRouter };
export default AdminOpsRouter;