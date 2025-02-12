import express from 'express';
import { notificationController } from '../controllers';
import { notificationValidators } from '../../validators';
import { AuthJWT } from '../../middlewares';

const router = express.Router();
router.post("/",[
  AuthJWT,
  ...notificationValidators.CreateNotification,
  notificationController.CreateNotification
]);
export default router;