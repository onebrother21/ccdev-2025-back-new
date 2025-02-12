import { Document } from "mongoose";
import * as Profiles from "./profiles";
import * as Notes from "./note";
import * as Notifications from "./notification";

export enum IUserStatuses {
  NEW = "new",
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISABLED = "disabled",
  ENABLED = "enabled",
  LOCKED = "locked",
  DELETED = "deleted"

}
export type IUserRoles = "guest"|"user"|"courier"|"vendor"|"admin";
export type IPin = `${Digit}${Digit}${Digit}${Digit}`;
export type IAuthToken = {
  type:"req"|"auth"|"api";
  user:string;
  role:IUserRoles;
  issued:Date;
  expires:Date;
  expiresStr:string;
};
export type IAuthEvents = "created"|"registered"|"verified"|"loggedout"|"loggedin"|"reset"|"updated";
export type IAuthActivity = Partial<Record<IAuthEvents,string|Date>>;
export type IAuthParams = {
  pin:IPin;
  reset:string|null;
  verification:string|null;
  verificationSent:Date;
  pushToken:string|null;
  socketId:string|null;
  // token:AuthToken|null;
  // scopes:string[];
  // activity:AuthActivity;
};
export type IUserType = {
  role:Profiles.IProfileTypes;
  createdOn:string|Date;
  updatedOn:string|Date;
  status:IUserStatuses; 
  statusUpdates:Status<IUserStatuses>[];
  email:string;
  name:{first:string;last:string;};
  username:string;
  dob:string|Date;
  mobile: string;
  location:string;
  loc?:LocationObj;
  agree:Date;
  prefs:Partial<{
    acceptTerms:Date;
    acceptUA:Date;
    acceptCookies:Date;
    acceptPrivacy:Date;
  }>;
  profiles:{
    admin?:Profiles.IAdmin;
    courier?:Profiles.ICourier;
    customer?:Profiles.ICustomer;
    vendor?:Profiles.IVendor;
  };
  meta?:{
    isAgeVerified?:boolean;
    isLicenseVerified?:boolean;
  }
  info:any;
};
export type IUserInit = Pick<IUser,"email"|"role"|"dob">;
export type IUserPreview = Pick<IUser,"id"|"location"|"name"|"role"> & {img?:string;title?:string;username?:string};
export type IUserJson = IUserPreview & Pick<IUserType,"prefs"|"meta"|"status"|"info"> & {
  profile:Profiles.IAdmin|Profiles.ICourier|Profiles.ICustomer|Profiles.IVendor;
  memberSince:Date;
  lastUpdate:Date;
  isMgr:boolean;
  age:number;
  bio?:string;
};
export interface IUserMethods {
  setStatus(name:IUserStatuses,info?:any,save?:boolean):Promise<void>;
  getProfile(role:Profiles.IProfileTypes):Profiles.IAdmin|Profiles.ICourier|Profiles.ICustomer|Profiles.IVendor|null;
  toAge():number|null;
  getUserContactByMethod(method:Notifications.INotificationSendMethods):string;
  preview(role:Profiles.IProfileTypes):IUserPreview;
  json(role:Profiles.IProfileTypes,auth?:boolean):Partial<IUserJson>;
}
export interface IUser extends IAuthParams,IUserType,IUserMethods,Document {}