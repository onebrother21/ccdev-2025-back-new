import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;

const itemsSchema = new Schema<Types.IVendor["items"][0]>({
  qty:{type:Number},
  product:{type:ObjectId,ref:"products",required:true},
  receivedOn:{type:Date},
},{_id:false,timestamps:false});

const hoursSchema = new Schema({open: { type: String},close: { type: String},},{_id:false,timestamps:false});

const vendorSchema = new Schema<Types.IVendor,Vendor,Types.IVendor>({
  mgr:{type:ObjectId,ref:"users",required:true},
  users:[{type:ObjectId,ref:"users"}],
  approvalUpdates:Utils.getStatusArraySchema(Object.values(Types.IApprovalStatuses),Types.IApprovalStatuses.REQUESTED),
  statusUpdates:Utils.getStatusArraySchema(Object.values(Types.IProfileStatuses),Types.IProfileStatuses.NEW),
  name:{type:String,required:true,validate:/^[a-zA-Z0-9\s]{3,20}$/,unique: true, lowercase: true},
  displayName:{type:String,validate:/^[a-zA-Z0-9]{2,20}$/,sparse: true},
  email: { type: String, unique: true, lowercase: true ,required:true},
  phone: { type: String, unique: true },
  hours:{type:hoursSchema},
  img:{type:String},
  title:{type:String},
  bio:{type:String,max:140},
  location:{type:{type:String,default:"Point"},coordinates:[Number]},
  address:{type:Utils.getAddressSchema(),required:true},
  license:{type:Utils.getLicenseSchema()},
  items:{type:[itemsSchema]},
  tempPswd:{type:{code:String,expires:Date}},
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
  const json:Partial<Types.IVendor> =  {};
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
  json.itemCt = this.items.length;
  json.info = this.info;
  json.location = this.location.coordinates as any;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as Types.IVendor;
};

type Vendor = Model<Types.IVendor,{},Types.IVendorMethods>;
const Vendor:Vendor = mongoose.model<Types.IVendor>('vendors',vendorSchema);
export default Vendor;