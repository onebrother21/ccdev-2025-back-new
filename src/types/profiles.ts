import { Document } from "mongoose";
import * as User from "./user";
import * as Products from "./products";


export enum IProfileTypes {
  ADMIN = "admin",
  COURIER = "courier",
  CUSTOMER = "customer",
  VENDOR = "vendor",
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
  info:any;
};
export interface ICustomerMethods {
  setStatus(name:IProfileStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<ICustomer>;
}
export interface ICustomer extends ICustomerType,ICustomerMethods,Document{}

/** Hashdash Vendor Profile */
export type IVendorType = {
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
    item:Products.IProduct,
    receivedOn:Date; // Date the product was received
  }[];
  displayName?:string;
  img?:string;
  bio?:string;
  title?:string;
  license?:ILicenseInfo;
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
  info:any;
};
export interface IAdminMethods {
  setStatus(name:IProfileStatuses,info?:any,save?:boolean):Promise<void>;
  setApproval(name:IApprovalStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IAdmin>;
}
export interface IAdmin extends IAdminType,IAdminMethods,Document {}