import { Document, Schema } from "mongoose";
import * as User from "./user";
import * as Profiles from "./profiles";
import * as Products from "./products";
import * as Tasks from "./task";
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
export enum IPaymentStatuses {
  NEW = "new",
  PAID = "paid",
  PENDING = "pending",
  FAILED = "failed",
  UNPAID = "unpaid",
  PAST_DUE = "past due"
}
export enum IPaymentMethods {
  CREDIT_CARD = "credit card",
  DEBIT = "debit card",
  WALLET = "mobile wallet",
  TRANSFER = "back transfer",
}

export interface IOrderItem {
  itemId:Products.IProduct;                   // Unique identifier for the item
  name:string;                     // Name of the item
  qty:number;                 // Quantity of the item ordered
  price:number;                    // Price per unit of the item
}
export type IOrderCharges = Record<"subtotal"|"serviceFee"|"deliveryFee"|"adminFees"|"salesTax"|"tip"|"total",number>;

export type IOrderType = {
  customer:Profiles.ICustomer;
  courier:Profiles.ICourier;               // ID of the courier delivering the order
  vendor:Profiles.IVendor;               // ID of the vendor fulfilling the order
  creator:User.IUser;
  createdOn:Date;
  updatedOn:Date;
  reqno:number;
  total: number;              // Total price of the order
  description?:string;                    // Optional description of the order
  statusUpdates:Status<IOrderStatuses>[]; 
  status:IOrderStatuses; 
  scheduledFor:"asap"|Date;              // Estimated or actual delivery date
  deliveredOn?:Date;              // Estimated or actual delivery date
  deliveryAddress:AddressObj;    // Address where the order will be delivered
  paymentStatus?:Status<IPaymentStatuses>;     // Status of the payment (e.g., Paid, Pending, Failed)
  paymentMethod?:IPaymentMethods;    // Payment method used (e.g., Credit Card, Mobile Wallet)
  notes:Notes.INote[];                   // Optional notes or instructions from the customer
  tasks:Tasks.ITask[];
  items:IOrderItem[];               // List of items in the order
  charges:IOrderCharges|null;
  activity:any[];
  rejectedBy:Schema.Types.ObjectId[];
  info:any
}
export interface IOrderMethods {
  setStatus(name:IOrderStatuses,info?:any,save?:boolean):Promise<void>;
  runBusinessLogic(bvars:any):Promise<void>;
  json():Partial<IOrder>;
}
export interface IOrder extends IOrderType,IOrderMethods,Document {}