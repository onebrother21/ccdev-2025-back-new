import { Router } from 'express';

import ProductMgmtRouter from "./product-mgmt";
import CourierAssignmentRouter from "./courier-assignment";

import AuthRouter from './auth';
import AdminOpsRouter from "./admin-ops";
import VendorOpsRouter from "./vendor-ops";
import CourierOpsRouter from "./courier-ops";
import CustomerOpsRouter from "./customer-ops";
import LivestreamOpsRouter from "./livestream-ops";
import Utils from '../utils';

const getV2Router = (cache:Utils.RedisCache) => {
  const V2Router = Router();
  V2Router.use("/auth",AuthRouter(cache));
  V2Router.use("/admn",AdminOpsRouter(cache));
  V2Router.use("/vendor",VendorOpsRouter(cache));
  V2Router.use("/courier",CourierOpsRouter(cache));
  V2Router.use("/customer",CustomerOpsRouter(cache));
  V2Router.use("/livestreamz",LivestreamOpsRouter(cache));
  V2Router.use("/productMgmt",ProductMgmtRouter(cache));
  V2Router.use("/courierMgmt",CourierAssignmentRouter(cache));
  return V2Router;
};
export { getV2Router };
export default getV2Router;

export * from "./_public";
export * from "./admin-bull-ui";