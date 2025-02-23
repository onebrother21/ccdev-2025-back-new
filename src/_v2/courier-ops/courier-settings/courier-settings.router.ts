import { Router } from 'express';
import { CourierSettingsController as ctrl } from './courier-settings.controller';
import { CourierSettingsValidators as validators } from './courier-settings.validators';
import { PostMiddleware } from '../../../middlewares';
import { V2Routes } from '../../v2-routerstrings';
import Utils from '../../../utils';

const CourierSettingsRouter = (cache:Utils.RedisCache) => {
  const routes = V2Routes.CourierOps.settings;
  const router = Router();
  
  // 📌 Settings & Preferences
  router.put(routes.businessHours,[ctrl.updateBusinessHours,...PostMiddleware]);
  router.put(routes.autoAccept,[ctrl.setAutoAcceptOrders,...PostMiddleware]);
  router.put(routes.courierPrefs,[ctrl.setCourierPreferences,...PostMiddleware]);

  return router;
};
export { CourierSettingsRouter };
export default CourierSettingsRouter;