import express from 'express';
import { authController } from '../controllers';
import { authValidators } from '../../validators';
import { AuthJWT } from '../../middlewares';

const router = express.Router();
router.post("/register",[...authValidators.Register,authController.Register]);
router.post("/verify",[...authValidators.VerifyEmail,authController.VerifyEmail]);
router.post("/login",[...authValidators.Login,authController.Login]);
router.get("/auto",[AuthJWT,authController.Autologin]);
router.put("/update",[AuthJWT,...authValidators.Update,authController.UpdateUser]);

export default router;