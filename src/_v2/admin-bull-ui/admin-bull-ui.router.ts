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
import MyQueueNames from '../../workers';

const AdminBullUiRouter = (cache:Utils.RedisCache) => {
  const BullBoardRouter = getBullBoardRouter({
    queueNames:Object.values(MyQueueNames),
    basePath:'/jobs',
    refreshInterval:10 * 60 * 1000,
    logout:true,
  });
  const router = Router();
  
  router.get('/login',ctrl.RenderLogin);
  router.post('/login',ctrl.Login);
  router.get('/logout',ctrl.Logout);
  router.use('/',ctrl.CheckLogin,BullBoardRouter);  

  return router;
};
export { AdminBullUiRouter };
export default AdminBullUiRouter;