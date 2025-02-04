import { User } from '../models';
import { CommonUtils } from '../utils';
import { transStrings } from '../utils/locales';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import * as AllTypes from "../types";

const jwtSecret = process.env.JWT_KEY || "";
const saltRounds = Number(process.env.SALT_ROUNDS || 10);
const setAuthToken = (user:AllTypes.IUser,role:AllTypes.IProfileTypes,expiresIn = "1h") => {
  const payload:any = {id: user._id,role};
  const token = jwt.sign(payload,jwtSecret,{expiresIn});
  return token;
};

const Register:IHandler = async (req,res,next) => {
  try {
    const data = req.body.data;
    const email = await User.findOne({email:data.email});
    if(email) res.status(400).send({
      success: false,
      message: req.t(transStrings.useralreadyexists),
    });
    else {
      const verification = CommonUtils.shortId();
      const user = new User({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        dob:new Date(data.dob),
        username:data.username,
        profiles:{},
        pin:bcrypt.hashSync(data.pin,saltRounds),
        verification:bcrypt.hashSync(verification,saltRounds),
        verificationSent:new Date(),
      });
      await user.save();
      res.locals = {
        status:201,
        success:true,
        message: req.t(transStrings.registeredsuccessfully, {name: user.name.first}),
        data:user.json(AllTypes.IProfileTypes.CUSTOMER),
        token:{id:setAuthToken(user,AllTypes.IProfileTypes.CUSTOMER,"2d"),type:"req"}
      };
      next();
    }
  }
  catch(e){
    res.status(500).send({
      success: false,
      message: "Oops, something went wrong!",
      error: e,
    });
  }
};
const VerifyEmail:IHandler = async (req,res,next) => {
  try {
    const {email,verification,role:role_} = req.body.data;
    const role = role_ || AllTypes.IProfileTypes.CUSTOMER;
    if(!(verification && email)) res.status(400).json({
      success: false,
      message:"Email verification failed!",
    });
    else {
      const user = await User.findOne({email});
      if(!user) res.status(404).json({
        success: false,
        message:req.t(transStrings.userdoesnotexist),
      }); 
      else {
        const compare = await bcrypt.compare(verification,user.verification);
        if(!compare) res.status(401).json({
          success: false,
          message: "Email verification failed!",
        });
        else {
          user.verification = null;
          user.verificationSent = null;
          await user.setStatus(AllTypes.IUserStatuses.ENABLED,null,true);
          await user.populate(`profiles.${role}`);
          res.locals = {
            success:true,
            data: user.json(role,true),
            token:{id:setAuthToken(user,role,"2d"),type:"req"}
          };
          next();
        }
      }
    }
  }
  catch(e){
    res.status(500).send({
      success: false,
      message: "Oops, something went wrong!",
      error: e,
    });
  }
};
const Login:IHandler = async (req,res,next) => {
  try {
    const {email,pin,role:role_} = req.body.data;
    const role = role_ || AllTypes.IProfileTypes.CUSTOMER;
    if(!(email && pin))  res.status(400).json({success: false,message:"Login failed!"});
    else {
      const user = await User.findOne({email});
      if(!user) res.status(404).json({success: false,message:req.t(transStrings.userdoesnotexist)});
      else {
        const compare = await bcrypt.compare(pin,user.pin);
        if(!compare) res.status(401).json({
          success: false,
          message: 'Ops! wrong Password!',
        });
        else {
          await user.setStatus(AllTypes.IUserStatuses.ACTIVE,null,true);
          await user.populate(`profiles.${role}`);
          res.locals = {
            success:true,
            token:{id:setAuthToken(user,role,"2d"),type:"api"},
            data:user.json(role,true),
          };
          next();
        }
      }
    }
  }
  catch(e){
    res.status(500).send({
      success: false,
      message: "Oops, something went wrong!",
      error: e,
    });
  }
};
const Autologin:IHandler = async (req,res,next) => {
  const user = req.user as AllTypes.IUser;
  if (!user) res.status(404).json({
    success: false,
    message: req.t(transStrings.userdoesnotexist)
  });
  else {
    res.locals = {
      success: true,
      data:user.json(user.role,true),
    };
    next();
  }
};
const UpdateUser:IHandler = async (req,res,next) => {
  try {
    const user = req.user as AllTypes.IUser;
    const { pin,profiles,name,...$set } = req.body.data;
    const options = {new:true,runValidators:true};
    if(pin){
      const newPin = bcrypt.hashSync(pin, saltRounds);
      $set.pin = newPin;
    }
    user.set($set,options);
    await user.save();
    res.locals = {
      success:true,
      message: req.t(transStrings.profileupdatedsuccessfuly),
      data:user.json(user.role,true)
    };
    next();
  }
  catch(e){
    res.status(500).send({
      success: false,
      message: "Oops, something went wrong!",
      error: e,
    });
  }
};

export { Register,Login,VerifyEmail,Autologin,UpdateUser };