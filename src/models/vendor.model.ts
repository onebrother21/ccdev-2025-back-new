import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { getStatusArraySchema,getAddressSchema,getLicenseSchema } from '../utils';
import * as AllTypes from "../types";

type VendorModel = Model<AllTypes.IVendor,{},AllTypes.IVendorMethods>;
const ObjectId = Schema.Types.ObjectId;

const itemsSchema = new Schema<AllTypes.IVendor["items"][0]>({
  qty:{type:Number},
  item:{type:ObjectId,ref:"products",required:true},
  receivedOn:{type:Date},
},{_id:false,timestamps:false});
const hoursSchema = new Schema({open: { type: String},close: { type: String},},{_id:false,timestamps:false});
const vendorSchema = new Schema<AllTypes.IVendor,VendorModel,AllTypes.IVendorMethods>({
  mgr:{type:ObjectId,ref:"users",required:true},
  users:[{type:ObjectId,ref:"users"}],
  approvalUpdates:getStatusArraySchema(Object.values(AllTypes.IApprovalStatuses),AllTypes.IApprovalStatuses.REQUESTED),
  statusUpdates:getStatusArraySchema(Object.values(AllTypes.IProfileStatuses),AllTypes.IProfileStatuses.NEW),
  name:{type:String,required:true,validate:/^[a-zA-Z0-9\s]{3,20}$/,unique: true, lowercase: true},
  displayName:{type:String,validate:/^[a-zA-Z0-9]{2,20}$/,sparse: true},
  email: { type: String, unique: true, lowercase: true ,required:true},
  phone: { type: String, unique: true },
  hours:{type:hoursSchema},
  img:{type:String},
  title:{type:String},
  bio:{type:String,max:140},
  location:{type:{type:String,default:"Point"},coordinates:[Number]},
  address:{type:getAddressSchema(),required:true},
  license:{type:getLicenseSchema()},
  items:{type:[itemsSchema],default:[]},
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

vendorSchema.plugin(uniqueValidator,{type:'mongoose-unique-validator'});
vendorSchema.index({location:"2dsphere"});
vendorSchema.virtual('approval').get(function () {
  return this.approvalUpdates[this.approvalUpdates.length - 1].name;
});
vendorSchema.methods.setApproval = async function (name,info,save){
  const approval = {name,time:new Date(),...(info?{info}:{})};
  this.approvalUpdates.push(approval);
  if(save) await this.save();
};
vendorSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
vendorSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  if(save) await this.save();
};
vendorSchema.methods.json = function () {
  const json:Partial<AllTypes.IVendor> =  {};
  json.id = this.id;
  json.displayName = this.displayName;
  json.name = this.name;
  json.email = this.email;
  json.phone = this.phone;
  json.hours = this.hours;
  json.img = this.img;
  json.title = this.title;
  json.bio = this.bio;
  json.address = this.address;
  json.license = this.license;
  json.approval = this.approval;
  json.status = this.status;
  json.mgr = this.mgr;
  json.items = this.items.slice(-10).map(o => ({
    qty:o.qty,
    item:o.item.json() as any,
    receivedOn:o.receivedOn,
  }));
  json.info = this.info;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as AllTypes.IVendor;
};

const Vendor = mongoose.model<AllTypes.IVendor,VendorModel>('vendors',vendorSchema);
export default Vendor;