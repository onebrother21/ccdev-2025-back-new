import { Router } from 'express';
import { AuthJWT } from '../../middlewares';
import productMgmtValidators from './product-mgmt.validators';
import ProductMgmtController from './product-mgmt.controller';
import { V2Routes } from '../v2-routerstrings';

const routes = V2Routes.ProductMgmt;
const router = Router();

router.post(routes.CreateProduct,[
  AuthJWT,...productMgmtValidators.CreateProduct,
  ProductMgmtController.CreateProduct
]);
router.get(routes.QueryProducts,[AuthJWT,ProductMgmtController.QueryProductsByVendor]);
router.get(routes.QueryProductsByDetails,[AuthJWT,ProductMgmtController.QueryProductsByDetails]);
router.get(routes.QueryProductsByVendor,[
  AuthJWT,...productMgmtValidators.QueryProductsByVendor,
  ProductMgmtController.QueryProductsByVendor
]);
router.get(routes.GetProduct,[AuthJWT,ProductMgmtController.GetProduct]);
router.put(routes.UpdateProduct,[
  AuthJWT,...productMgmtValidators.UpdateProduct,
  ProductMgmtController.UpdateProduct
]);
router.delete(routes.DeleteProduct,[
  AuthJWT,...productMgmtValidators.DeleteProduct,
  ProductMgmtController.DeleteProduct
]);

export default router;
