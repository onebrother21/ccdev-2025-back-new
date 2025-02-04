import express from 'express';
import { orderController } from '../controllers';
import { AuthJWT } from '../middlewares';
import { Routes } from './routeStrings';
import { orderValidators } from '../validators';

const router = express.Router();
router.get(Routes.orders,[AuthJWT,orderController.QueryOrders]);
router.get(Routes.orders+"/customers",[AuthJWT,orderController.QueryOrdersByCustomerDetails]);
router.get(Routes.orders+"/couriers",[AuthJWT,orderController.QueryOrdersByCourierDetails]);
router.get(Routes.orders+"/vendors",[AuthJWT,orderController.QueryOrdersByVendorDetails]);
router.post(Routes.orders,[AuthJWT,...orderValidators.CreateOrder as any,orderController.CreateOrder]);
router.get(Routes.orderId,[AuthJWT,orderController.GetOrder]);
router.put(Routes.orderId,[AuthJWT,...orderValidators.UpdateOrder as any,orderController.UpdateOrder]);
router.delete(Routes.orderId,[AuthJWT,orderController.UpdateOrder]);
router.delete(Routes.orderId+"/x",[AuthJWT,orderController.UpdateOrder]);

export default router;