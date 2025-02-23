import { body,oneOf } from "express-validator";
import { CheckValidation } from "../../middlewares";
import Utils from '../../utils';
import Types from "../../types";

export class AdminOpsValidators {
  static PostJob = [[
    body('data.type').trim().escape().notEmpty().withMessage("Job type is required"),
    body('data.opts.delay').isNumeric().withMessage("Invalid job parameters").optional(),
    body('data.opts.every').isNumeric().withMessage("Invalid job parameters").optional(),
    body('data.data').isObject().withMessage("Invalid job parameters").optional(),
  ],CheckValidation()] as IHandler[];
}
export default AdminOpsValidators;