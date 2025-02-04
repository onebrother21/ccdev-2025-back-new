import { body,oneOf } from "express-validator";
import { CheckValidation } from "../middlewares";

const AuthValidators = {
  Register:[[
    body('data.name').isObject().withMessage('Invalid name'),
    body('data.name.first').isString().withMessage('Invalid name').matches(/^[a-zA-Z\s]{2,20}$/).withMessage('Invalid name'),
    body('data.name.last').isString().withMessage('Invalid name').matches(/^[a-zA-Z\s]{2,20}$/).withMessage('Invalid name'),
    body('data.email').isEmail().withMessage('Invalid email'),
    body('data.dob').isISO8601().withMessage('Invalid DOB').isBefore(new Date().toISOString()),
    body('data.mobile').isMobilePhone("en-US").withMessage('Invalid mobile number'),
    body('data.pin').isString().isLength({min:4,max:4}).withMessage('Invalid pin'),
  ],CheckValidation] as IHandler[],
  VerifyEmail:[[
    body('data.email').isEmail().withMessage('Invalid email'), 
    body('data.verification').isString().isLength({min:6}).withMessage('Invalid verification code'),
  ],CheckValidation] as IHandler[],
  Login:[[
    body('data.email').isEmail().withMessage('Invalid email'), 
    body('data.pin').isString().isLength({min:4,max:4}).withMessage('Invalid pin'),
  ],CheckValidation] as IHandler[],
  Update:[[
    body('data.name').isObject().withMessage('Invalid name').optional(),
    body('data.name.first').isString().withMessage('Invalid name').matches(/^[a-zA-Z\s]{2,20}$/).withMessage('Invalid name').optional(),
    body('data.name.last').isString().withMessage('Invalid name').matches(/^[a-zA-Z\s]{2,20}$/).withMessage('Invalid name').optional(),
    body('data.email').isEmail().withMessage('Invalid email').optional(),
    body('data.bio').isString().isLength({min:4}).withMessage('Invalid bio').optional(),
    body('data.title').isString().isLength({min:4}).withMessage('Invalid title').optional(),
    body('data.prefs').isObject().withMessage('Invalid preferences').optional(),
    oneOf([
      body('data.prefs.acceptCookies').if(body('data.prefs').exists()).isISO8601().withMessage('Invalid preferences'),
      body('data.prefs.acceptTerms').if(body('data.prefs').exists()).isISO8601().withMessage('Invalid preferences'),
      body('data.prefs.acceptPrivacy').if(body('data.prefs').exists()).isISO8601().withMessage('Invalid preferences'),
    ]),
  ],CheckValidation] as IHandler[],
};
export default AuthValidators;