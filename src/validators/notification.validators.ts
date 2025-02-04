import { body,oneOf } from "express-validator";
import { CheckValidation } from "../middlewares";
import * as AllTypes from "../types";

const NotificationValidators = {
  CreateNotification:[[
    body('data.type').trim().escape().isIn(Object.keys(AllTypes.INotificationTemplates)).withMessage('Invalid type'),
    body('data.audience').isArray({min:1}).withMessage('Invalid users'),
    body('data.audience.*').if(body('data.users').exists()).isMongoId().withMessage("Invalid users"),
    body('data.data').isObject().withMessage('Invalid parameters').optional(),
  ],CheckValidation] as IHandler[],
};
export default NotificationValidators;