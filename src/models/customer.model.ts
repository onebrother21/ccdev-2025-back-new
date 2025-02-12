import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import { getStatusArraySchema,getAddressSchema,getLicenseSchema } from '../utils';
import * as AllTypes from "../types";

type CustomerModel = Model<AllTypes.ICustomer,{},AllTypes.ICustomerMethods>;
const ObjectId = Schema.Types.ObjectId;

const customerSchema = new Schema<AllTypes.ICustomer,CustomerModel,AllTypes.ICustomerMethods>({
  statusUpdates:getStatusArraySchema(Object.values(AllTypes.IProfileStatuses),AllTypes.IProfileStatuses.NEW),
  name:{type:String,required:true,validate:/^[a-zA-Z\s]{2,20}$/,unique: true, lowercase: true},
  displayName:{type:String,validate:/^[a-zA-Z0-9]{2,20}$/,sparse: true},
  img:{type:String},
  address:{type:getAddressSchema()},
  license:{type:getLicenseSchema()},
  location:{type:{type:String,default:"Point"},coordinates:[Number]},
  user:{type:ObjectId,ref:"users",required:true},
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
customerSchema.plugin(uniqueValidator);
customerSchema.index({location:"2dsphere"});
customerSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
customerSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  if(save) await this.save();
};
customerSchema.methods.json = function () {
  const json:Partial<AllTypes.ICustomer> =  {};
  json.id = this.id;
  json.displayName = this.displayName;
  json.name = this.name;
  json.img = this.img;
  json.address = this.address;
  json.license = this.license;
  json.info = this.info;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as AllTypes.ICustomer;
};

const Customer = mongoose.model<AllTypes.ICustomer,CustomerModel>('customers',customerSchema);
export default Customer;