import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import Models from '../../models';
import Services from '../../services';
import Types from "../../types";
import Utils from '../../utils';

const TOKEN_EXPIRATION = '1h'; // 1 hour
const REFRESH_EXPIRATION = '7d'; // 7 days
const RESET_EXPIRATION = '15m'; // 7 days

const jwtSecret = process.env.JWT_KEY || "supersecretkey";
const refreshSecret = process.env.REFRESH_SECRET || 'refreshsecret';
const resetSecret = process.env.REFRESH_SECRET || 'resetsecret';
const saltRounds = Number(process.env.SALT_ROUNDS || 10);
const devStaticVerify = process.env.DEV_STATIC_VERIFY;
const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

const profileModels:Record<Types.IProfileTypes,Model<any>> = {
  customer:Models.Customer,
  courier:Models.Courier,
  vendor:Models.Vendor,
  admin:Models.Admin
};

export class AuthService {
  /**
   * To check for existing user using front-end typeahead
   */
  static lookupUser = async (email: string) => await Models.User.findOne({ email });
  /**
   * Sign up a new user
   */
  static signupUser = async ({email,dob}:Types.IUserInit) =>  {
    const role = Types.IProfileTypes.CUSTOMER;
    if(await Models.User.findOne({email})) throw new Utils.AppError(400,"User already exists");
    const verification = Utils.shortId();
    const user = await Models.User.create({
      email,
      dob:new Date(dob),
      verification:bcrypt.hashSync(verification,saltRounds),
      verificationSent:new Date(),
    });
    // Send welcome notification
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData = {code:verification};
    await Services.Notification.createNotification("VERIFY",notificationMethod,[user.id],notificationData);
    return {user,role};
  };
  /**
   * Verify user email
   */
  static verifyUser = async ({id,verification,role:role_}:Partial<Types.IUser>) => {
    const role = role_ || Types.IProfileTypes.CUSTOMER;
    const user = await Models.User.findById(id);
    const isMatch = await bcrypt.compare(verification,user.verification);
    const devVerify = devStaticVerify && devStaticVerify == verification;
    switch(true){
      case !user:
      case !devVerify && !isMatch:throw new Utils.AppError(401,"Email verification failed!");
      default:{
        user.verification = null;
        user.verificationSent = null;
        await user.setStatus(Types.IUserStatuses.ENABLED,null,true);
        return {user,role};
      }
    }
  }
  /**
   * Registers a new user
   */
  static registerUser = async ({id,...data}:Partial<Types.IUser>) => {
    const user = await Models.User.findById(id);
    const role = Types.IProfileTypes.CUSTOMER;
    if(!user) throw new Utils.AppError(401,"Registration failed!");
    user.set({
      name:data.name,
      mobile: data.mobile,
      username:data.username,
      pin:bcrypt.hashSync(data.pin,saltRounds),
    });
    const { profile } = await Services.Profiles.createProfile(role,user);
    user.profiles[role] = profile.id;
    await user.setStatus(Types.IUserStatuses.ACTIVE,null,true);
    await user.populate(`profiles.${role}`);
    //send registration notification
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData = {name:Utils.cap(data.name.first as string)};
    await Services.Notification.createNotification("REGISTER",notificationMethod,[user.id],notificationData);
    return {user,role,...await this.generateAuthTokens(user,role)};
  };

  /**
   * Logs in a user and returns an access token
   */
  static loginUser = async ({email,pin,role:role_}:Pick<Types.IUser,"email"|"pin"|"role">) => {
    const role = role_ || Types.IProfileTypes.CUSTOMER;
    const user = await AuthService.lookupUser(email);
    let unrecognized = false;
    if(!user || !await bcrypt.compare(pin,user.pin)) throw new Utils.AppError(401,'Ops! wrong Username or Password!');
    await user.setStatus(Types.IUserStatuses.ACTIVE,null,true);
    await user.populate(`profiles.${role}`);
    
    // Send welcome notification
    const notificationMethod = Types.INotificationSendMethods.SMS;
    const notificationData = {name:Utils.cap(user.name.first as string)};
    if(unrecognized) await Services.Notification.createNotification("UNRECOGNIZED_LOGIN",notificationMethod,[user.id],notificationData);
    return {user,role,...await this.generateAuthTokens(user,role)};
  };
  /**
   * Refreshes an access token
   */
  static refreshAuthToken = async (refreshToken: string) => {
    if (!refreshToken) throw new Utils.AppError(401,'Unauthorized');
    const storedToken = await Models.AuthToken.findOne({ refreshToken });
    if (!storedToken) throw new Utils.AppError(403,'Invalid refresh token');
    try {
      const {id,role} = jwt.verify(refreshToken,jwtSecret) as {id:string,role:Types.IProfileTypes};
      const accessToken = this.generateToken("access",id,role);
      const newRefreshToken = this.generateToken("refresh",id,role);
      await Models.AuthToken.findOneAndUpdate({ userId:id }, { refreshToken: newRefreshToken });
      const user = await Models.User.findById(id);
      return {user,role,accessToken,refreshToken};
    }
    catch(e){throw new Utils.AppError(403,'Token refresh failed');}
  }
  /**
   * Logs out a user by blacklisting their access token
   */
  static logoutUser = async (userId:string,stub:string) => {
    const user = await Models.User.findById(userId);
    user.setStatus(Types.IUserStatuses.INACTIVE);
    await Models.DeadToken.create({stub});
    return {ok:true};
  };
  
