import {Document} from 'mongoose';
import * as Users from './user';
import * as Profiles from './profiles';
import * as Messages from './message';

export enum IChatStatuses {
  ACTIVE = "active",
  DISABLED = "disabled",
  LOCKED = "locked",
  DELETED = "deleted",
}
export type IChatType = {
  type:"user-chat"|"service-chat";
  statusUpdates:Status<IChatStatuses>[]; 
  status:IChatStatuses; 
  participants:(Profiles.ICustomer|Profiles.IVendor|Profiles.ICourier|Profiles.IAdmin)[];
  participantRefs:`${Profiles.IProfileTypes}s`[];
  messages: Messages.IMessage[];
  lastMessage?: Messages.IMessage;
  lastViewed?:Date;
  info:any;
};
export interface IChatMethods {
  setStatus(name:IChatStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IChat>;
}
export interface IChat extends IChatType,IChatMethods,Document {}