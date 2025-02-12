import { body, param, query } from 'express-validator';
import { CheckValidation } from '../../middlewares';

export const courierAssignmentValidators = {
  FindAvailableCouriers: [[
    query('vendorId').isMongoId().withMessage('Invalid vendor ID'),
    query('orderId').isMongoId().withMessage('Invalid order ID'),
  ],CheckValidation] as IHandler[],
  AssignCourier: [[
    body('orderId').isMongoId().withMessage('Invalid order ID'),
    body('courierId').isMongoId().withMessage('Invalid courier ID'),
  ],CheckValidation] as IHandler[],
  AcceptOrder: [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('courierId').isMongoId().withMessage('Invalid courier ID'),
  ],CheckValidation] as IHandler[],
  RejectOrder: [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('courierId').isMongoId().withMessage('Invalid courier ID'),
    body('reason').isString().withMessage('Rejection reason is required'),
  ],CheckValidation] as IHandler[],
  FulfillOrder: [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('status')
      .isIn(['picked_up', 'delivered'])
      .withMessage('Status must be either "picked_up" or "delivered"'),
  ],CheckValidation] as IHandler[],
};
export default courierAssignmentValidators;
