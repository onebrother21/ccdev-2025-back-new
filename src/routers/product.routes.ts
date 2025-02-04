import express from 'express';
import { productController } from '../controllers';
import { AuthJWT } from '../middlewares';
import { Routes } from './routeStrings';
import { productValidators } from '../validators';

const router = express.Router();
router.post(Routes.products,[AuthJWT,...productValidators.CreateProduct,productController.CreateProduct]);
router.get(Routes.productId,[AuthJWT,productController.GetProduct]);
router.put(Routes.productId,[AuthJWT,...productValidators.UpdateProduct,productController.UpdateProduct]);
router.delete(Routes.productId,[AuthJWT,productController.UpdateProduct]);
router.delete(Routes.productId+"/x",[AuthJWT,productController.UpdateProduct]);

export default router;