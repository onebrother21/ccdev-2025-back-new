import { Document } from "mongoose";
import * as Users from "./user.types";
import * as Profiles from "./profiles";

export enum INotificationTemplates {
  REGISTER = "Welcome {{name}}, thank you for registering with us!",
  VERIFY = "Hello and thank you for choosing HashDash. Your verification code is {{code}} and it expires in 15 minutes.",
  UNRECOGNIZED_LOGIN = "Hey {{name}}, we noticed an unrecognized login from a new device. If this wasn't you, please secure your account.",
  
  VENDOR_REGISTERED = "Welcome {{name}}, thank you for registering your vendor account #{{accountNo}} with us!",
  VENDOR_ACCT_TEMP_PSWD = "You have requested a temporary passcode to add someone to your vendor account. The code is {{tempPswd}}."+
  " It expires in 30 minutes.",
  VENDOR_ACCT_USER_ADDED = "User {{name}} have been added to vendor account #{{accountNo}}.",
  VENDOR_ACCT_USER_REMOVED = "User {{name}} have been removed from vendor account #{{accountNo}}.",
  VENDOR_DISABLED = "Your vendor account #{{accountNo}} has been disabled.",
  VENDOR_REMOVED = "Your vendor account #{{accountNo}} has been removed.",




  COURIER_ASSIGNED = `You have been assigned order {{orderId}}. Please accept or reject.`,
  COURIER_ASSIGNMENT_CANCELLED = `Order assignment canceled: {{orderId}}`,

  ORDER_PLACED = "Your order #{{orderId}} has been received.",
  ORDER_UPDATE = "Your order #{{orderId}} has been updated.",
  ORDER_COMPLETE = "Thank you for your order, {{name}}! Your order #{{orderNumber}} has been complete.",
  ORDER_CONFIRMATION = "Thank you for your order, {{name}}! Your order #{{orderNumber}} has been confirmed.",

  RESET_PASSWORD = "Hi {{name}}, click here to reset your password: {{resetLink}}",
  RESET_PASSWORD_SUCCESS = "Your password has been updated. If you did not request this change, click here.",
  ORDER_OUT_FOR_DELIVERY = "Good news, {{name}}! Your order #{{orderNumber}} has been picked up and is on its way.",
  PAYMENT_SUCCESS = "Hi {{name}}, your payment of {{amount}} was successfully processed. Thank you for shopping with us!",
  PAYMENT_FAILED = "Oops, {{name}}. Your payment of {{amount}} could not be processed. Please check your payment details.",
  NEW_MESSAGE = "You have a new message from {{senderName}}: {{message}}",
  CHAT_INVITE = "{{senderName}} has invited you to a chat. Click here to join: {{inviteLink}}",
  DELIVERY_STATUS = "Your package is {{status}}, {{name}}. Track your delivery here: {{trackingLink}}",
  DRIVER_UI_UPDATE = "Hello driver {{name}}, new job assigned. Check your dashboard for details.",
  PROMOTIONAL_OFFER = "Hi {{name}}, don’t miss out on our latest offer: {{offerDetails}}. Shop now!",
  ACCOUNT_UPDATE = "Your account has been updated successfully, {{name}}.",
  INVOICE_READY = "Hi {{name}}, your invoice #{{invoiceNumber}} is ready. View it here: {{invoiceLink}}",
  USER_FEEDBACK_REQUEST = "Hello {{name}}, we value your opinion. Please take a moment to provide feedback on your recent experience.",
  SYSTEM_ALERT = "Alert: {{alertMessage}}",
  SHIPPING_DELAY = "Hello {{name}}, we regret to inform you that your order #{{orderNumber}} has been delayed. We apologize for the inconvenience.",
}
export enum INotificationStatuses {
  NEW = "new",
  SENDING = "sending",
  SENT = "sent",
  SENT_SOME = "sent-some",
  FAILED = "failed",
}
export enum INotificationSendMethods {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  IN_APP = "in-app",
  AUTO = "auto",
}
export type INotificationType = {
  type:keyof typeof INotificationTemplates;
  method:INotificationSendMethods;
  audience:Users.IUser[];
  data: Record<string, any>; // Replaceable data for personalization
  statusUpdates:Status<INotificationStatuses>[]; 
  status:INotificationStatuses; 
  job: string;
  meta: any;
  retries:number;
  info:any;
};
export type INotificationInit = Pick<INotificationType,"type"|"method"|"audience"|"data">;

export interface INotificationMethods {
  setStatus(name:INotificationStatuses,info?:any,save?:boolean):Promise<void>;
  preview():Pick<INotification,"id"|"type"|"method"|"job"|"status">;
  json():Partial<INotification>;
}
export interface INotification extends INotificationType,INotificationMethods,Document {}