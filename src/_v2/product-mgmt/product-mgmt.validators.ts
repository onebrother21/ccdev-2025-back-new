import { body, param, query } from 'express-validator';
import { CheckValidation } from '../../middlewares';
import Types from "../../types";
import Utils from '../../utils';


const productTypes = ["sativa","indica","hybrid"];
const CreateProduct = [[
  body('data.name').trim().escape().matches(/^[\w\s]{3,20}$/).withMessage('Invalid name'),
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
  body('data.receivedOn').isISO8601().withMessage('Invalid date'),
  body('data.expiration').isISO8601().withMessage('Invalid date'),
],CheckValidation()] as IHandler[];

const UpdateProduct = [[
  param('id').isMongoId().withMessage('Valid product ID is required'),
  body('data').isObject().optional(),
],CheckValidation()] as IHandler[];

const DeleteProduct = [[
  param('id').isMongoId().withMessage('Valid product ID is required'),
],CheckValidation()] as IHandler[];

const QueryProductsByVendor = [[
  query('vendorId').isMongoId().withMessage('Valid vendor ID is required'),
],CheckValidation()] as IHandler[];

export const productMgmtValidators = {
  CreateProduct,
  UpdateProduct,
  DeleteProduct,
  QueryProductsByVendor,
};
export default productMgmtValidators;