import { check, param, body } from 'express-validator';
import { CheckValidation } from '../../../middlewares';
import Utils from '../../../utils';

export class CourierNotificationsValidators {
  // 📌 Notifications & Communication Validators
  static sendOrderUpdateNotification = [[
    body('orderId').isMongoId().withMessage('Invalid order ID'),
    body('message').notEmpty().withMessage('Notification message is required')
  ],CheckValidation()] as IHandler[];
  static sendBroadcastNotification = [[
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required')
  ],CheckValidation()] as IHandler[];
}
export default CourierNotificationsValidators;