import { Router } from 'express';
import { CourierAssignmentController } from './controller';
import { courierAssignmentValidators } from './validators';
import { AuthJWT } from '../../middlewares';
import { Routes } from '../v2-routerstrings';

const router = Router();

router.get(
  Routes.CourierAssignment.FindAvailable,
  AuthJWT,
  ...courierAssignmentValidators.FindAvailableCouriers,
  CourierAssignmentController.FindAvailableCouriers
);

router.post(
  Routes.CourierAssignment.AssignCourier,
  AuthJWT,
  ...courierAssignmentValidators.AssignCourier,
  CourierAssignmentController.AssignCourier
);

router.post(
  Routes.CourierAssignment.AcceptOrder,
  AuthJWT,
  ...courierAssignmentValidators.AcceptOrder,
  CourierAssignmentController.AcceptOrder
);

router.post(
  Routes.CourierAssignment.RejectOrder,
  AuthJWT,
  ...courierAssignmentValidators.RejectOrder,
  CourierAssignmentController.RejectOrder
);

router.post(
  Routes.CourierAssignment.FulfillOrder,
  AuthJWT,
  ...courierAssignmentValidators.FulfillOrder,
  CourierAssignmentController.FulfillOrder
);

export default router;
