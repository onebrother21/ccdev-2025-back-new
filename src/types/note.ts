import { Document } from "mongoose";
import * as Profiles from "./profiles";
export type INoteType = {
  user:Profiles.IAdmin|Profiles.ICourier|Profiles.ICustomer|Profiles.IVendor;
  userRef:`${Profiles.IProfileTypes}s`;
  msg:string;
  time:Date;
  slug:string;
  info:any;
};
export interface INoteMethods {
  json():Partial<INote>;
}
export interface INote extends INoteType,INoteMethods,Document {}