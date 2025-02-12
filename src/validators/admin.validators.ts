import { body,oneOf } from "express-validator";
import { CommonUtils, stateAbbreviations } from "../utils";
import { CheckValidation } from "../middlewares";
import * as AllTypes from "../types";

const AdminValidators = {
  CreateAdmin:[[
    body('data.displayName').trim().escape().matches(/^[a-zA-Z0-9]{2,20}$/).withMessage('Invalid display name'),
    body('data.img').trim().escape().notEmpty().withMessage('Invalid image').optional(),
  ],CheckValidation] as IHandler[],
  UpdateAdmin:[[
    body('data.displayName').trim().escape().matches(/^[a-zA-Z0-9]{2,20}$/).withMessage('Invalid display name').optional(),
    body('data.img').trim().escape().notEmpty().withMessage('Invalid image').optional(),
    body('data.scopes')
    .isArray({min:1})
    .custom((arr:any[]) => arr.every(item => typeof item === 'string' && item.trim() !== ''))
    .withMessage('Invalid scopes')
    .optional(),
    body('data.scopes.*').if(body('data.scopes').exists()).trim().escape().optional(),
    body('data.approval').trim().escape().isIn(Object.values(AllTypes.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
  ],CheckValidation] as IHandler[],
};
export default AdminValidators;