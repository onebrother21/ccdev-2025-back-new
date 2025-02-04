import { body } from "express-validator";
import { CommonUtils, stateAbbreviations } from "../utils";
import { CheckValidation } from "../middlewares";

const CustomerValidators = {
  CreateCustomer:[[
    body('data.name').trim().escape().matches(/^[a-zA-Z0-9]{2,20}$/).withMessage('Invalid display name'),
    body('data.img').trim().escape().notEmpty().withMessage('Invalid image').optional(),
    body('data.address').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid address info').optional(),
    body('data.address.streetAddr').if(body('data.address').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info'),
    body('data.address.city').if(body('data.address').exists()).trim().escape().notEmpty().withMessage('Invalid address info'),
    body('data.address.state').if(body('data.address').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid address info'),
    body('data.address.postal').if(body('data.address').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info'),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info'),
    body('data.license').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid license data').optional(),
    body('data.license.num').if(body('data.license').exists()).trim().escape().matches(/^[0-9]{8,10}$/).withMessage('Invalid license data'),
    body('data.license.state').if(body('data.license').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid license data'),
    body('data.license.expires').if(body('data.license').exists()).isISO8601().withMessage('Invalid license data'),
  ],CheckValidation] as IHandler[],
  UpdateCustomer:[[
    body('data.name').trim().escape().matches(/^[a-zA-Z0-9]{2,20}$/).withMessage('Invalid display name').optional(),
    body('data.img').trim().escape().notEmpty().withMessage('Invalid image').optional(),
    body('data.address').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid address info').optional(),
    body('data.address.streetAddr').if(body('data.address').exists()).trim().escape().matches(/^\d+\s[\w\s,\.]+$/).withMessage('Invalid address info').optional(),
    body('data.address.city').if(body('data.address').exists()).trim().escape().notEmpty().withMessage('Invalid address info').optional(),
    body('data.address.state').if(body('data.address').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid address info').optional(),
    body('data.address.postal').if(body('data.address').exists()).trim().escape().isPostalCode("US").withMessage('Invalid address info').optional(),
    body('data.address.country').if(body('data.address').exists()).trim().escape().equals("USA").withMessage('Invalid address info').optional(),
    body('data.license').isObject().custom(CommonUtils.notEmpty).withMessage('Invalid license data').optional(),
    body('data.license.num').if(body('data.license').exists()).trim().escape().matches(/^[0-9]{8,10}$/).withMessage('Invalid license data').optional(),
    body('data.license.state').if(body('data.license').exists()).trim().escape().isIn(stateAbbreviations).withMessage('Invalid license data').optional(),
    body('data.license.expires').if(body('data.license').exists()).isISO8601().withMessage('Invalid license data').optional(),
  ],CheckValidation] as IHandler[],
};
export default CustomerValidators;