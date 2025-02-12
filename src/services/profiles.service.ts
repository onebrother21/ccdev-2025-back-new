import { User,Customer, Courier, Vendor, Admin } from '../models';
import { Model } from 'mongoose';
import { logger } from '../utils';
import * as AllTypes from "../types";

const profileModels:Record<AllTypes.IProfileTypes,Model<any>> = {
  customer:Customer,
  courier:Courier,
  vendor:Vendor,
  admin:Admin
};
export class ProfilesService {
  /**
   * To check for existing user
   */
  static getProfile = async (email: string) => await User.findOne({ email });
  /**
   * Sign up a new user
   */
  static createProfile = async (role:AllTypes.IProfileTypes,user:AllTypes.IUser) =>  {
    const model = profileModels[role];
    const profile = new model({
      user:user._id,
      name:user.name.first + " " + user.name.last,
      displayName:user.username,
    }) as AllTypes.IAdmin|AllTypes.ICourier|AllTypes.ICustomer|AllTypes.IVendor;
    await profile.save();
    return {profile};
  }
  static updateProfile = async (role:AllTypes.IProfileTypes,profileId:string,updates:any) => {
    const model = profileModels[role];
    const options = {new:true,runValidators:true};
    const profile = await model.findByIdAndUpdate(profileId,updates,options);
    return {profile};
  };
}