import { body,oneOf } from "express-validator";
import { CheckValidation } from "../middlewares";
import Types from "../types";
import Utils from "utils";

const AuthValidators = {
  Signup:[[
    body('data.email').isEmail().withMessage('Invalid email'),
    body('data.dob').isISO8601().withMessage('Invalid DOB').custom(Utils.isEighteenOrOlder),
  ],CheckValidation] as IHandler[],
  VerifyEmail:[[
    body('data.email').isEmail().withMessage('Invalid email'), 
    body('data.verification').isString().isLength({min:6}).withMessage('Invalid verification code'),
  ],CheckValidation] as IHandler[],
  Register:[[
    body('data.name').isObject().withMessage('Invalid name'),
    body('data.name.first').isString().withMessage('Invalid name').matches(/^[a-zA-Z\s]{2,20}$/).withMessage('Invalid name'),
    body('data.name.last').isString().withMessage('Invalid name').matches(/^[a-zA-Z\s]{2,20}$/).withMessage('Invalid name'),
    body('data.username').trim().escape().matches(/^[a-zA-Z0-9]{2,20}$/).withMessage('Invalid username'),
    body('data.mobile').isMobilePhone("en-US").withMessage('Invalid mobile number'),
    body('data.pin').isString().isLength({min:4,max:4}).withMessage('Invalid pin'),
  ],CheckValidation] as IHandler[],
  Login:[[
    body('data.email').isEmail().withMessage('Invalid email'), 
    body('data.pin').isString().isLength({min:4,max:4}).withMessage('Invalid pin'),
  ],CheckValidation] as IHandler[],
  Update:[[
    body('data.username').trim().escape().matches(/^[a-zA-Z0-9]{2,20}$/).withMessage('Invalid display name').optional(),
    body('data.email').isEmail().withMessage('Invalid email').optional(),
    body('data.mobile').isMobilePhone("en-US").withMessage('Invalid mobile').optional(),
    body('data.prefs').isObject().withMessage('Invalid preferences').optional(),
    oneOf([
      body('data.prefs.acceptCookies').if(body('data.prefs').exists()).isISO8601().withMessage('Invalid preferences'),
      body('data.prefs.acceptTerms').if(body('data.prefs').exists()).isISO8601().withMessage('Invalid preferences'),
      body('data.prefs.acceptPrivacy').if(body('data.prefs').exists()).isISO8601().withMessage('Invalid preferences'),
    ]),
  ],CheckValidation] as IHandler[],
  
  UpdateCourier:[[
    body('data.approval').trim().escape().isIn(Object.values(Types.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
    body('data.vehicle').isObject().withMessage('Invalid preferences').optional(),
    oneOf([
      body('data.vehicle.VIN').if(body('data.vehicle').exists()).notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.make').if(body('data.vehicle').exists()).isISO8601().withMessage('Invalid vehicle info'),
      body('data.vehicle.model').if(body('data.vehicle').exists()).notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.trim').if(body('data.vehicle').exists()).optional().notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.year').if(body('data.vehicle').exists()).notEmpty().isInt().withMessage('Invalid vehicle info'),
      body('data.vehicle.mileage').if(body('data.vehicle').exists()).notEmpty().isInt().withMessage('Invalid vehicle info'),
      body('data.vehicle.color').if(body('data.vehicle').exists()).notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.plateNo').if(body('data.vehicle').exists()).notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.plateSt').if(body('data.vehicle').exists()).notEmpty().withMessage('Invalid vehicle info'),
    ]),
    body('data.license').isObject().withMessage('Invalid preferences').optional(),
    oneOf([
      body('data.license.num').if(body('data.license').exists()).notEmpty().isInt().withMessage('Invalid license data'),
      body('data.license.state').if(body('data.license').exists()).notEmpty().isIn(Utils.stateAbbreviations).withMessage('Invalid license data'),
      body('data.license.expires').if(body('data.license').exists()).notEmpty().isISO8601().withMessage('Invalid license data'),
    ]),
    body('data.insurance').isObject().withMessage('Invalid preferences').optional(),
    oneOf([
      body('data.insurance.num').if(body('data.insurance').exists()).notEmpty().isInt().withMessage('Invalid insurance data'),
      body('data.insurance.state').if(body('data.insurance').exists()).notEmpty().isIn(Utils.stateAbbreviations).withMessage('Invalid insurance data'),
      body('data.insurance.expires').if(body('data.insurance').exists()).notEmpty().isISO8601().withMessage('Invalid insurance data'),
    ]),
  ],CheckValidation] as IHandler[],
  UpdateCustomer:[[
    body('data.img').isString().withMessage('Invalid image').optional(),
    body('data.address').isObject().withMessage('Invalid address').optional(),
    oneOf([
      body('data.address.streetAddr').if(body('data.address').exists()).notEmpty().withMessage('Invalid address'),
      body('data.address.city').if(body('data.address').exists()).notEmpty().withMessage('Invalid address'),
      body('data.address.state').if(body('data.address').exists()).notEmpty().isIn(Utils.stateAbbreviations).withMessage('Invalid preferences'),
      body('data.address.postal').if(body('data.address').exists()).notEmpty().withMessage('Invalid preferences'),
      body('data.address.country').if(body('data.address').exists()).notEmpty().withMessage('Invalid preferences'),
    ]),
  ],CheckValidation] as IHandler[],
  UpdateVendor:[[
    body('data.img').isString().withMessage('Invalid image').optional(),
    body('data.address').isObject().withMessage('Invalid address').optional(),
    body('data.approval').trim().escape().isIn(Object.values(Types.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
    body('data.address').isObject().withMessage('Invalid address').optional(),
    oneOf([
      body('data.address.streetAddr').if(body('data.address').exists()).notEmpty().withMessage('Invalid address'),
      body('data.address.city').if(body('data.address').exists()).notEmpty().withMessage('Invalid address'),
      body('data.address.state').if(body('data.address').exists()).notEmpty().isIn(Utils.stateAbbreviations).withMessage('Invalid preferences'),
      body('data.address.postal').if(body('data.address').exists()).notEmpty().withMessage('Invalid preferences'),
      body('data.address.country').if(body('data.address').exists()).notEmpty().withMessage('Invalid preferences'),
    ]),
    body('data.license').isObject().withMessage('Invalid preferences').optional(),
    oneOf([
      body('data.license.num').if(body('data.license').exists()).notEmpty().isInt().withMessage('Invalid license data'),
      body('data.license.state').if(body('data.license').exists()).notEmpty().isIn(Utils.stateAbbreviations).withMessage('Invalid license data'),
      body('data.license.expires').if(body('data.license').exists()).notEmpty().isISO8601().withMessage('Invalid license data'),
    ]),
  ],CheckValidation] as IHandler[],
  UpdateAdmin:[[
    body('data.img').isString().withMessage('Invalid image').optional(),
    body('data.scopes').isArray().withMessage('Invalid scopes').optional(),
    body("data.scopes.*").isString().withMessage('Invalid scopes'),
    body('data.approval').trim().escape().isIn(Object.values(Types.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
  ],CheckValidation] as IHandler[],
};
export default AuthValidators;