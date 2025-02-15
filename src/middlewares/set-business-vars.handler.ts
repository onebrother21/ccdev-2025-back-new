import { RedisCache } from '../init/redis-cache';

export const SetBusinessVars:(cache:RedisCache) => IHandler = cache => async (req, res, next) => {
  const bvars = await cache.getAppData();
  const {service,delivery,admin} = bvars.rates;
  bvars.courierPercRevenue = delivery - bvars.deliveryAdminRate;
  bvars.vendorPercRevenue = 1 - (service + delivery + admin);
  req.bvars = bvars;
  next();
};
export default SetBusinessVars;