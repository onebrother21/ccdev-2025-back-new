import { Router } from 'express';
import { ProductMgmtController as ctrl } from './product-mgmt.controller';
import { productMgmtValidators as validators } from './product-mgmt.validators';
import { AuthJWT,PostMiddleware } from '../../middlewares';
import { V2Routes } from '../v2-routerstrings';
import Utils from '../../utils';

const ProductMgmtRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.ProductMgmt;
  const router = Router();
  router.use(AuthJWT());

  router.post(routes.CreateProduct,[...validators.CreateProduct,ctrl.CreateProduct,...PostMiddleware]);
  router.get(routes.QueryProducts,[ctrl.QueryProductsByVendor,...PostMiddleware]);
  router.get(routes.QueryProductsByDetails,[ctrl.QueryProductsByDetails,...PostMiddleware]);
  router.get(routes.QueryProductsByVendor,[...validators.QueryProductsByVendor,ctrl.QueryProductsByVendor,...PostMiddleware]);
  router.get(routes.GetProduct,[ctrl.GetProduct,...PostMiddleware]);
  router.put(routes.UpdateProduct,[...validators.UpdateProduct,ctrl.UpdateProduct,...PostMiddleware]);
  router.delete(routes.DeleteProduct,[...validators.DeleteProduct,ctrl.DeleteProduct,...PostMiddleware]);

  return router;
};
export { ProductMgmtRouter };
export default ProductMgmtRouter;
