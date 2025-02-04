import { Express } from 'express';

import {
  publicRouter,
  authRouter,
  profilesRouter,
  adminOpsRouter,
  productRouter,
  orderRouter,
  pokerPlanRouter,
  taskRouter,
  notificationRouter,
  chatRouter,
} from '../routers';
import { Routes } from '../routers/routeStrings';

export default (app: Express) => {
  app.use(Routes.auth,authRouter);
  app.use(profilesRouter);
  app.use(adminOpsRouter);
  app.use(productRouter);
  app.use(orderRouter);
  app.use(pokerPlanRouter);
  app.use(taskRouter);
  app.use(notificationRouter);
  app.use(chatRouter);
};