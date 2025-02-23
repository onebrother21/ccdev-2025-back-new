import { Document } from "mongoose";
import * as User from "./user.types";
import * as Products from "./products";


export enum IProfileTypes {
  ADMIN = "admin",
  COURIER = "courier",
  CUSTOMER = "customer",
  VENDOR = "vendor",
}
export enum IProfileModelNames {
  ADMINS = "admins",
  COURIERS = "couriers",
  CUSTOMERS = "customers",
  VENDORS = "vendors",
}
export enum IProfileStatuses {
  NEW = "new",
  ACTIVE = "active",
  INACTIVE = "inactive",
  DISABLED = "disabled",
  ENABLED = "enabled",
  LOCKED = "locked",
  DELETED = "deleted"
}
export enum IApprovalStatuses {
  REQUESTED = "requested",
  APRROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
  CANCELLED = "cancelled",
}
export type IVehicle = {
  VIN:string;
  make:string;
  model:string;
  trim?:string;
  year:number;
  color:string;
  mileage:number;
  plateNo:string;
  plateSt:string;
};
export type ILicenseInfo = {
  num:string;
  state:string;
  expires:Date;
};
export type IInsuranceInfo = {
  num:string;
  state:string;
  expires:Date;
  agent:string;
  insurer:string;
  vehicle:string
};


/** Hashdash Customer Profile */
export type ICustomerType = {
  createdOn:string|Date;
  updatedOn:string|Date;
  user:User.IUser;
  name:string;
  displayName?:string;
  img?:string;
  bio?:string;
  title?:string;
  location:{type:"Point",coordinates:[number,number]};
  address:AddressObj;
  license:ILicenseInfo;
  status:IProfileStatuses; 
  statusUpdates:Status<IProfileStatuses>[];
  cart:{item:Products.IProduct,qty:number}[];
  reports:IContentReport[];
  info:any;
};
export interface ICustomerMethods {
  setStatus(name:IProfileStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<ICustomer>;
}
export interface ICustomer extends ICustomerType,ICustomerMethods,Document{}

/** Hashdash Vendor Profile */
export type IVendorType = {
  createdOn:string|Date;
  updatedOn:string|Date;
  mgr:User.IUser;
  users:User.IUser[];
  name:string;
  email:string;
  phone:string;
  hours:{open:string,close:string};
  address:AddressObj;
  location:{type:"Point",coordinates:[number,number]};
  status:IProfileStatuses; 
  statusUpdates:Status<IProfileStatuses>[];
  approval:IApprovalStatuses;
  approvalUpdates:Status<IApprovalStatuses>[]; 
  items:{
    qty:number;
    product:Products.IProduct;
    receivedOn:Date; // Date the product was received
  }[];
  itemCt:number;
  displayName?:string;
  img?:string;
  bio?:string;
  title?:string;
  license?:ILicenseInfo;
  tempPswd:{code:string;expires:Date}|null;
  reports:IContentReport[];
  info:any;
};
export interface IVendorMethods {
  setStatus(name:IProfileStatuses,info?:any,save?:boolean):Promise<void>;
  setApproval(name:IApprovalStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IVendor>;
}
export interface IVendor extends IVendorType,IVendorMethods,Document {}


/** Hashdash Courier Profile */
export type ICourierType = {
  createdOn:string|Date;
  updatedOn:string|Date;
  user:User.IUser;
  name:string;
  displayName?:string;
  img?:string;
  bio?:string;
  title?:string;
  isAvailable:boolean;
  location:{type:"Point",coordinates:[number,number]};
  vehicle:IVehicle;
  license:ILicenseInfo;
  insurance:any;
  status:IProfileStatuses; 
  statusUpdates:Status<IProfileStatuses>[];
  approvalUpdates:Status<IApprovalStatuses>[]; 
  approval:IApprovalStatuses;
  reports:IContentReport[];
  info:any;
};
export interface ICourierMethods {
  setStatus(name:IProfileStatuses,info?:any,save?:boolean):Promise<void>;
  setApproval(name:IApprovalStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<ICourier>;
}
export interface ICourier extends ICourierType,ICourierMethods,Document {}


/** Hashdash Admin Profile */
export type IAdminType = { 
  createdOn:string|Date;
  updatedOn:string|Date;
  user:User.IUser;
  name:string;
  displayName?:string;
  img?:string;
  bio?:string;
  title?:string;
  scopes:string[];
  location:{type:"Point",coordinates:[number,number]};
  status:IProfileStatuses; 
  statusUpdates:Status<IProfileStatuses>[];
  approvalUpdates:Status<IApprovalStatuses>[]; 
  approval:IApprovalStatuses;
  reports:IContentReport[];
  info:any;
};
export interface IAdminMethods {
  setStatus(name:IProfileStatuses,info?:any,save?:boolean):Promise<void>;
  setApproval(name:IApprovalStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IAdmin>;
}
export interface IAdmin extends IAdminType,IAdminMethods,Document {}

// Artist Interface & Schema
export interface IArtistType {
  createdOn:string|Date;
  updatedOn:string|Date;
  name: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: { platform: string; url: string }[];
  reports:IContentReport[];
}

export interface IArtistMethods {
  //setStatus(name:IArtistStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IArtist>;
}
export interface IArtist extends IArtistType,IArtistMethods,Document {}
export type IProfiles = ICustomer|ICourier|IVendor|IAdmin|IArtist;
// Report Item Type
export type IContentReport = {
  createdOn:string|Date;
  updatedOn:string|Date;
  user:IProfiles;
  userRef:IProfileModelNames;
  reason:string;
  time:Date;
  status:"new"|"under-review"|"accepted"|"rejected";
  content:any
  contentRef:string;
};