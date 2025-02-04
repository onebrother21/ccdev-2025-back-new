import { body,oneOf } from "express-validator";
import { CommonUtils, stateAbbreviations } from "../utils";
import { CheckValidation } from "../middlewares";

/*
customer:IUser;               // ID of the customer placing the order
  courier:ICourier;               // ID of the courier delivering the order
  vendor:IVendor;               // ID of the vendor fulfilling the order
  createdOn:Date;
  updatedOn:Date;
  total: number;              // Total price of the order
  description?:string;                    // Optional description of the order
  status:Status<IOrderStatuses>;         // Current status of the order (e.g., Placed, Shipped, Delivered)
  scheduledFor:"asap"|Date;              // Estimated or actual delivery date
  deliveredOn?:Date;              // Estimated or actual delivery date
  deliveryAddress:AddressObj;    // Address where the order will be delivered
  paymentStatus?:Status<IPaymentStatus>;     // Status of the payment (e.g., Paid, Pending, Failed)
  paymentMethod?:IPaymentMethod;    // Payment method used (e.g., Credit Card, Mobile Wallet)
  notes:INote[];                   // Optional notes or instructions from the customer
  tasks:ITask[];
  items:IOrderItem[]; 
*/
const OrderValidators = {
  CreateOrder:[[
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
    body('data.items').isArray({min:1}).withMessage('Invalid items'),
    body('data.items.*.itemId').if(body('data.items').exists()).isMongoId().withMessage("Invalid items"),
    body('data.items.*.name').if(body('data.items').exists()).trim().escape().matches(/^[a-zA-Z0-9\s\']{2,20}$/).withMessage("Invalid items"),
    body('data.items.*.quantity').if(body('data.items').exists()).isFloat({gt:0}).withMessage("Invalid items"),
    body('data.items.*.price').if(body('data.items').exists()).isFloat({gt:0}).withMessage("Invalid items"),
    body('data.items.*.total').if(body('data.items').exists()).isInt({gt:0}).withMessage("Invalid items"),
  ],CheckValidation] as IHandler[],
  UpdateOrder:[[
    body('data.total').isFloat({gt:0}).withMessage('Invalid total amount').optional(),
    body('data.description').trim().escape().notEmpty().withMessage('Invalid description').optional(),
    body('data.deliveryAddress').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid address info').optional(),
    body('data.deliveryAddress.streetAddr').if(body('data.deliveryAddress').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info').optional(),
    body('data.deliveryAddress.city').if(body('data.deliveryAddress').exists()).trim().escape().notEmpty().withMessage('Invalid address info').optional(),
    body('data.deliveryAddress.state').if(body('data.deliveryAddress').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid address info').optional(),
    body('data.deliveryAddress.postal').if(body('data.deliveryAddress').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info').optional(),
    body('data.deliveryAddress.country').if(body('data.deliveryAddress').exists()).trim().escape().equals("USA").withMessage('Invalid address info').optional(),
    body('data.scheduledFor').isISO8601().isAfter(new Date().toISOString()).withMessage('Invalid date').optional(),
    body('data.customer').isMongoId().withMessage('Invalid customer ID').optional(),
    body('data.courier').isMongoId().withMessage('Invalid courier ID').optional(),
    body('data.vendor').isMongoId().withMessage('Invalid vendor ID').optional(),
    body('data.items').isArray({min:1}).withMessage('Invalid items').optional(),
    body('data.items.*.itemId').if(body('data.items').exists()).isMongoId().withMessage("Invalid items").optional(),
    body('data.items.*.name').if(body('data.items').exists()).trim().escape().matches(/^[a-zA-Z0-9\s\']{2,20}$/).withMessage("Invalid items").optional(),
    body('data.items.*.quantity').if(body('data.items').exists()).isFloat({gt:0}).withMessage("Invalid items").optional(),
    body('data.items.*.price').if(body('data.items').exists()).isFloat({gt:0}).withMessage("Invalid items").optional(),
    body('data.items.*.total').if(body('data.items').exists()).isInt({gt:0}).withMessage("Invalid items").optional(),
  ],CheckValidation] as IHandler[],
};
export default OrderValidators;