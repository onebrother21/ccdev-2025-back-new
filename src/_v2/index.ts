import { Router } from 'express';

//import ProductMgmtRouter from "./product-mgmt";
//import CourierAssignmentRouter from "./courier-assignment";

import AuthRouter from './auth';
import AdminOpsRouter from "./admin-ops";
import VendorOpsRouter from "./vendor-ops";
//import CourierOpsRouter from "./courier-ops";
import CustomerOpsRouter from "./customer-ops";

const V2Router = Router();

V2Router.use("/auth",AuthRouter);
V2Router.use("/admn",AdminOpsRouter)
V2Router.use("/vendor",VendorOpsRouter);
//V2Router.use("/courier",CourierOpsRouter);
V2Router.use("/customer",CustomerOpsRouter);

//V2Router.use(ProductMgmtRouter);
//V2Router.use(CourierAssignmentRouter);

export { V2Router };
export default V2Router;
export * from "./_public";
export * from "./admin-bull-ui";