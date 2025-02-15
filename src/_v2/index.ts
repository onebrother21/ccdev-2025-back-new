import { Router } from 'express';

import ProductMgmtRouter from "./product-mgmt";
import CourierAssignmentRouter from "./courier-assignment";

import AuthRouter from './auth';
import AdminOpsRouter from "./admin-ops";
import VendorOpsRouter from "./vendor-ops";
import CourierOpsRouter from "./courier-ops";
import CustomerOpsRouter from "./customer-ops";
import LivestreamOpsRouter from "./livestream-ops";
import { RedisCache } from 'init/redis-cache';

const getV2Router = (cache:RedisCache) => {
  const V2Router = Router();
  V2Router.use("/auth",AuthRouter);
  V2Router.use("/admn",AdminOpsRouter)
  V2Router.use("/vendor",VendorOpsRouter(cache));
  V2Router.use("/courier",CourierOpsRouter);
  V2Router.use("/customer",CustomerOpsRouter);
  V2Router.use("/livestreamz",LivestreamOpsRouter);
  V2Router.use("/productMgmt",ProductMgmtRouter);
  V2Router.use("/courierMgmt",CourierAssignmentRouter);
  return V2Router;
};
export { getV2Router };
export default getV2Router;

export * from "./_public";
export * from "./admin-bull-ui";