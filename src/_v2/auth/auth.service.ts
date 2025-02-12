import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { AuthToken,DeadToken,User,Customer,Courier,Vendor,Admin } from '../../models';
import { AppError, CommonUtils, logger } from '../../utils';
import * as AllTypes from "../../types";

import { NotificationService,ProfilesService } from '../../services';

const TOKEN_EXPIRATION = '1h'; // 1 hour
const REFRESH_EXPIRATION = '7d'; // 7 days
const RESET_EXPIRATION = '15m'; // 7 days

const jwtSecret = process.env.JWT_KEY || "supersecretkey";
const refreshSecret = process.env.REFRESH_SECRET || 'refreshsecret';
const resetSecret = process.env.REFRESH_SECRET || 'resetsecret';
const saltRounds = Number(process.env.SALT_ROUNDS || 10);
const devStaticVerify = process.env.DEV_STATIC_VERIFY;

const profileModels:Record<AllTypes.IProfileTypes,Model<any>> = {
  customer:Customer,
  courier:Courier,
  vendor:Vendor,
  admin:Admin
};

export class AuthService {
  /**
   * To check for existing user using front-end typeahead
   */
  static lookupUser = async (email: string) => await User.findOne({ email });
  /**
   * Sign up a new user
   */
  static signupUser = async ({email,dob}:AllTypes.IUserInit) =>  {
    const role = AllTypes.IProfileTypes.CUSTOMER;
    if(await User.findOne({email})) throw new AppError(400,"User already exists");
    const verification = CommonUtils.shortId();
    const user = await User.create({
      email,
      dob:new Date(dob),
      verification:bcrypt.hashSync(verification,saltRounds),
      verificationSent:new Date(),
    });
    // Send welcome notification
    const notificationMethod = AllTypes.INotificationSendMethods.EMAIL;
    const notificationData = {code:verification};
    await NotificationService.createNotification("VERIFY",notificationMethod,[user.id],notificationData);
    return {user,role};
  };
  /**
   * Verify user email
   */
  static verifyUser = async ({id,verification,role:role_}:Partial<AllTypes.IUser>) => {
    const role = role_ || AllTypes.IProfileTypes.CUSTOMER;
    const user = await User.findById(id);
    const isMatch = await bcrypt.compare(verification,user.verification);
    const devVerify = devStaticVerify && devStaticVerify == verification;
    switch(true){
      case !user:
      case !devVerify && !isMatch:throw new AppError(401,"Email verification failed!");
      default:{
        user.verification = null;
        user.verificationSent = null;
        await user.setStatus(AllTypes.IUserStatuses.ENABLED,null,true);
        return {user,role};
      }
    }
  }
  /**
   * Registers a new user
   */
  static registerUser = async ({id,...data}:Partial<AllTypes.IUser>) => {
    const user = await User.findById(id);
    const role = AllTypes.IProfileTypes.CUSTOMER;
    if(!user) throw new AppError(401,"Registration failed!");
    user.set({
      name:data.name,
      mobile: data.mobile,
      username:data.username,
      pin:bcrypt.hashSync(data.pin,saltRounds),
    });
    const { profile } = await ProfilesService.createProfile(role,user);
    user.profiles[role] = profile.id;
    await user.setStatus(AllTypes.IUserStatuses.ACTIVE,null,true);
    await user.populate(`profiles.${role}`);
    //send registration notification
    const notificationMethod = AllTypes.INotificationSendMethods.EMAIL;
    const notificationData = {name:CommonUtils.cap(data.name.first as string)};
    await NotificationService.createNotification("REGISTER",notificationMethod,[user.id],notificationData);
    return {user,role,...await this.generateAuthTokens(user,role)};
  };

  /**
   * Logs in a user and returns an access token
   */
  static loginUser = async ({email,pin,role:role_}:Pick<AllTypes.IUser,"email"|"pin"|"role">) => {
    const role = role_ || AllTypes.IProfileTypes.CUSTOMER;
    const user = await AuthService.lookupUser(email);
    let unrecognized = false;
    if(!user || !await bcrypt.compare(pin,user.pin)) throw new AppError(401,'Ops! wrong Username or Password!');
    await user.setStatus(AllTypes.IUserStatuses.ACTIVE,null,true);
    await user.populate(`profiles.${role}`);
    
    // Send welcome notification
    const notificationMethod = AllTypes.INotificationSendMethods.SMS;
    const notificationData = {name:CommonUtils.cap(user.name.first as string)};
    if(unrecognized) await NotificationService.createNotification("UNRECOGNIZED_LOGIN",notificationMethod,[user.id],notificationData);
    return {user,role,...await this.generateAuthTokens(user,role)};
  };
  
