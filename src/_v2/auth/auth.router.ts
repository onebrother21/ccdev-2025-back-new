import { Router } from 'express';
import { AuthController as ctrl } from './auth.controller';
import { AuthValidators as validators } from './auth.validators';
import { AuthJWT,PostMiddleware } from '../../middlewares';
import { V2Routes } from '../v2-routerstrings';
import Utils from '../../utils';

const AuthRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.Auth
  const router = Router();
  
  router.post(routes.Signup,[...validators.Signup,ctrl.SignUp,...PostMiddleware]);
  router.post(routes.Verify,[...validators.VerifyEmail,ctrl.VerifyEmail,...PostMiddleware]);
  router.post(routes.Register,[...validators.Register,ctrl.Register,...PostMiddleware]);
  router.post(routes.Login,[...validators.Login,ctrl.Login,...PostMiddleware]);
  router.put(routes.Update,[AuthJWT,...validators.Update,ctrl.Update,...PostMiddleware]);
  router.get(routes.Auto,[AuthJWT,ctrl.Auto,...PostMiddleware]);
  
  router.post(routes.SwitchProfile,[AuthJWT,ctrl.SwitchProfile,...PostMiddleware]);
  
  router.post(routes.AddAdminProfile,[AuthJWT,ctrl.AddProfile,...PostMiddleware]);
  router.post(routes.AddCourierProfile,[AuthJWT,ctrl.AddProfile,...PostMiddleware]);
  router.post(routes.AddVendorProfile,[AuthJWT,ctrl.AddProfile,...PostMiddleware]);
  
  router.put(routes.UpdateCustomerProfile,[AuthJWT,...validators.UpdateCustomer,ctrl.UpdateProfile,...PostMiddleware]);
  router.put(routes.UpdateCourierProfile,[AuthJWT,...validators.UpdateCourier,ctrl.UpdateProfile,...PostMiddleware]);
  router.put(routes.UpdateVendorProfile,[AuthJWT,...validators.UpdateVendor,ctrl.UpdateProfile,...PostMiddleware]);
  router.put(routes.UpdateAdminProfile,[AuthJWT,...validators.UpdateAdmin,ctrl.UpdateProfile,...PostMiddleware]);

  return router;
};
export { AuthRouter };
export default AuthRouter;