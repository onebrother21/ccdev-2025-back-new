import { Router } from 'express';
import { AuthJWT } from '../../middlewares';
import productMgmtValidators from './product-mgmt.validators';
import ProductMgmtController from './product-mgmt.controller';
import { Routes } from '../v2-routerstrings';

const router = Router();

router.post(Routes.Products.CreateProduct,[
  AuthJWT,...productMgmtValidators.CreateProduct,
  ProductMgmtController.CreateProduct
]);
router.get(Routes.Products.QueryProducts,[AuthJWT,ProductMgmtController.QueryProductsByVendor]);
router.get(Routes.Products.QueryProductsByDetails,[AuthJWT,ProductMgmtController.QueryProductsByDetails]);
router.get(Routes.Products.QueryProductsByVendor,[
  AuthJWT,...productMgmtValidators.QueryProductsByVendor,
  ProductMgmtController.QueryProductsByVendor
]);
router.get(Routes.Products.GetProduct,[AuthJWT,ProductMgmtController.GetProduct]);
router.put(Routes.Products.UpdateProduct,[
  AuthJWT,...productMgmtValidators.UpdateProduct,
  ProductMgmtController.UpdateProduct
]);
router.delete(Routes.Products.DeleteProduct,[
  AuthJWT,...productMgmtValidators.DeleteProduct,
  ProductMgmtController.DeleteProduct
]);

export default router;
