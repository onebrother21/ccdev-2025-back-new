import * as AllTypes from '../types';
import { Admin, BusinessVars, Courier, Vendor } from '../models';
import { CommonUtils } from '../utils';
import { transStrings } from '../utils/locales';

const UpdateVars:IHandler = async (req,res,next) => {
  const {_id:bvarsId,...$set} = req.body.data;
  const options = {new:true,runValidators:true};
  if (!bvarsId) res.status(400).json({success: false,message: "No bvars identifier provided!"});
  try {
    const bvars = await BusinessVars.findByIdAndUpdate(bvarsId,{$set},options);
    if (!bvars) res.status(404).json({
      success: false,
      message:"No vaars found"
    });
    else {
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:{ok:true}
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
const GenerateKeys:IHandler = async (req,res,next) => {
  const keys:any = [];
  keys.push(CommonUtils.longId())
  keys.push(CommonUtils.longId())
  keys.push(CommonUtils.shortId())
  keys.push(CommonUtils.shortId())
  res.locals = {
    success:true,
    message: req.t(transStrings.profileupdatedsuccessfuly),
    data:{keys}
  };
  next();
};
const UpdateAdmin:IHandler = async (req,res,next) => {
  const {_id:adminId,...$set} = req.body.data;
  const options = {new:true,runValidators:true};
  if (!adminId) res.status(400).json({success: false,message: "No admin identifier provided!"});
  try {
    const admin = await Admin.findByIdAndUpdate(adminId,{$set},options);
    if (!admin) res.status(404).json({success: false,message:"No vaars found"});
    else {
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:{ok:true}
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
const UpdateAdminApproval:IHandler = async (req,res,next) => {
  const user = req.user as AllTypes.IUser;
  const profile = user.getProfile(user.role);
  const {adminId,approval,scopes} = req.body.data;
  const options = {new:true,runValidators:true};
  if (!adminId) res.status(400).json({success: false,message: "No admin identifier provided!"});
  try {
    const admin = await Admin.findById(adminId);
    admin.scopes.push(...scopes);
    await admin.setApproval(approval,{admin:profile.name,hash:"#"+CommonUtils.shortId().toLocaleLowerCase()},true);
    if (!admin) res.status(404).json({success: false,message:"No admin found"});
    else {
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:{ok:true}
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
const UpdateCourierApproval:IHandler = async (req,res,next) => {
  const user = req.user as AllTypes.IUser;
  const profile = user.getProfile(user.role);
  const {courierId,approval} = req.body.data;
  const options = {new:true,runValidators:true};
  if (!courierId) res.status(400).json({success: false,message: "No courier identifier provided!"});
  try {
    const courier = await Courier.findById(courierId);
    await courier.setApproval(approval,{courier:profile.name,hash:"#"+CommonUtils.shortId().toLocaleLowerCase()});
    if (!courier) res.status(404).json({success: false,message:"No courier found"});
    else {
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:{ok:true}
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
const UpdateVendorApproval:IHandler = async (req,res,next) => {
  const user = req.user as AllTypes.IUser;
  const profile = user.getProfile(user.role);
  const {vendorId,approval} = req.body.data;
  const options = {new:true,runValidators:true};
  if (!vendorId) res.status(400).json({success: false,message: "No vendor identifier provided!"});
  try {
    const vendor = await Vendor.findById(vendorId);
    await vendor.setApproval(approval,{vendor:profile.name,hash:"#"+CommonUtils.shortId().toLocaleLowerCase()});
    if (!vendor) res.status(404).json({success: false,message:"No vendor found"});
    else {
      res.locals = {
        success:true,
        message: req.t(transStrings.profileupdatedsuccessfuly),
        data:{ok:true}
      };
      next();
    }
  }
  catch(e){
    res.status(422).send({
      success:false,
      message:"Operation failed",
      error:e,
    });
  }
};
export {
  UpdateVars,
  UpdateAdmin,
  UpdateAdminApproval,
  UpdateCourierApproval,
  UpdateVendorApproval,
  GenerateKeys};