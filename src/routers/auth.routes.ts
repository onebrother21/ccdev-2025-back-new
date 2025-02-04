import express from 'express';
import { authController } from '../controllers';
import { Routes } from './routeStrings';
import { AuthJWT } from '../middlewares';
import { authValidators } from '../validators';

const router = express.Router();
router.post(Routes.register,[...authValidators.Register,authController.Register]);
router.post(Routes.verifyEmail,[...authValidators.VerifyEmail,authController.VerifyEmail]);
router.post(Routes.login,[...authValidators.Login,authController.Login]);
router.get(Routes.autologin,[AuthJWT,authController.Autologin]);
router.put(Routes.update,[AuthJWT,...authValidators.Update,authController.UpdateUser]);

export default router;