import { CommonUtils } from '../utils';
import { BusinessVars } from '../models';

const bvarsCookie = process.env.BVARS_COOKIE || 'myCookie';

export const SetBusinessVars:IHandler = async (req, res, next) => {
  //const cookie = req.signedCookies[bvarsCookie];
  const results = await BusinessVars.find({},null,{sort:{createdOn:-1},limit:1});
  const bvars = results[0];
  const {service,delivery,admin} = bvars.rates;
  bvars.courierPercRevenue = delivery - bvars.deliveryAdminRate;
  bvars.vendorPercRevenue = 1 - (service + delivery + admin);
  req.bvars = bvars;
  res.cookie(bvarsCookie,CommonUtils.encrypt({bvarsId:bvars._id}),{ 
    httpOnly: false, // Set to true for security in production
    secure: false,   // Set to true if using HTTPS
    maxAge: 3600000, // Cookie expires in 1 hour
    signed:true
  });
  next();
};
export default SetBusinessVars;