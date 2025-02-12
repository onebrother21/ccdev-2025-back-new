import { check, param, body } from 'express-validator';
import { CheckValidation } from '../../middlewares';
import { CommonUtils, stateAbbreviations } from '../../utils';

export const CourierOpsValidators = {
  // 📌 Courier Management Validators
  registerCourier: [[
    body('name').notEmpty().withMessage('Courier name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('phone').isMobilePhone("en-US").withMessage('Valid phone number is required'),
    body('businessHours').optional().isObject().withMessage('Invalid business hours format'),
    body('data.address').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid address info'),
    body('data.address.streetAddr').if(body('data.address').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info'),
    body('data.address.city').if(body('data.address').exists()).trim().escape().notEmpty().withMessage('Invalid address info'),
    body('data.address.state').if(body('data.address').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid address info'),
    body('data.address.postal').if(body('data.address').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info'),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info'),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info'),
    body('data.location').isArray({min:2,max:2}).withMessage('Invalid location'),
    body('data.location.*').isNumeric().withMessage('Invalid location'),
  ],CheckValidation] as IHandler[],
  updateCourierProfile: [[
    body('name').optional().notEmpty().withMessage('Courier name cannot be empty').optional(),
    body('email').optional().isEmail().withMessage('Invalid email format').optional(),
    body('phone').optional().notEmpty().withMessage('Phone number cannot be empty').optional(),
    body('businessHours').optional().isObject().withMessage('Invalid business hours format').optional(),
    body('data.address').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid address info').optional(),
    body('data.address.streetAddr').if(body('data.address').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info').optional(),
    body('data.address.city').if(body('data.address').exists()).trim().escape().notEmpty().withMessage('Invalid address info').optional(),
    body('data.address.state').if(body('data.address').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid address info').optional(),
    body('data.address.postal').if(body('data.address').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info').optional(),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info').optional(),
    body('data.location').isArray({min:2,max:2}).withMessage('Invalid location').optional(),
    body('data.location.*').isNumeric().withMessage('Invalid location').optional(),
  ],CheckValidation] as IHandler[],
  deleteCourierAccount: [[
    body('confirmDelete').equals('YES').withMessage('You must confirm account deletion')
  ],CheckValidation] as IHandler[],
  // 📌 Order & Fulfillment Validators
  acceptOrder: [[
    param('orderId').isMongoId().withMessage('Invalid order ID')
  ],CheckValidation] as IHandler[],
  rejectOrder: [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('reason').notEmpty().withMessage('Rejection reason is required')
  ],CheckValidation] as IHandler[],
  markOrderPickedUp: [[
    param('orderId').isMongoId().withMessage('Invalid order ID')
  ],CheckValidation] as IHandler[],
  markOrderDelivered: [[
    param('orderId').isMongoId().withMessage('Invalid order ID')
  ],CheckValidation] as IHandler[],
  updateOrderStatus: [[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    body('status').isIn(['preparing', 'ready', 'completed']).withMessage('Invalid status value')
  ],CheckValidation] as IHandler[],

  // 📌 Courier Navigation & location  
  getDeliveryRoute:[[
    param('orderId').isMongoId().withMessage('Invalid order ID'),
  ],CheckValidation] as IHandler[],
  updateCourierLocation:[[
    body('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('location.lng').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  ],CheckValidation] as IHandler[],
  trackCourierLocation:[[
    param('courierId').isMongoId().withMessage('Invalid courier ID'),
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
    body('businessHours').isObject().withMessage('Business hours must be an object')
  ],CheckValidation] as IHandler[],

  setAutoAcceptOrders: [[
    body('autoAccept').isBoolean().withMessage('Auto-accept must be true or false')
  ],CheckValidation] as IHandler[],

  setCourierPreferences: [[
    body('preferredCouriers').optional().isArray().withMessage('Preferred couriers must be an array')
  ],CheckValidation] as IHandler[],
};
