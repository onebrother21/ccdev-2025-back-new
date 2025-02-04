import express from 'express';
import { bullUIController } from '../controllers';
import {
  AuthJWT,
  CheckUserRole,
  CheckAdminScopes,
} from '../middlewares';
import { Routes } from './routeStrings';
import { adminValidators } from '../validators';
import { getBullUiServerAdapter } from '../init/bull-ui';

const { serverAdapter } = getBullUiServerAdapter();
const router = express.Router();
router.get('/logout',bullUIController.Logout);
router.get('/login',bullUIController.RenderLogin);
router.post('/login',bullUIController.Login);
router.post('/',bullUIController.CheckLogin,bullUIController.PostJob);
router.use('/',bullUIController.CheckLogin,serverAdapter.getRouter());

export default router;