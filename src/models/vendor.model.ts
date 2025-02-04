import mongoose,{Schema,Model} from 'mongoose';
import { getStatusArraySchema,getAddressSchema,getLicenseSchema } from '../utils';
import * as AllTypes from "../types";

type VendorModel = Model<AllTypes.IVendor,{},AllTypes.IVendorMethods>;
const ObjectId = Schema.Types.ObjectId;

const vendorSchema = new Schema<AllTypes.IVendor,VendorModel,AllTypes.IVendorMethods>({
  approval_activity:getStatusArraySchema(Object.values(AllTypes.IApprovalStatuses),AllTypes.IApprovalStatuses.REQUESTED),
  approval:{type:String,default:AllTypes.IApprovalStatuses.REQUESTED},
  name:{type:String,required:true,validate:/^[a-zA-Z0-9]{2,20}$/,unique: true, lowercase: true},
  img:{type:String},
  title:{type:String},
  bio:{type:String,max:140},
  address:{type:getAddressSchema(),required:true},
  license:{type:getLicenseSchema(),required:true},
  user:{type:ObjectId,ref:"users",required:true},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

vendorSchema.methods.setApproval = async function (name,info,save){
  const approval = {name,time:new Date(),...(info?{info}:{})};
  this.approval_activity.push(approval);
  this.approval = approval.name;
  if(save) await this.save();
};
vendorSchema.methods.json = function () {
  const json:Partial<AllTypes.IVendor> =  {};
  json.id = this.id;
  json.name = this.name;
  json.img = this.img;
  json.title = this.title;
  json.bio = this.bio;
  json.address = this.address;
  json.license = this.license;
  json.approval = this.approval;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as AllTypes.IVendor;
};

const Vendor = mongoose.model<AllTypes.IVendor,VendorModel>('vendors',vendorSchema);
export default Vendor;