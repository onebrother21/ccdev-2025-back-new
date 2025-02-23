import { check, param, body } from 'express-validator';
import { CheckValidation } from '../../../middlewares';
import Utils from '../../../utils';

export class CourierSettingsValidators {
  // 📌 Settings & Preferences Validators
  static updateBusinessHours = [[
    body('businessHours').isObject().withMessage('Business hours must be an object')
  ],CheckValidation()] as IHandler[];
  static setAutoAcceptOrders = [[
    body('autoAccept').isBoolean().withMessage('Auto-accept must be true or false')
  ],CheckValidation()] as IHandler[];
  static setCourierPreferences = [[
    body('preferredCouriers').optional().isArray().withMessage('Preferred couriers must be an array')
  ],CheckValidation()] as IHandler[];
}
export default CourierSettingsValidators;