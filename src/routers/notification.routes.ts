import express from 'express';
import { notificationController } from '../controllers';
import { AuthJWT } from '../middlewares';
import { Routes } from './routeStrings';
import { notificationValidators } from '../validators';

const router = express.Router();
router.post(Routes.notifications,[
  AuthJWT,
  ...notificationValidators.CreateNotification,
  notificationController.CreateNotification
]);
export default router;