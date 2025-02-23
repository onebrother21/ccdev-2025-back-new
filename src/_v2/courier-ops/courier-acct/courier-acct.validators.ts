import { check, param, body } from 'express-validator';
import { CheckValidation } from '../../../middlewares';
import Utils from '../../../utils';

export class CourierAcctMgmtValidators {
  // 📌 Courier Management Validators
  static registerCourier = [[
    body('name').notEmpty().withMessage('Courier name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').isMobilePhone("en-US").withMessage('Valid phone number is required'),
    body('businessHours').optional().isObject().withMessage('Invalid business hours format'),
    body('data.address').isObject().custom(Utils.notEmpty).withMessage('Invalid address info'),
    body('data.address.streetAddr').if(body('data.address').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info'),
    body('data.address.city').if(body('data.address').exists()).trim().escape().notEmpty().withMessage('Invalid address info'),
    body('data.address.state').if(body('data.address').exists()).trim().escape().isIn(Utils.stateAbbreviations).withMessage('Invalid address info'),
    body('data.address.postal').if(body('data.address').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info'),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info'),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info'),
    body('data.location').isArray({min:2,max:2}).withMessage('Invalid location'),
    body('data.location.*').isNumeric().withMessage('Invalid location'),
  ],CheckValidation()] as IHandler[];
  static updateCourierProfile = [[
    body('name').optional().notEmpty().withMessage('Courier name cannot be empty').optional(),
    body('email').optional().isEmail().withMessage('Invalid email format').optional(),
    body('phone').optional().notEmpty().withMessage('Phone number cannot be empty').optional(),
    body('businessHours').optional().isObject().withMessage('Invalid business hours format').optional(),
    body('data.address').isObject().custom(Utils.notEmpty).withMessage('Invalid address info').optional(),
    body('data.address.streetAddr').if(body('data.address').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info').optional(),
    body('data.address.city').if(body('data.address').exists()).trim().escape().notEmpty().withMessage('Invalid address info').optional(),
    body('data.address.state').if(body('data.address').exists()).trim().escape().isIn(Utils.stateAbbreviations).withMessage('Invalid address info').optional(),
    body('data.address.postal').if(body('data.address').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info').optional(),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info').optional(),
    body('data.location').isArray({min:2,max:2}).withMessage('Invalid location').optional(),
    body('data.location.*').isNumeric().withMessage('Invalid location').optional(),
  ],CheckValidation()] as IHandler[];
  static deleteCourierAccount = [[
    body('confirmDelete').equals('YES').withMessage('You must confirm account deletion')
  ],CheckValidation()] as IHandler[];
}
export default CourierAcctMgmtValidators;