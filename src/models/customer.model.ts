import mongoose,{Schema,Model} from 'mongoose';
import { getAddressSchema } from '../utils';
import * as AllTypes from "../types";

type CustomerModel = Model<AllTypes.ICustomer,{},AllTypes.ICustomerMethods>;
const ObjectId = Schema.Types.ObjectId;

const customerSchema = new Schema<AllTypes.ICustomer,CustomerModel,AllTypes.ICustomerMethods>({
  name:{type:String,required:true,validate:/^[a-zA-Z0-9]{2,20}$/,unique: true, lowercase: true},
  img:{type:String},
  address:{type:getAddressSchema(),required:true},
  license:{type:getAddressSchema()},
  user:{type:ObjectId,ref:"users",required:true},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});


customerSchema.methods.json = function () {
  const json:Partial<AllTypes.ICustomer> =  {};
  json.id = this.id;
  json.name = this.name;
  json.img = this.img;
  json.address = this.address;
  json.license = this.license;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as AllTypes.ICustomer;
};

const Customer = mongoose.model<AllTypes.ICustomer,CustomerModel>('customers',customerSchema);
export default Customer;