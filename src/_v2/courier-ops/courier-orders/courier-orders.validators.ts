import { check, param, body } from 'express-validator';
import { CheckValidation } from '../../../middlewares';
import Utils from '../../../utils';

export class CourierOrderMgmtValidators {
  // 📌 Order & Fulfillment Validators
  static acceptOrder = [[
    param('orderId').isMongoId().withMessage('Invalid order ID')
  ],CheckValidation()] as IHandler[];
  static rejectOrder = [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('reason').notEmpty().withMessage('Rejection reason is required')
  ],CheckValidation()] as IHandler[];
  static markOrderPickedUp = [[param('orderId').isMongoId().withMessage('Invalid order ID')],CheckValidation()] as IHandler[];
  static markOrderDelivered = [[param('orderId').isMongoId().withMessage('Invalid order ID')],CheckValidation()] as IHandler[];
  static updateOrderStatus = [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('status').isIn(['preparing', 'ready', 'completed']).withMessage('Invalid status value')
  ],CheckValidation()] as IHandler[];
}
export default CourierOrderMgmtValidators;