import { body,oneOf } from "express-validator";
import { CheckValidation } from "../middlewares";
import Types from "../types";
import Utils from "utils";

const CourierValidators = {
  CreateCourier:[[
    body('data.name').trim().escape().matches(/^[a-zA-Z0-9]{2,20}$/).withMessage('Invalid display name'),
    body('data.img').trim().escape().notEmpty().withMessage('Invalid image').optional(),
    body('data.vehicle').isObject().custom(Utils.notEmpty).withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.VIN').if(body('data.vehicle').exists()).trim().escape().matches(/^[A-Z0-9]{17}$/).withMessage('Invalid vehicle info'),
    body('data.vehicle.make').if(body('data.vehicle').exists()).trim().escape().notEmpty().withMessage('Invalid vehicle info'),
    body('data.vehicle.model').if(body('data.vehicle').exists()).trim().escape().notEmpty().withMessage('Invalid vehicle info'),
    body('data.vehicle.trim').if(body('data.vehicle').exists()).trim().escape().notEmpty().withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.year').if(body('data.vehicle').exists()).isInt({min:1900,max:2100}).withMessage('Invalid vehicle info'),
    body('data.vehicle.mileage').if(body('data.vehicle').exists()).isInt({min:1,max:250000}).withMessage('Invalid vehicle info'),
    body('data.vehicle.color').if(body('data.vehicle').exists()).trim().escape().isIn([
      ...Utils.popularColors.map(o => o.name),
      ...Utils.popularColors.map(o => o.hex)
    ]).withMessage('Invalid vehicle info'),
    body('data.vehicle.plateNo').if(body('data.vehicle').exists()).trim().escape().matches(/^[A-Z0-9]{6,8}$/).withMessage('Invalid vehicle info'),
    body('data.vehicle.plateSt').if(body('data.vehicle').exists()).trim().escape().isIn(Utils.stateAbbreviations).withMessage('Invalid vehicle info'),
    body('data.license').isObject().custom(Utils.notEmpty).withMessage('Invalid license data').optional(),
    body('data.license.num').if(body('data.license').exists()).trim().escape().matches(/^[0-9]{8,10}$/).withMessage('Invalid license data'),
    body('data.license.state').if(body('data.license').exists()).trim().escape().isIn(Utils.stateAbbreviations).withMessage('Invalid license data'),
    body('data.license.expires').if(body('data.license').exists()).isISO8601().withMessage('Invalid license data'),
    body('data.insurance').isObject().custom(Utils.notEmpty).withMessage('Invalid insurace data').optional(),
    body('data.insurance.num').if(body('data.insurance').exists()).trim().escape().matches(/^[0-9]{8,10}$/).withMessage('Invalid insurance data'),
    body('data.insurance.state').if(body('data.insurance').exists()).trim().escape().isIn(Utils.stateAbbreviations).withMessage('Invalid insurance data'),
    body('data.insurance.expires').if(body('data.insurance').exists()).isISO8601().withMessage('Invalid insurance data'),
    body('data.insurance.agent').if(body('data.insurance').exists()).trim().escape().notEmpty().withMessage('Invalid insurance data'),
    body('data.insurance.insurer').if(body('data.insurance').exists()).trim().escape().notEmpty().withMessage('Invalid insurance data'),
  ],CheckValidation] as IHandler[],
  UpdateCourier:[[
    body('data.name').trim().escape().matches(/^[a-zA-Z0-9]{2,20}$/).withMessage('Invalid display name').optional(),
    body('data.img').trim().escape().notEmpty().withMessage('Invalid image').optional(),
    body('data.vehicle').isObject().custom(Utils.notEmpty).withMessage('Invalid preferences').optional(),
    body('data.vehicle.VIN').if(body('data.vehicle').exists()).trim().escape().matches(/^[A-Z0-9]{17}$/).withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.make').if(body('data.vehicle').exists()).trim().escape().notEmpty().withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.model').if(body('data.vehicle').exists()).trim().escape().notEmpty().withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.trim').if(body('data.vehicle').exists()).trim().escape().notEmpty().withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.year').if(body('data.vehicle').exists()).isInt({min:1900,max:2100}).withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.mileage').if(body('data.vehicle').exists()).isInt({min:1,max:250000}).withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.color').if(body('data.vehicle').exists()).trim().escape().isIn([
      ...Utils.popularColors.map(o => o.name),
      ...Utils.popularColors.map(o => o.hex)
    ]).withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.plateNo').if(body('data.vehicle').exists()).trim().escape().matches(/^[A-Z0-9]{6,8}$/).withMessage('Invalid vehicle info').optional(),
    body('data.vehicle.plateSt').if(body('data.vehicle').exists()).trim().escape().isIn(Utils.stateAbbreviations).withMessage('Invalid vehicle info').optional(),
    body('data.license').isObject().custom(Utils.notEmpty).withMessage('Invalid preferences').optional(),
    body('data.license.num').if(body('data.license').exists()).trim().escape().matches(/^[0-9]{8,10}$/).withMessage('Invalid license data').optional(),
    body('data.license.state').if(body('data.license').exists()).trim().escape().isIn(Utils.stateAbbreviations).withMessage('Invalid license data').optional(),
    body('data.license.expires').if(body('data.license').exists()).isISO8601().withMessage('Invalid license data').optional(),
    body('data.insurance').isObject().custom(Utils.notEmpty).withMessage('Invalid preferences').optional(),
    body('data.insurance.num').if(body('data.insurance').exists()).trim().escape().matches(/^[0-9]{8,10}$/).withMessage('Invalid insurance data').optional(),
    body('data.insurance.state').if(body('data.insurance').exists()).trim().escape().isIn(Utils.stateAbbreviations).withMessage('Invalid insurance data').optional(),
    body('data.insurance.expires').if(body('data.insurance').exists()).isISO8601().withMessage('Invalid insurance data').optional(),
    body('data.insurance.agent').if(body('data.insurance').exists()).trim().escape().notEmpty().withMessage('Invalid insurance data').optional(),
    body('data.insurance.insurer').if(body('data.insurance').exists()).trim().escape().notEmpty().withMessage('Invalid insurance data').optional(),
    body('data.approval').trim().escape().isIn(Object.values(Types.IApprovalStatuses)).withMessage('Invalid approval data').optional(),
  ],CheckValidation] as IHandler[],
};
export default CourierValidators;