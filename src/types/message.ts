import { Document } from 'mongoose';
import { IChat } from './chat';
import * as Profiles from './profiles';

export enum IMessageStatuses {
  SAVED = 'saved',
  SENT = 'sent',
  DELIVERED = 'delivered',
  SEEN = 'seen',
  REPLIED_TO = 'repliedTo',
  DELETED = 'deleted',
};
export type IMessageType = {
  chat:IChat;
  sender:Profiles.ICustomer|Profiles.ICourier|Profiles.IVendor|Profiles.IAdmin;
  senderRef:`${Profiles.IProfileTypes}s`;
  content: string;
  statusUpdates:Status<IMessageStatuses>[]; 
  status:IMessageStatuses; 
  readBy:(Profiles.ICustomer|Profiles.ICourier|Profiles.IVendor|Profiles.IAdmin)[];
  readByRefs:`${Profiles.IProfileTypes}s`[];
  reactions: {
    user:Profiles.ICustomer|Profiles.ICourier|Profiles.IVendor|Profiles.IAdmin;
    userRef:`${Profiles.IProfileTypes}s`;
    reaction:string
    time:Date;
  }[];
  info:any;
};
// TypeScript Interfacesexport
export interface IMessageMethods {
  setStatus(name:IMessageStatuses,info?:any,save?:boolean):Promise<void>;
  json():Partial<IMessage>;
}
export interface IMessage extends IMessageType,IMessageMethods,Document {}
