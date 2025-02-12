import express from 'express';
import { orderController } from '../controllers';
import { orderValidators } from '../../validators';
import { AuthJWT } from '../../middlewares';

const router = express.Router();
router.post("/",[AuthJWT,...orderValidators.CreateOrder as any,orderController.CreateOrder]);
router.get("/",[AuthJWT,orderController.QueryOrders]);
router.get("/customers",[AuthJWT,orderController.QueryOrdersByCustomerDetails]);
router.get("/couriers",[AuthJWT,orderController.QueryOrdersByCourierDetails]);
router.get("/vendors",[AuthJWT,orderController.QueryOrdersByVendorDetails]);
router.get("/:orderId",[AuthJWT,orderController.GetOrder]);
router.put("/:orderId",[AuthJWT,...orderValidators.UpdateOrder as any,orderController.UpdateOrder]);
router.delete("/:orderId",[AuthJWT,orderController.UpdateOrder]);
router.delete("/:orderId/x",[AuthJWT,orderController.UpdateOrder]);

export default router;