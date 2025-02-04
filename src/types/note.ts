import { Document } from "mongoose";
import * as Profiles from "./profiles";

export interface INote extends Document {
  user:Profiles.IAdmin|Profiles.ICourier|Profiles.ICustomer|Profiles.IVendor;
  userRef:`${Profiles.IProfileTypes}s`;
  msg:string;
  time:Date;
  slug:string;
}