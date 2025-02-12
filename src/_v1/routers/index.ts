import authRouter from './auth.routes';
//import profilesRouter from './profiles.routes';
import adminOpsRouter from './admin-ops.routes';
import productRouter from './product.routes';
import orderRouter from './order.routes';
import pokerPlanRouter from './poker-plan.routes';
import taskRouter from "./task.router";
import notificationRouter from "./notification.routes";
import chatRouter from "./chat.router";
import bullUIRouter from "./bull-ui.routes";
import publicRouter from "./public.routes";

import express from 'express';

const router = express.Router();

router.use("/auth",authRouter);
//router.use(profilesRouter);
router.use("/adminOps",adminOpsRouter);
router.use("/products",productRouter);
router.use("/orders",orderRouter);
router.use("/pokerPlans",pokerPlanRouter);
router.use("/tasks",taskRouter);
router.use("/notifications",notificationRouter);
router.use("/chats",chatRouter);

export default router;
export {bullUIRouter,publicRouter};