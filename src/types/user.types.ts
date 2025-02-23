import { Document } from "mongoose";
import * as Auth from "./auth.types";
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
export type IUserType = Auth.IAuthParams & {
  createdOn:string|Date;
  updatedOn:string|Date;
  role:Profiles.IProfileTypes;
  statusUpdates:Status<IUserStatuses>[];
  status:IUserStatuses; 
  email:string;
  mobile:string;
  name:{first:string;last:string;};
  fullname:string;
  username:string;
  dob:string|Date;
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
    artist?:Profiles.IArtist;
  };
  meta?:{
    isAgeVerified?:boolean;
    isLicenseVerified?:boolean;
  }
  info:any;
};
export type IUserInit = Pick<IUserType,"email"|"role"|"dob">;
export type IUserPreview = Pick<IUserType,"location"|"name"|"role"> & {id:string;img?:string;title?:string;username?:string};
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
  json(role:Profiles.IProfileTypes,auth?:boolean):IUserJson;
}
export interface IUser extends IUserType,IUserMethods,Document {}