  static switchUserProfile = async (role:AllTypes.IProfileTypes,user:AllTypes.IUser) =>  {
    let populateMe:any = `profiles.${role}`;
    let o = {path:'profiles',populate:{path:role,populate:{path:'items.item'}}};
    switch(role){
      case AllTypes.IProfileTypes.VENDOR:populateMe = o;break;
      default:break;
    }
    await user.populate(populateMe);
    return {user,role,...await this.generateAuthTokens(user,role)};
  };
  static updateUser = async ({id}:AllTypes.IUser,{profiles,name,role:role_,...$set}:Partial<AllTypes.IUser>) => {
    const role = role_ || AllTypes.IProfileTypes.CUSTOMER;
    const options = {new:true,runValidators:true};
    if($set.pin){
      const newPin = bcrypt.hashSync($set.pin, saltRounds);
      $set.pin = newPin as any;
    }
    const user = await User.findByIdAndUpdate(id,{$set},options);
    return {user};
  };
  static addUserProfile = async (role:AllTypes.IProfileTypes,user:AllTypes.IUser) =>  {
    const { profile } = await ProfilesService.createProfile(role,user);
    user.profiles[role] = profile.id;
    await user.save();
    await user.populate(`profiles.${role}`);
    //send profile added notification
    const notificationMethod = AllTypes.INotificationSendMethods.EMAIL;
    const notificationData = {name:CommonUtils.cap(user.name.first as string)}
    await NotificationService.createNotification("ACCOUNT_UPDATE",notificationMethod,[user.id],notificationData);
    return {user,role};
  };
  static updateUserProfile = async (role:AllTypes.IProfileTypes,user:AllTypes.IUser,updates:any) =>  {
    const profileId = user.profiles[role].id;
    const { profile } = await ProfilesService.updateProfile(role,profileId,updates);
    await user.populate(`profiles.${role}`);
    //send profile UPDATED notification
    const notificationMethod = AllTypes.INotificationSendMethods.EMAIL;
    const notificationData = {name:CommonUtils.cap(user.name.first as string)}
    await NotificationService.createNotification("ACCOUNT_UPDATE",notificationMethod,[user.id],notificationData);
    return {user,role};
  };
  /**
   * Refreshes an access token
   */
  static refreshAuthToken = async (refreshToken: string) => {
    if (!refreshToken) throw new AppError(401,'Unauthorized');
    const storedToken = await AuthToken.findOne({ refreshToken });
    if (!storedToken) throw new AppError(403,'Invalid refresh token');
    try {
      const {id:userId,role} = jwt.verify(refreshToken,jwtSecret) as {id:string,role:AllTypes.IProfileTypes};
      const accessToken = this.generateToken("access",{id:userId,role});
      const newRefreshToken = this.generateToken("refresh",{id:userId,role});
      await AuthToken.findOneAndUpdate({ userId }, { refreshToken: newRefreshToken });
      const user = await User.findById(userId);
      return {user,role,accessToken,refreshToken};
    }
    catch(e){throw new AppError(403,'Invalid refresh token');}
  }
  /**
   * Initiates a password reset request
   */
  static initiatePasswordReset = async ({email}:Pick<AllTypes.IUser,"email">) => {
    const user = await User.findOne({ email });
    if (!user) throw new AppError(404,'User not found');
    const resetToken = this.generateToken("reset",{id:user._id});
    
    //send PASSWORD RECOVERY NOTIFICATION
    const notificationMethod = AllTypes.INotificationSendMethods.EMAIL;
    const notificationData =  {resetLink:"localhost:3000/api/auth/reset?token="+resetToken};
    await NotificationService.createNotification("RESET_PASSWORD",notificationMethod,[user.id],notificationData);
    return {ok:true};
  }
  /**
   * Resets a user’s password
   */
  static resetPassword = async ({token,pin}:{token: string, pin: string}) => {
    try {
      const {id:userId,role} = jwt.verify(token,resetSecret) as  IAppCreds;
      const user = await User.findByIdAndUpdate(userId,{pin:bcrypt.hashSync(pin,saltRounds)});
      
      const notificationMethod = AllTypes.INotificationSendMethods.EMAIL;
      await NotificationService.createNotification("RESET_PASSWORD_SUCCESS",notificationMethod,[user.id]);
      return {user,role};
    }
    catch (e){throw new AppError(400,'Invalid or expired token');}
  }
  /**
   * Logs out a user by blacklisting their access token
   */
  static logoutUser = async (userId:string,tokenExp:Date) => {
    const user = await User.findById(userId);
    user.setStatus(AllTypes.IUserStatuses.INACTIVE);
    await DeadToken.create({expires:tokenExp});
    return {ok:true};
  };
  static generateToken = (type:"access"|"refresh"|"reset",payload:any) => {
    switch(type){
      case "access":return jwt.sign(payload,jwtSecret,{expiresIn:TOKEN_EXPIRATION});
      case "refresh":return jwt.sign(payload,refreshSecret,{expiresIn:REFRESH_EXPIRATION});
      case "reset":return jwt.sign(payload,resetSecret,{expiresIn:RESET_EXPIRATION});
    }
  }
  static generateAuthTokens = async (user:AllTypes.IUser,role:AllTypes.IProfileTypes) => {
    const accessToken = this.generateToken("access",{id:user.id,role});
    const refreshToken = this.generateToken("refresh",{id:user.id,role});
    await AuthToken.findOneAndUpdate({userId: user._id}, { refreshToken }, { upsert: true });
    return {accessToken,refreshToken};
  }
}