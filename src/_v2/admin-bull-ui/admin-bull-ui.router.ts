import { Router } from 'express';
import { AdminBullUiController as ctrl } from './admin-bull-ui.controller';
import { adminValidators } from '../../validators';
import {
  AuthJWT,
  CheckUserRole,
  CheckAdminScopes,
} from '../../middlewares';
import { getBullBoardRouter } from "./admin-bull-ui.init";

const router = Router();
const BullBoardRouter = getBullBoardRouter({
  queueNames:[
    "random-sleep",
    "schedule-notifications",
    "format-notification",
    "send-notification",
    "auto-assign-couriers",
    "bulk-edit-collection"
  ],
  basePath:'/jobs',
  refreshInterval:10 * 60 * 1000,
  logout:true,
});

router.get('/login',ctrl.RenderLogin);
router.post('/login',ctrl.Login);
router.get('/logout',ctrl.Logout);
router.use('/',ctrl.CheckLogin,BullBoardRouter);

export default router;