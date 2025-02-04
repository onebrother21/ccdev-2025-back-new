import { Admin,Courier,Customer,Vendor,User } from '../models';
import { transStrings } from '../utils/locales';
import * as AllTypes from "../types";
import { profile } from 'console';

const profileModels:any = {
  customer:Customer,
  courier:Courier,
  vendor:Vendor,
  admin:Admin
};
const AddProfile:IHandler = async (req,res,next) => {
  const data = req.body.data;
  const user = req.user as AllTypes.IUser;
  const model = profileModels[user.role];
  const profile = new model(data);
  profile.user = req.user._id;
  profile
  user.profiles[user.role] = profile._id;
  try {
    await profile.save();
    await user.save();
    await user.populate(`profiles.${user.role}`);
    res.locals = {
      status:201,
      success:true,
      message: req.t(transStrings.profileupdatedsuccessfuly),
      data:user.json(user.role,true)
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
const UpdateProfile:IHandler = async (req,res,next) => {
  const user = req.user as AllTypes.IUser;
  const profileId = user.getProfile(user.role)?.id;
  const model = profileModels[user.role];
  const $set = req.body.data;
  const options = {new:true,runValidators:true};
  try {
    const profile = await model.findByIdAndUpdate(profileId,{$set},options);
    user.profiles[user.role] = profile;
    await user.save();
    await user.populate(`profiles.${user.role}`);
    res.locals = {
      success:true,
      message: req.t(transStrings.profileupdatedsuccessfuly),
      data:user.json(user.role,true)
    };
    next();
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
export { AddProfile,UpdateProfile };