  static switchUserProfile = async (role:Types.IProfileTypes,user:Types.IUser) =>  {
    let populateMe:any = `profiles.${role}`;
    let o = {path:'profiles',populate:{path:role,populate:{path:'items.item'}}};
    switch(role){
      case Types.IProfileTypes.VENDOR:populateMe = o;break;
      default:break;
    }
    await user.populate(populateMe);
    return {user,role,...await this.generateAuthTokens(user,role)};
  };
  static updateUser = async ({id}:Types.IUser,{profiles,name,role:role_,...$set}:Partial<Types.IUser>) => {
    const role = role_ || Types.IProfileTypes.CUSTOMER;
    const options = {new:true,runValidators:true};
    if($set.pin){
      const newPin = bcrypt.hashSync($set.pin, saltRounds);
      $set.pin = newPin as any;
    }
    const user = await Models.User.findByIdAndUpdate(id,{$set},options);
    return {user};
  };
  static addUserProfile = async (role:Types.IProfileTypes,user:Types.IUser) =>  {
    const { profile } = await Services.Profiles.createProfile(role,user);
    user.profiles[role] = profile.id;
    await user.save();
    await user.populate(`profiles.${role}`);
    //send profile added notification
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData = {name:Utils.cap(user.name.first as string)}
    await Services.Notification.createNotification("ACCOUNT_UPDATE",notificationMethod,[user.id],notificationData);
    return {user,role};
  };
  static updateUserProfile = async (role:Types.IProfileTypes,user:Types.IUser,updates:any) =>  {
    const profileId = user.profiles[role].id;
    const { profile } = await Services.Profiles.updateProfile(role,profileId,updates);
    await user.populate(`profiles.${role}`);
    //send profile UPDATED notification
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData = {name:Utils.cap(user.name.first as string)}
    await Services.Notification.createNotification("ACCOUNT_UPDATE",notificationMethod,[user.id],notificationData);
    return {user,role};
  };
  /**
   * Initiates a password reset request
   */
  static initiatePasswordReset = async ({email}:Pick<Types.IUser,"email">) => {
    const user = await Models.User.findOne({ email });
    if (!user) throw new Utils.AppError(404,'User not found');
    const resetToken = this.generateToken("reset",user.id);
    
    //send PASSWORD RECOVERY NOTIFICATION
    const notificationMethod = Types.INotificationSendMethods.EMAIL;
    const notificationData =  {resetLink:"localhost:3000/api/auth/reset?token="+resetToken};
    await Services.Notification.createNotification("RESET_PASSWORD",notificationMethod,[user.id],notificationData);
    return {ok:true};
  }
  /**
   * Resets a user’s password
   */
  static resetPassword = async ({token,pin}:{token: string, pin: string}) => {
    try {
      const {id:userId,role} = jwt.verify(token,resetSecret) as  IAppCreds;
      const user = await Models.User.findByIdAndUpdate(userId,{pin:bcrypt.hashSync(pin,saltRounds)});
      
      const notificationMethod = Types.INotificationSendMethods.EMAIL;
      await Services.Notification.createNotification("RESET_PASSWORD_SUCCESS",notificationMethod,[user.id]);
      return {user,role};
    }
    catch (e){throw new Utils.AppError(400,'Invalid or expired token');}
  }
  static generateToken = (type:Types.IAuthToken["type"],id:string,role:Types.IProfileTypes = Types.IProfileTypes.CUSTOMER) => {
    const hash = Utils.hexId(32);
    const payload:Types.IAuthTokenInit = {type,id,role,sub:`av2/${hash}`};
    const issuer = `http://${hostname}:${port}`;
    Utils.logger.info({payload,hash,issuer});
    let secret = "",expiresIn = "";
    switch(type){
      case "access":secret = jwtSecret;expiresIn = TOKEN_EXPIRATION;break;
      case "refresh":secret = refreshSecret;expiresIn = REFRESH_EXPIRATION;break;
      case "reset":secret = resetSecret;expiresIn = RESET_EXPIRATION;break;
    }
    return jwt.sign(payload,secret,{expiresIn,issuer});
  }
  static generateAuthTokens = async ({id}:Types.IUser,role:Types.IProfileTypes = Types.IProfileTypes.CUSTOMER) => {
    const accessToken = this.generateToken("access",id,role);
    const refreshToken = this.generateToken("refresh",id,role);
    await Models.AuthToken.findOneAndUpdate({userId:id}, { refreshToken }, { upsert: true });
    return {accessToken,refreshToken};
  }
}