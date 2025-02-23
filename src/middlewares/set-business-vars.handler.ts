import Models from "../models";
import Utils from "../utils";

export const SetBusinessVars:(cache:Utils.RedisCache) => IHandler = cache => async (req, res, next) => {
  try{
    let bvars:any;
    const bvars_ = await cache.getAppData();
    if(bvars_) bvars = bvars_;
    else {
      const bvarsM = await Models.BusinessVars.findOne({status:"active"});
      if(!bvarsM) throw "Service not configured!";
      bvars = bvarsM.json();
    }
    req.bvars = bvars;
    next();
  }
  catch(e){next(e);}
};
export default SetBusinessVars;