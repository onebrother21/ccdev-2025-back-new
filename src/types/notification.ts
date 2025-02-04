import { Document } from "mongoose";
import * as Users from "./user";
import * as Profiles from "./profiles";

export enum INotificationTemplates {
  REGISTER = "Welcome {{name}}, thank you for registering with us!",
  VERIFY = "Hello {{name}}, please verify your email by clicking this link: {{verificationLink}}",
  UNRECOGNIZED_LOGIN = "Hey {{name}}, we noticed an unrecognized login from a new device. If this wasn't you, please secure your account.",
  RESET_PASSWORD = "Hi {{name}}, click here to reset your password: {{resetLink}}",
  ORDER_CONFIRMATION = "Thank you for your order, {{name}}! Your order #{{orderNumber}} has been confirmed.",
  ORDER_SHIPPED = "Good news, {{name}}! Your order #{{orderNumber}} has been shipped and is on its way.",
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
  FAILED = "failed",
}
export enum INotificationSendMethods {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  IN_APP = "in-app",
  AUTO = "auto",
}
export interface INotificationMethods {
  setStatus(name:INotificationStatuses,info?:any,save?:boolean):Promise<void>;
  preview():Pick<INotification,"id"|"type"|"method"|"job"|"status"|"createdOn">;
  json():Partial<INotification>;
}
export interface INotification extends Document {
  creator:Profiles.IAdmin;
  creatorRef:`${Profiles.IProfileTypes}s`;
  type:keyof typeof INotificationTemplates;
  method:INotificationSendMethods;
  audience:Users.IUser[];
  status_activity:Status<INotificationStatuses>[]; 
  status:INotificationStatuses; 
  data: Record<string, any>; // Replaceable data for personalization
  job: string;
  meta: any;
  retries:number;
  createdOn:Date;
  updatedOn:Date;
}