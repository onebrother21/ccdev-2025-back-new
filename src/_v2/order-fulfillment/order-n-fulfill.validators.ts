import { body, param, query } from 'express-validator';
import { CommonUtils, stateAbbreviations } from '../../utils';
import { CheckValidation } from '../../middlewares';

const CreateOrder = [[
  body('data.total').isFloat({gt:0}).withMessage('Invalid total amount'),
  body('data.description').trim().escape().notEmpty().withMessage('Invalid description').optional(),
  body('data.deliveryAddress').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid address info'),
  body('data.deliveryAddress.streetAddr').if(body('data.deliveryAddress').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info'),
  body('data.deliveryAddress.city').if(body('data.deliveryAddress').exists()).trim().escape().notEmpty().withMessage('Invalid address info'),
  body('data.deliveryAddress.state').if(body('data.deliveryAddress').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid address info'),
  body('data.deliveryAddress.postal').if(body('data.deliveryAddress').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info'),
  body('data.deliveryAddress.country').if(body('data.deliveryAddress').exists()).trim().escape().equals("USA").withMessage('Invalid address info'),
  body('data.scheduledFor').isISO8601().isAfter(new Date().toISOString()).withMessage('Invalid date'),
  body('data.vendor').isMongoId().withMessage('Invalid date'),
  body('data.items').isArray({min:1}).withMessage('Order must contain at least one item'),
  body('data.items.*.itemId').if(body('data.items').exists()).isMongoId().withMessage("Invalid items"),
  body('data.items.*.name').if(body('data.items').exists()).trim().escape().matches(/^[a-zA-Z0-9\s\']{2,20}$/).withMessage("Invalid items"),
  body('data.items.*.quantity').if(body('data.items').exists()).isFloat({gt:0}).withMessage("Invalid items"),
  body('data.items.*.price').if(body('data.items').exists()).isFloat({gt:0}).withMessage("Invalid items"),
  body('data.items.*.total').if(body('data.items').exists()).isInt({gt:0}).withMessage("Invalid items"),
  body('data')
    .isObject()
    .withMessage('Order data must be an object')
    .notEmpty()
    .withMessage('Order data cannot be empty'),
  body('data.items').isArray({ min: 1 }),
  body('data.customer').isMongoId().withMessage('Valid customer ID is required'),
],CheckValidation] as IHandler[];

const UpdateOrder = [[
  param('id').isMongoId().withMessage('Valid order ID is required'),
  body('data').isObject().optional(),
],CheckValidation] as IHandler[];

const AssignCourier = [[
  param('id').isMongoId().withMessage('Valid order ID is required'),
  body('courierId').isMongoId().withMessage('Valid courier ID is required'),
],CheckValidation] as IHandler[];

const MarkAsFulfilled = [[
  param('id').isMongoId().withMessage('Valid order ID is required'),
],CheckValidation] as IHandler[];

const MarkAsDelivered = [[
  param('id').isMongoId().withMessage('Valid order ID is required'),
],CheckValidation] as IHandler[];

const CancelOrder = [[
  param('id').isMongoId().withMessage('Valid order ID is required'),
],CheckValidation] as IHandler[];

export const orderValidators = {
  CreateOrder,
  UpdateOrder,
  AssignCourier,
  MarkAsFulfilled,
  MarkAsDelivered,
  CancelOrder,
};

export default orderValidators;