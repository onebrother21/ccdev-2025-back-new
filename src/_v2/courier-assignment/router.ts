import { Router } from 'express';
import { CourierAssignmentController } from './controller';
import { courierAssignmentValidators } from './validators';
import { AuthJWT } from '../../middlewares';
import { V2Routes } from '../v2-routerstrings';
import Utils from '../../utils';

const CourierAssignmentRouter = (cache:Utils.RedisCache) => {
  const router = Router();
  
  router.get(
    V2Routes.CourierAssignment.FindAvailable,
    AuthJWT,
    ...courierAssignmentValidators.FindAvailableCouriers,
    CourierAssignmentController.FindAvailableCouriers
  );
  
  router.post(
    V2Routes.CourierAssignment.AssignCourier,
    AuthJWT,
    ...courierAssignmentValidators.AssignCourier,
    CourierAssignmentController.AssignCourier
  );
  
  router.post(
    V2Routes.CourierAssignment.AcceptOrder,
    AuthJWT,
    ...courierAssignmentValidators.AcceptOrder,
    CourierAssignmentController.AcceptOrder
  );
  
  router.post(
    V2Routes.CourierAssignment.RejectOrder,
    AuthJWT,
    ...courierAssignmentValidators.RejectOrder,
    CourierAssignmentController.RejectOrder
  );
  
  router.post(
    V2Routes.CourierAssignment.FulfillOrder,
    AuthJWT,
    ...courierAssignmentValidators.FulfillOrder,
    CourierAssignmentController.FulfillOrder
  );

  return router;
};
export { CourierAssignmentRouter };
export default CourierAssignmentRouter;