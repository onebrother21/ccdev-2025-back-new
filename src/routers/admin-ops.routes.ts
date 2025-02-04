import express from 'express';
import { adminOpsController } from '../controllers';
import {
  AuthJWT,
  CheckUserRole,
  CheckAdminScopes,
} from '../middlewares';
import { Routes } from './routeStrings';
import { adminValidators } from '../validators';

const router = express.Router();
router.post(Routes.adminOps+"/bvars",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["bvars"]),adminOpsController.UpdateVars]);
router.get(Routes.adminOps+"/keys",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["sysadmin"]),adminOpsController.GenerateKeys]);
router.put(Routes.adminOps+"/admin",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["admins"]),adminOpsController.UpdateAdmin]);
router.post(Routes.adminOps+"/admin/approval",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["admins"]),adminOpsController.UpdateAdminApproval]);
router.post(Routes.adminOps+"/courier/approval",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["admins"]),adminOpsController.UpdateCourierApproval]);
router.post(Routes.adminOps+"/vendor/approval",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["admins"]),adminOpsController.UpdateVendorApproval]);

export default router;