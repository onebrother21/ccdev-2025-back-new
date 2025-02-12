
import { Document } from "mongoose";
import * as Profiles from "./profiles";
import * as Notes from "./note";
import * as Orders from "./orders";

export enum IPaymentStatuses {
  DUE_NOW = "due now",
  PAST_DUE = "past due",
  IN_PROGRESS = "in-progress",
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
  FAILED = "failed",
  DISPUTED = "disputed",
  REFUNDED = "refunded",
  CLOSED = "closed",
}
export enum IPaymentMethodTypes {
  CREDIT_CARD = "credit card",
  DEBIT = "debit card",
  WALLET = "mobile wallet",
  TRANSFER = "back transfer",
}
export type IPaymentType = {
  createdOn:Date;
  updatedOn:Date;
  statusUpdates:Status<IPaymentStatuses>[]; 
  status:IPaymentStatuses; 
  customer: Profiles.ICustomer; // Reference to Customer
  order: Orders.IOrder // Reference to Order
  amount: number; // Payment amount
  currency: string; // Currency (e.g., "USD", "EUR")
  method:IPaymentMethodTypes; // Payment type
  transInfo?: any; // External transaction ID (from payment gateway)
  transId: string; // External transaction ID (from payment gateway)
  reason?:string;
  info:any;
};
export interface IPaymentMethods {
  setStatus(name:IPaymentStatuses,info?:any,save?:boolean):Promise<void>;
  preview():Pick<IPayment,"id"|"method"|"amount"|"status">;
  json():Partial<IPayment>;
}
export interface IPayment extends IPaymentType,IPaymentMethods,Document {}