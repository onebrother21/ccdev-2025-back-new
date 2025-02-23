import { check, param, body, query } from 'express-validator';
import { CheckValidation } from '../../../middlewares';
import Utils from '../../../utils';

export class CourierLogisticsValidators {
  // 📌 Courier Navigation & location  
  
  static FindAvailableCouriers = [[
    query('vendorId').isMongoId().withMessage('Invalid vendor ID'),
    query('orderId').isMongoId().withMessage('Invalid order ID'),
  ],CheckValidation()] as IHandler[];

  static AssignCourier = [[
    body('orderId').isMongoId().withMessage('Invalid order ID'),
    body('courierId').isMongoId().withMessage('Invalid courier ID'),
  ],CheckValidation()] as IHandler[];
  static getDeliveryRoute = [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
  ],CheckValidation()] as IHandler[];
  static updateCourierLocation = [[
    body('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('location.lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  ],CheckValidation()] as IHandler[];
  static trackCourierLocation = [[
    param('courierId').isMongoId().withMessage('Invalid courier ID'),
  ],CheckValidation()] as IHandler[];
}
export default CourierLogisticsValidators;