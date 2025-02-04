import { body,oneOf } from "express-validator";
import { stateAbbreviations } from "../utils";
import { CheckValidation } from "../middlewares";
import * as AllTypes from "../types";

const UserValidators = {
  UpdateCourier:[[
    body('data.approval').trim().escape().isIn(Object.values(AllTypes.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
    body('data.vehicle').isObject().withMessage('Invalid preferences').optional(),
    oneOf([
      body('data.vehicle.VIN')
      .if(body('data.vehicle').exists())
      .notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.make')
      .if(body('data.vehicle').exists())
      .notEmpty().isISO8601().withMessage('Invalid vehicle info'),
      body('data.vehicle.model')
      .if(body('data.vehicle').exists())
      .notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.trim')
      .if(body('data.vehicle').exists())
      .optional().notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.year')
      .if(body('data.vehicle').exists())
      .notEmpty().isInt().withMessage('Invalid vehicle info'),
      body('data.vehicle.mileage')
      .if(body('data.vehicle').exists())
      .notEmpty().isInt().withMessage('Invalid vehicle info'),
      body('data.vehicle.color')
      .if(body('data.vehicle').exists())
      .notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.plateNo')
      .if(body('data.vehicle').exists())
      .notEmpty().withMessage('Invalid vehicle info'),
      body('data.vehicle.plateSt')
      .if(body('data.vehicle').exists())
      .notEmpty().withMessage('Invalid vehicle info'),
    ]),
    body('data.license').isObject().withMessage('Invalid preferences').optional(),
    oneOf([
      body('data.license.num')
      .if(body('data.license').exists())
      .notEmpty().isInt().withMessage('Invalid license data'),
      body('data.license.state')
      .if(body('data.license').exists())
      .notEmpty().isIn(stateAbbreviations).withMessage('Invalid license data'),
      body('data.license.expires')
      .if(body('data.license').exists())
      .notEmpty().isISO8601().withMessage('Invalid license data'),
    ]),
    body('data.insurance').isObject().withMessage('Invalid preferences').optional(),
    oneOf([
      body('data.insurance.num')
      .if(body('data.insurance').exists())
      .notEmpty().isInt().withMessage('Invalid insurance data'),
      body('data.insurance.state')
      .if(body('data.insurance').exists())
      .notEmpty().isIn(stateAbbreviations).withMessage('Invalid insurance data'),
      body('data.insurance.expires')
      .if(body('data.insurance').exists())
      .notEmpty().isISO8601().withMessage('Invalid insurance data'),
    ]),
  ],CheckValidation] as IHandler[],
  UpdateCustomer:[[
    body('data.img').isString().withMessage('Invalid image').optional(),
    body('data.address').isObject().withMessage('Invalid address').optional(),
    oneOf([
      body('data.address.streetAddr')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().withMessage('Invalid address'),
      body('data.address.city')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().withMessage('Invalid address'),
      body('data.address.state')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().isIn(stateAbbreviations).withMessage('Invalid preferences'),
      body('data.address.postal')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().withMessage('Invalid preferences'),
      body('data.address.country')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().withMessage('Invalid preferences'),
    ]),
  ],CheckValidation] as IHandler[],
  UpdateVendor:[[
    body('data.img').isString().withMessage('Invalid image').optional(),
    body('data.address').isObject().withMessage('Invalid address').optional(),
    body('data.approval').trim().escape().isIn(Object.values(AllTypes.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
    oneOf([
      body('data.address.streetAddr')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().withMessage('Invalid address'),
      body('data.address.city')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().withMessage('Invalid address'),
      body('data.address.state')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().isIn(stateAbbreviations).withMessage('Invalid preferences'),
      body('data.address.postal')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().withMessage('Invalid preferences'),
      body('data.address.country')
      .if(body('data.address').exists()) // if bank code provided
      .notEmpty().withMessage('Invalid preferences'),
    ]),
  ],CheckValidation] as IHandler[],
  UpdateAdmin:[[
    body('data.img').isString().withMessage('Invalid image').optional(),
    body('data.scopes').isArray().withMessage('Invalid scopes').optional(),
    body("data.scopes.*").isString().withMessage('Invalid scopes'),
    body('data.approval').trim().escape().isIn(Object.values(AllTypes.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
  ],CheckValidation] as IHandler[],
};
export default UserValidators;