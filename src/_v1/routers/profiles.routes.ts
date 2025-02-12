import express from 'express';
import { profilesController } from '../controllers';
import { AuthJWT } from '../../middlewares';
import {
  adminValidators,
  courierValidators,
  customerValidators,
  vendorValidators
} from '../../validators';

const router = express.Router();
/*
router.post("/",[AuthJWT,...adminValidators.CreateAdmin,profilesController.AddProfile]);
//router.get("/:adminId",[AuthJWT,profilesController.GetProfile,
router.put("/:adminId",[AuthJWT,...adminValidators.UpdateAdmin,profilesController.UpdateProfile]);

router.post("/",[AuthJWT,...courierValidators.CreateCourier,profilesController.AddProfile]);
//router.get("/:courierId",[AuthJWT,profilesController.GetProfile,
router.put("/:courierId",[AuthJWT,...courierValidators.UpdateCourier,profilesController.UpdateProfile]);

router.post("/",[AuthJWT,...customerValidators.CreateCustomer,profilesController.AddProfile]);
//router.get("/:customerId",[AuthJWT,profilesController.GetProfile,
router.put("/:customerId",[AuthJWT,...customerValidators.UpdateCustomer,profilesController.UpdateProfile]);

router.post("/",[AuthJWT,...vendorValidators.CreateVendor,profilesController.AddProfile]);
//router.get("/:vendorId",[AuthJWT,profilesController.GetProfile,
router.put("/:vendorId",[AuthJWT,...vendorValidators.UpdateVendor,profilesController.UpdateProfile]);
*/
export default router;