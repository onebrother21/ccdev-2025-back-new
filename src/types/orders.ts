import { Document } from "mongoose";
import * as User from "./user.types";
import * as Profiles from "./profiles";
import * as Products from "./products";
import * as Payment from "./payment.types";
import * as Tasks from "./task.types";
import * as Notes from "./note";

export enum IOrderStatuses {
  NEW = "new",
  PLACED = "placed",
  ASSIGNED = "assigned",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  PENDING = "pending",
  IN_TRANSIT = "in-transit",
  READY = "ready-for-pickup",
}
export interface IOrderItem {
  itemId:Products.IProduct;                   // Unique identifier for the item
  name:string;                     // Name of the item
  qty:number;                 // Quantity of the item ordered
  price:number;                    // Price per unit of the item
}
export type IOrderCharges = Record<"subtotal"|"serviceFee"|"deliveryFee"|"adminFees"|"salesTax"|"tip"|"total",number>;

export type IOrderType = {
  createdOn:Date;
  updatedOn:Date;
  statusUpdates:Status<IOrderStatuses>[]; 
  status:IOrderStatuses; 
  customer:Profiles.ICustomer;
  courier:Profiles.ICourier;               // ID of the courier delivering the order
  vendor:Profiles.IVendor;               // ID of the vendor fulfilling the order
  reqno:number;
  total: number;              // Total price of the order
  description?:string;                    // Optional description of the order
  scheduledFor:"asap"|Date;              // Estimated or actual delivery date
  deliveryAddress:AddressObj;    // Address where the order will be delivered
  deliveredOn?:Date;              // Estimated or actual delivery date
  payment?:Payment.IPayment;    // Payment
  notes:Notes.INote[];                   // Optional notes or instructions from the customer
  tasks:Tasks.ITask[];
  items:IOrderItem[];               // List of items in the order
  charges:IOrderCharges|null;
  activity:any[];
  rejectedBy:(Profiles.ICourier|Profiles.IVendor)[];
  info:any
}
export interface IOrderMethods {
  setStatus(name:IOrderStatuses,info?:any,save?:boolean):Promise<void>;
  calculateCharges(bvars:any):Promise<void>;
  json():Partial<IOrder>;
}
export interface IOrder extends IOrderType,IOrderMethods,Document {}