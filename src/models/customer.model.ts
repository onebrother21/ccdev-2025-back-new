import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;


const cartItemSchema = new Schema<any>({
  item:{type:ObjectId,ref:"products",required:true},
  qty:{type:Number,required:true},
},{_id:false,timestamps:false});
const customerSchema = new Schema<Types.ICustomer,Customer,Types.ICustomerMethods>({
  statusUpdates:Utils.getStatusArraySchema(Object.values(Types.IProfileStatuses),Types.IProfileStatuses.NEW),
  name:{type:String,required:true,validate:/^[a-zA-Z\s]{2,20}$/,unique: true, lowercase: true},
  displayName:{type:String,validate:/^[a-zA-Z0-9]{2,20}$/,sparse: true},
  img:{type:String},
  address:{type:Utils.getAddressSchema()},
  license:{type:Utils.getLicenseSchema()},
  location:{type:{type:String,default:"Point"},coordinates:[Number]},
  user:{type:ObjectId,ref:"users",required:true},
  cart:[cartItemSchema],
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
  const json:Partial<Types.ICustomer> =  {};
  json.id = this.id;
  json.displayName = this.displayName;
  json.name = this.name;
  json.img = this.img;
  json.address = this.address;
  json.license = this.license;
  json.info = this.info;
  json.cart = this.cart;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as Types.ICustomer;
};

type Customer = Model<Types.ICustomer,{},Types.ICustomerMethods>;
const Customer:Customer = mongoose.model<Types.ICustomer>('customers',customerSchema);
export default Customer;