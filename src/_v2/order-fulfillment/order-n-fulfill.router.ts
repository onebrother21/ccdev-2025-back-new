import { Router } from 'express';
import AuthController from './order-n-fulfill.controller';
import orderAndFulfillValidators from './order-n-fulfill.validators';
import { AuthJWT } from '../../middlewares';

const router = Router();

router.post("/",[AuthJWT,...orderAndFulfillValidators.CreateOrder,AuthController.CreateOrder]);
router.post("/:orderId/complete",[AuthJWT,...orderAndFulfillValidators.CancelOrder,AuthController.CompleteOrder]);
router.post("/:orderId/assign",[AuthJWT,...orderAndFulfillValidators.AssignCourier,AuthController.AssignFulfillment]);
router.post("/:orderId/deliver",[AuthJWT,...orderAndFulfillValidators.MarkAsDelivered,AuthController.AssignFulfillment]);
router.put("/:orderId/fulfill",[AuthJWT,...orderAndFulfillValidators.MarkAsFulfilled,AuthController.AssignFulfillment]);

export default router;