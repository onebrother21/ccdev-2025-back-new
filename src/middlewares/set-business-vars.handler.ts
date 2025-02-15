import Utils from "../utils";


export const SetBusinessVars:(cache:Utils.RedisCache) => IHandler = cache => async (req, res, next) => {
  const bvars = await cache.getAppData();
  const {service,delivery,admin} = bvars.rates;
  bvars.courierPercRevenue = delivery - bvars.deliveryAdminRate;
  bvars.vendorPercRevenue = 1 - (service + delivery + admin);
  req.bvars = bvars;
  next();
};
export default SetBusinessVars;