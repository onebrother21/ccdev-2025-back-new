import { body,oneOf } from "express-validator";
import { CheckValidation } from "../middlewares";
import Types from "../types";
import Utils from "utils";

const ChatValidators = {
  CreateChat:[[
    body('data.type').trim().escape().isIn(["user-chat","service-chat"]).withMessage('Invalid type'),
    body('data.recipients').isArray({min:1}).withMessage('Invalid profiles'),
    body('data.recipients.*.id').if(body('data.recipients').exists()).isMongoId().withMessage('Invalid profiles'),
    body('data.recipients.*.ref').if(body('data.recipients').exists()).isIn(Object.values(Types.IProfileTypes)).withMessage('Invalid profiles'),
    body('data.content').trim().escape().notEmpty().withMessage('Invalid content'),
  ],CheckValidation] as IHandler[],
  AddMessage:[[
    body('data.type').trim().escape().isIn(["user-chat","service-chat"]).withMessage('Invalid type'),
    body('data.recipients').isArray({min:1}).withMessage('Invalid profiles'),
    body('data.recipients.*.id').if(body('data.recipients').exists()).isMongoId().withMessage('Invalid profiles'),
    body('data.recipients.*.ref').if(body('data.recipients').exists()).isIn(Object.values(Types.IProfileTypes)).withMessage('Invalid profiles'),
    body('data.content').trim().escape().notEmpty().withMessage('Invalid content'),
  ],CheckValidation] as IHandler[],
};
export default ChatValidators;