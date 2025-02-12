import express from 'express';
import { adminOpsController } from '../controllers';
import { adminValidators } from '../../validators';
import {
  AuthJWT,
  CheckUserRole,
  CheckAdminScopes,
} from '../../middlewares';

const router = express.Router();
router.post("/bvars",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["bvars"]),adminOpsController.UpdateVars]);
router.get("/keys",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["sysadmin"]),adminOpsController.GenerateKeys]);
router.put("/admin",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["admins"]),adminOpsController.UpdateAdmin]);
router.post("/admin/approval",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["admins"]),adminOpsController.UpdateAdminApproval]);
router.post("/courier/approval",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["admins"]),adminOpsController.UpdateCourierApproval]);
router.post("/vendor/approval",[AuthJWT,CheckUserRole(["admin"]),CheckAdminScopes(["admins"]),adminOpsController.UpdateVendorApproval]);

export default router;