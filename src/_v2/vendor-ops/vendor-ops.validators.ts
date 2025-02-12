import { body,param } from 'express-validator';
import { CheckValidation } from '../../middlewares';
import { CommonUtils, currencyCodes, stateAbbreviations } from '../../utils';
import * as AllTypes from "../../types";

export const VendorOpsValidators = {
  registerVendor: [[
    body('data.name').trim().escape().matches(/^[a-zA-Z0-9\s]{3,20}$/).withMessage('Vendor name is required'),
    body('data.email').isEmail().normalizeEmail().withMessage('Invalid email format'),
    body('data.phone').isMobilePhone("en-US").withMessage('Valid phone number is required'),
    body('data.hours').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid business hours'),
    body('data.hours.open').if(body('data.hrs').exists()).trim().escape().notEmpty().withMessage('Invalid business hours'),
    body('data.hours.close').if(body('data.hrs').exists()).trim().escape().notEmpty().withMessage('Invalid business hours'),
    body('data.address').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid address info'),
    body('data.address.streetAddr').if(body('data.address').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info'),
    body('data.address.city').if(body('data.address').exists()).trim().escape().notEmpty().withMessage('Invalid address info'),
    body('data.address.state').if(body('data.address').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid address info'),
    body('data.address.postal').if(body('data.address').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info'),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info'),
    body('data.location').isArray({min:2,max:2}).withMessage('Invalid location'),
    body('data.location.*').isNumeric().withMessage('Invalid location'),
  ],CheckValidation] as IHandler[],
  updateVendorProfile: [[
    body('data.name').optional().notEmpty().withMessage('Vendor name cannot be empty').optional(),
    body('data.email').optional().isEmail().withMessage('Invalid email format').optional(),
    body('data.phone').optional().notEmpty().withMessage('Phone number cannot be empty').optional(),
    body('data.hours').optional().isObject().withMessage('Invalid business hours format').optional(),
    body('data.hours.open').if(body('data.hours').exists()).notEmpty().trim().escape().withMessage('Invalid business hours').optional(),
    body('data.hours.close').if(body('data.hours').exists()).notEmpty().trim().escape().withMessage('Invalid business hours').optional(),
    body('data.address').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid address info').optional(),
    body('data.address.streetAddr').if(body('data.address').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info').optional(),
    body('data.address.city').if(body('data.address').exists()).trim().escape().notEmpty().withMessage('Invalid address info').optional(),
    body('data.address.state').if(body('data.address').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid address info').optional(),
    body('data.address.postal').if(body('data.address').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info').optional(),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info').optional(),
    body('data.location').isArray({min:2,max:2}).withMessage('Invalid location').optional(),
    body('data.location.*').isNumeric().withMessage('Invalid location').optional(),
  ],CheckValidation] as IHandler[],
  deleteVendorAccount: [[
    body('confirmDelete').equals('YES').withMessage('You must confirm account deletion')
  ],CheckValidation] as IHandler[],
  // 📌 Product Management Validators
  createProduct:[[
    body('data.name').trim().escape().matches(/^[\w\s]{3,20}$/).withMessage('Invalid name'),
    body('data.sku').trim().escape().matches(/^[a-zA-Z0-9]{6,20}$/).withMessage('Invalid type').optional(),
    body('data.type').trim().escape().isIn(Object.values(AllTypes.IProductTypes)).withMessage('Invalid type').optional(),
    body('data.kind').trim().escape().isIn(Object.values(AllTypes.IProductKinds)).withMessage('Invalid kind').optional(),
    body('data.description').trim().escape().notEmpty().isLength({max:140}).withMessage('Invalid description').optional(),
    body('data.concentration').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid parameters'),
    body('data.concentration.amt').if(body('data.concentration').exists()).isFloat({gt:0}).withMessage('Invalid parameters'),
    body('data.concentration.unit').if(body('data.concentration').exists()).trim().escape().notEmpty().withMessage('Invalid parameters'),
    body('data.price').custom(CommonUtils.notEmpty).withMessage('Invalid parameters'),
    body('data.price.amt').if(body('data.price').exists()).isFloat({gt:0}).withMessage('Invalid parameters'),
    body('data.price.curr').if(body('data.price').exists()).isString().isIn(currencyCodes).withMessage('Invalid parameters'),
    body('data.price.per').if(body('data.price').exists()).trim().escape().notEmpty().withMessage('Invalid parameters'),
    body('data.expiration').isISO8601().withMessage('Invalid date'),
    body('data.receivedOn').isISO8601().withMessage('Invalid date'),
    body('data.qty').isInt({gt:0}).withMessage('Invalid date'),
  ],CheckValidation] as IHandler[],
  updateProduct: [[
    body('data.name').trim().escape().matches(/^[\w\s]{3,20}$/).withMessage('Invalid name').optional(),
    body('data.sku').trim().escape().matches(/^[a-zA-Z0-9]{6,20}$/).withMessage('Invalid type').optional(),
    body('data.type').trim().escape().isIn(Object.values(AllTypes.IProductTypes)).withMessage('Invalid type').optional(),
    body('data.kind').trim().escape().isIn(Object.values(AllTypes.IProductKinds)).withMessage('Invalid kind').optional(),
    body('data.description').trim().escape().notEmpty().isLength({max:140}).withMessage('Invalid description').optional(),
    body('data.concentration').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid parameters').optional(),
    body('data.concentration.amt').if(body('data.concentration').exists()).isFloat({gt:0}).withMessage('Invalid parameters').optional(),
    body('data.concentration.unit').if(body('data.concentration').exists()).trim().escape().notEmpty().withMessage('Invalid parameters').optional(),
    body('data.price').custom(CommonUtils.notEmpty).withMessage('Invalid parameters').optional(),
    body('data.price.amt').if(body('data.price').exists()).isFloat({gt:0}).withMessage('Invalid parameters').optional(),
    body('data.price.curr').if(body('data.price').exists()).isString().isIn(currencyCodes).withMessage('Invalid parameters').optional(),
    body('data.price.per').if(body('data.price').exists()).trim().escape().notEmpty().withMessage('Invalid parameters').optional(),
    body('data.receivedOn').isISO8601().withMessage('Invalid date').optional(),
    body('data.expiration').isISO8601().withMessage('Invalid date').optional(),
  ],CheckValidation] as IHandler[],

  deleteProduct: [[
    param('productId').isMongoId().withMessage('Invalid product ID')
  ],CheckValidation] as IHandler[],

  // 📌 Order & Fulfillment Validators
  acceptOrder: [[
    param('orderId').isMongoId().withMessage('Invalid order ID')
  ],CheckValidation] as IHandler[],

  rejectOrder: [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('reason').notEmpty().withMessage('Rejection reason is required')
  ],CheckValidation] as IHandler[],

  markOrderReady: [[
    param('orderId').isMongoId().withMessage('Invalid order ID')
  ],CheckValidation] as IHandler[],

  updateOrderStatus: [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('status').isIn(['preparing', 'ready', 'completed']).withMessage('Invalid status value')
  ],CheckValidation] as IHandler[],

  // 📌 Courier Assignment & Delivery Validators
  assignCourierManually: [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('courierId').isMongoId().withMessage('Invalid courier ID')
  ],CheckValidation] as IHandler[],

  cancelCourierAssignment: [[
    param('orderId').isMongoId().withMessage('Invalid order ID')
  ],CheckValidation] as IHandler[],

  // 📌 Notifications & Communication Validators
  sendOrderUpdateNotification: [[
    body('orderId').isMongoId().withMessage('Invalid order ID'),
    body('message').notEmpty().withMessage('Notification message is required')
  ],CheckValidation] as IHandler[],

  sendBroadcastNotification: [[
    body('title').notEmpty().withMessage('Title is required'),
    body('message').notEmpty().withMessage('Message is required')
  ],CheckValidation] as IHandler[],

  // 📌 Analytics & Reporting Validators (No input required, so no validators needed)

  // 📌 Settings & Preferences Validators
  updateBusinessHours: [[
    body('hours').isObject().withMessage('Business hours must be an object')
  ],CheckValidation] as IHandler[],

  setAutoAcceptOrders: [[
    body('autoAccept').isBoolean().withMessage('Auto-accept must be true or false')
  ],CheckValidation] as IHandler[],

  setCourierPreferences: [[
    body('preferredCouriers').optional().isArray().withMessage('Preferred couriers must be an array')
  ],CheckValidation] as IHandler[],
};
export default VendorOpsValidators;