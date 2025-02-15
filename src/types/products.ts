import { Document } from "mongoose";
import * as User from "./user.types";
import * as Profiles from "./profiles";

export enum IProductStatuses {
  NEW = "new",
  IN_STOCK = "in-stock",
  SOLD_OUT = "sold-out",
  UNAVAILABLE = "no-longer-available",
  COMING_SOON = "coming-soon",
}
export enum IProductTypes {
  FLOWER = "flower",
  WAX = "wax",
  OIL = "oil",
  PEN = "pen",
  EDIBLE = "edible",
}
export enum IProductKinds{
  SATIVA = "sativa",
  INDICA = "indica",
  HYBRID = "hybrid",
}
export type IProductReview = {
  user:Profiles.ICustomer;
  score:number;
  title?:string;
  content?:string;
  time:Date;
  slug:string;
};
export type IProductType = {
  creator:Profiles.IVendor;
  vendors:Profiles.IVendor[];
  createdOn:Date;
  updatedOn:Date;
  name: string; // Product name
  statusUpdates:Status<IProductStatuses>[]; 
  status:IProductStatuses; 
  location:{type:"Point",coordinates:[number,number]};
  origin?:string;
  placeOfOrigin?:string;
  dateOfOrigin?:Date;
  description?: string; // Detailed description of the product
  sku?: string; // Stock Keeping Unit identifier
  kind?: IProductKinds; // Product type/category
  type?: IProductTypes; // Product type/category
  concentration:{
    amt:number; // Product concentration (e.g., percentage, ratio)
    unit:string; // Product concentration unit
  }
  price:{
    amt:number; // Price per unit
    curr:string //Price currency
    per:string; // Name of the unit (e.g., kg, liters)
  }
  expiration?: Date; // Sell-by or expiration date
  reviews:IProductReview[];
  rating:number;
  ratingCt:number;
  reviewCt:number;
  vendorCt:number;
  info:any;
};
export interface IProductMethods {
  addReview(review:IProductReview,save?:boolean):Promise<void>;
  removeReview(review:IProductReview,save?:boolean):Promise<void>;
  setStatus(name:IProductStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IProduct>;
}
export interface IProduct extends IProductType,IProductMethods,Document {}