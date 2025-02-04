import { Document } from "mongoose";
import * as Profiles from "./profiles";

export enum IProductStatuses {
  NEW = "new",
  IN_STOCK = "in-stock",
  SOLD_OUT = "sold-out",
  UNAVAILABLE = "no-longer-available",
  COMING_SOON = "coming-soon",
}
export interface IProductMethods {
  setStatus(name:IProductStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IProduct>;
}
export interface IProduct extends IProductMethods,Document {
  creator:Profiles.IAdmin|Profiles.IVendor;
  creatorRef:`${Profiles.IProfileTypes}s`;
  createdOn:Date;
  updatedOn:Date;
  name: string; // Product name
  status_activity:Status<IProductStatuses>[]; 
  status:IProductStatuses; 
  description?: string; // Detailed description of the product
  sku?: string; // Stock Keeping Unit identifier
  type?: string; // Product type/category
  concentration:{
    amt:number; // Product concentration (e.g., percentage, ratio)
    unit:string; // Product concentration unit
  }
  price:{
    amt:number; // Price per unit
    curr:string //Price currency
    per:string; // Name of the unit (e.g., kg, liters)
  }
  receivedOn?: Date; // Date the product was received
  sellBy?: Date; // Sell-by or expiration date
}