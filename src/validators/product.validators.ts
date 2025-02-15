import { body,oneOf } from "express-validator";
import { CheckValidation } from "../middlewares";
import Types from "../types";
import Utils from "utils";

const productTypes = ["sativa","indica","hybrid"];
const productStatuses = ["coming-soon","in-stock","sold-out","no-longer-available"];
const ProductValidators = {
  CreateProduct:[[
    body('data.name').trim().escape().matches(/^[\w\s,\.]+$/).withMessage('Invalid name'),
    body('data.sku').trim().escape().matches(/^[a-zA-Z0-9]{6,20}$/).withMessage('Invalid type').optional(),
    body('data.type').trim().escape().isIn(productTypes).withMessage('Invalid type').optional(),
    body('data.description').trim().escape().notEmpty().isLength({max:140}).withMessage('Invalid description').optional(),
    body('data.concentration').isObject().custom(Utils.notEmpty).withMessage('Invalid parameters'),
    body('data.concentration.amt').if(body('data.concentration').exists()).isFloat({gt:0}).withMessage('Invalid parameters'),
    body('data.concentration.unit').if(body('data.concentration').exists()).trim().escape().notEmpty().withMessage('Invalid parameters'),
    body('data.price').custom(Utils.notEmpty).withMessage('Invalid parameters'),
    body('data.price.amt').if(body('data.price').exists()).isFloat({gt:0}).withMessage('Invalid parameters'),
    body('data.price.curr').if(body('data.price').exists()).isString().isIn(Utils.currencyCodes).withMessage('Invalid parameters'),
    body('data.price.per').if(body('data.price').exists()).trim().escape().notEmpty().withMessage('Invalid parameters'),
    body('data.receivedOn').isISO8601().withMessage('Invalid date').optional(),
    body('data.sellBy').isISO8601().withMessage('Invalid date').optional(),
  ],CheckValidation] as IHandler[],
  UpdateProduct:[[
    body('data.name').trim().escape().matches(/^[\w\s,\.]+$/).withMessage('Invalid name').optional(),
    body('data.sku').trim().escape().matches(/^[a-zA-Z0-9]{6,20}$/).withMessage('Invalid type').optional(),
    body('data.type').trim().escape().isIn(productTypes).withMessage('Invalid type').optional(),
    body('data.description').trim().escape().notEmpty().isLength({max:140}).withMessage('Invalid description').optional(),
    body('data.concentration').isObject().custom(Utils.notEmpty).withMessage('Invalid parameters').optional(),
    body('data.concentration.amt').if(body('data.concentration').exists()).isFloat({gt:0}).withMessage('Invalid parameters').optional(),
    body('data.concentration.unit').if(body('data.concentration').exists()).trim().escape().notEmpty().withMessage('Invalid parameters').optional(),
    body('data.price').custom(Utils.notEmpty).withMessage('Invalid parameters').optional(),
    body('data.price.amt').if(body('data.price').exists()).isFloat({gt:0}).withMessage('Invalid parameters').optional(),
    body('data.price.curr').if(body('data.price').exists()).isString().isIn(Utils.currencyCodes).withMessage('Invalid parameters').optional(),
    body('data.price.per').if(body('data.price').exists()).trim().escape().notEmpty().withMessage('Invalid parameters').optional(),
    body('data.receivedOn').isISO8601().withMessage('Invalid date').optional(),
    body('data.sellBy').isISO8601().withMessage('Invalid date').optional(),
    body('data.status').trim().escape().isIn(Object.values(Types.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
  ],CheckValidation] as IHandler[],
};
export default ProductValidators;