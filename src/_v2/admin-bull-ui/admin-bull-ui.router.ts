import { Router } from 'express';
import { AdminBullUiController as ctrl } from './admin-bull-ui.controller';
import { adminValidators } from '../../validators';
import {
  AuthJWT,
  CheckUserRole,
  CheckAdminScopes,
} from '../../middlewares';
import { getBullBoardRouter } from "./admin-bull-ui.init";
import Utils from '../../utils';

const AdminBullUiRouter = (cache:Utils.RedisCache) => {
  const router = Router();
  const BullBoardRouter = getBullBoardRouter({
    queueNames:[
      "random-sleep",
      "schedule-notifications",
      "format-notification",
      "send-notification",
      "auto-assign-couriers",
      "bulk-edit-collection",
      "log-data",
      "clock-bugs",
    ],
    basePath:'/jobs',
    refreshInterval:10 * 60 * 1000,
    logout:true,
  });
  
  router.get('/login',ctrl.RenderLogin);
  router.post('/login',ctrl.Login);
  router.get('/logout',ctrl.Logout);
  router.use('/',ctrl.CheckLogin,BullBoardRouter);  

  return router;
};
export { AdminBullUiRouter };
export default AdminBullUiRouter;