import { body,oneOf } from "express-validator";
import { CheckValidation } from "../middlewares";
import Types from "../types";
import Utils from "utils";

const taskCategories = ["dev-frontend","dev-backend","business-planning","person-planning"];
const TaskValidators = {
  CreateTask:[[
    body('data.category').trim().escape().isIn(taskCategories).withMessage('Invalid category'),
    body('data.type').trim().escape().matches(/[a-zA-Z]{2,20}/).withMessage('Invalid type'),
    body('data.name').trim().escape().matches(/^[\w\s]+$/).withMessage('Invalid name'),
    body('data.description').trim().escape().notEmpty().isLength({max:140}).withMessage('Invalid description').optional(),
    body('data.amt').isFloat({gt:0}).withMessage('Invalid parameters').optional(),
    body('data.dueOn').isISO8601().withMessage('Invalid parameters'),
    body('data.recurring').isBoolean().withMessage('Invalid parameters').optional(),
    body('data.recurringInterval').trim().escape().notEmpty().withMessage('Invalid parameters').optional(),
  ],CheckValidation] as IHandler[],
  UpdateTask:[[
    body('data.category').trim().escape().isIn(taskCategories).withMessage('Invalid category').optional(),
    body('data.type').trim().escape().matches(/[a-zA-Z]{2,20}/).withMessage('Invalid type').optional(),
    body('data.name').trim().escape().matches(/^[\w\s]+$/).withMessage('Invalid name').optional(),
    body('data.description').trim().escape().notEmpty().isLength({max:140}).withMessage('Invalid description').optional(),
    body('data.amt').isFloat({gt:0}).withMessage('Invalid parameters').optional(),
    body('data.dueOn').isISO8601().withMessage('Invalid date').optional(),
    body('data.recurring').isBoolean().withMessage('Invalid parameters').optional(),
    body('data.recurringInterval').trim().escape().notEmpty().withMessage('Invalid parameters').optional(),
    body('data.status').trim().escape().isIn(Object.values(Types.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
    body('data.progress').isFloat({gt:0}).withMessage('Invalid parameters').optional(),
  ],CheckValidation] as IHandler[],
  AddNote:[[
    body('data.user').notEmpty().isMongoId().withMessage("Invalid users"),
    body('data.msg').trim().escape().notEmpty().isLength({max:140}).withMessage("Invalid users"),
  ],CheckValidation] as IHandler[],
  CompleteTask:[[
    body('data.reason').trim().escape().matches(/[a-zA-Z]{2,20}/).withMessage("Invalid users"),
    body('data.resolution').trim().escape().notEmpty().isLength({max:140}).withMessage("Invalid users"),
  ],CheckValidation] as IHandler[],
};
export default TaskValidators;