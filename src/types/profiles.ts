import { Document } from "mongoose";
import * as Users from "./user";


export enum IProfileTypes {
  ADMIN = "admin",
  COURIER = "courier",
  CUSTOMER = "customer",
  VENDOR = "vendor",
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
export interface ICustomerMethods {
  json():Partial<ICustomer>;
}
export interface ICustomer extends ICustomerMethods,Document{
  name:string;
  displayName?:string;
  img?:string;
  bio?:string;
  title?:string;
  address:AddressObj;
  license:ILicenseInfo;
  user:Users.IUser;
}
export interface IVendorMethods {
  setApproval(name:IApprovalStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IVendor>;
}
export interface IVendor extends IVendorMethods,Document {
  name:string;
  displayName?:string;
  img?:string;
  bio?:string;
  title?:string;
  address:AddressObj;
  license:ILicenseInfo;
  approval_activity:Status<IApprovalStatuses>[]; 
  approval:IApprovalStatuses; 
  user:Users.IUser;
}
export interface ICourierMethods {
  setApproval(name:IApprovalStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<ICourier>;
}
export interface ICourier extends ICourierMethods,Document {
  name:string;
  displayName?:string;
  img?:string;
  bio?:string;
  title?:string;
  vehicle:IVehicle;
  license:ILicenseInfo;
  insurance:any;
  approval_activity:Status<IApprovalStatuses>[]; 
  approval:IApprovalStatuses; 
  user:Users.IUser;
}

export interface IAdminMethods {
  setApproval(name:IApprovalStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IAdmin>;
}
export interface IAdmin extends IAdminMethods,Document {
  name:string;
  displayName?:string;
  img?:string;
  bio?:string;
  title?:string;
  scopes:string[];
  approval_activity:Status<IApprovalStatuses>[]; 
  approval:IApprovalStatuses; 
  user:Users.IUser;
}