import express from 'express';
import { profilesController } from '../controllers';
import { AuthJWT } from '../middlewares';
import { Routes } from './routeStrings';
import {
  adminValidators,
  courierValidators,
  customerValidators,
  vendorValidators
} from '../validators';

const router = express.Router();
router.post(Routes.admins,[AuthJWT,...adminValidators.CreateAdmin,profilesController.AddProfile]);
//router.get(Routes.adminId,[AuthJWT,profilesController.GetProfile,
router.put(Routes.adminId,[AuthJWT,...adminValidators.UpdateAdmin,profilesController.UpdateProfile]);

router.post(Routes.couriers,[AuthJWT,...courierValidators.CreateCourier,profilesController.AddProfile]);
//router.get(Routes.courierId,[AuthJWT,profilesController.GetProfile,
router.put(Routes.courierId,[AuthJWT,...courierValidators.UpdateCourier,profilesController.UpdateProfile]);

router.post(Routes.customers,[AuthJWT,...customerValidators.CreateCustomer,profilesController.AddProfile]);
//router.get(Routes.customerId,[AuthJWT,profilesController.GetProfile,
router.put(Routes.customerId,[AuthJWT,...customerValidators.UpdateCustomer,profilesController.UpdateProfile]);

router.post(Routes.vendors,[AuthJWT,...vendorValidators.CreateVendor,profilesController.AddProfile]);
//router.get(Routes.vendorId,[AuthJWT,profilesController.GetProfile,
router.put(Routes.vendorId,[AuthJWT,...vendorValidators.UpdateVendor,profilesController.UpdateProfile]);

export default router;