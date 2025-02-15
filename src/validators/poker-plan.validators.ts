import { body,oneOf } from "express-validator";
import { CheckValidation } from "../middlewares";
import Types from "../types";
import Utils from "utils";

const PokerPlanValidators = {
  CreatePokerPlan:[[
    body('data.name').isString().withMessage('Invalid name'),
    body('data.startDate').isISO8601().withMessage('Invalid start date'),
    body('data.endDate').isISO8601().withMessage('Invalid start date'),
    body('data.startBal').isFloat().withMessage('Invalid number'),
    body('data.bio').isString().isLength({max:140}).withMessage('Invalid bio').optional(),
    body('data.motto').isString().isLength({min:4,max:50}).withMessage('Invalid title').optional(),
    body('data.desc').isString().isLength({min:4,max:50}).withMessage('Invalid title').optional(),
    body('data.params').isObject().withMessage('Invalid parameters'),
    body('data.params.expPlayRate')
    .if(body('data.params').exists())
    .isString().isIn(["wk","2wk","3wk","mo","3mo","6mo","yr"]).withMessage('Invalid parameters'),
    body('data.params.expCTTRatio')
    .if(body('data.params').exists())
    .isFloat().withMessage('Invalid parameters'),
    body('data.params.expHitRate')
    .if(body('data.params').exists())
    .isFloat().withMessage('Invalid parameters'),
    body('data.params.expReturn')
    .if(body('data.params').exists())
    .isFloat().withMessage('Invalid parameters'),
    body('data.params.stdError')
    .if(body('data.params').exists())
    .isFloat().withMessage('Invalid parameters'),
  ],CheckValidation] as IHandler[],
  UpdatePokerPlan:[[
    oneOf([
      body('data.name').isString().withMessage('Invalid name').optional(),
      body('data.startDate').isISO8601().withMessage('Invalid start date').optional(),
      body('data.endDate').isISO8601().withMessage('Invalid start date').optional(),
      body('data.startBal').isFloat().withMessage('Invalid number').optional(),
      body('data.bio').isString().isLength({max:140}).withMessage('Invalid bio').optional(),
      body('data.motto').isString().isLength({min:4,max:50}).withMessage('Invalid title').optional(),
      body('data.desc').isString().isLength({min:4,max:50}).withMessage('Invalid title').optional(),
      body('data.status').trim().escape().isIn(Object.values(Types.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
      body('data.params').isObject().withMessage('Invalid parameters'),
      body('data.params.expPlayRate')
      .if(body('data.params').exists())
      .optional().isString().isIn([["wk","2wk","3wk","mo","3mo","6mo","yr"]]).withMessage('Invalid parameters'),
      body('data.params.expCTTRatio')
      .if(body('data.params').exists())
      .optional().isFloat().withMessage('Invalid parameters'),
      body('data.params.expHitRate')
      .if(body('data.params').exists())
      .optional().isFloat().withMessage('Invalid parameters'),
      body('data.params.expReturn')
      .if(body('data.params').exists())
      .optional().isFloat().withMessage('Invalid parameters'),
      body('data.params.stdError')
      .if(body('data.params').exists())
      .optional().isFloat().withMessage('Invalid parameters'),
    ])
  ],CheckValidation] as IHandler[],
};
export default PokerPlanValidators;