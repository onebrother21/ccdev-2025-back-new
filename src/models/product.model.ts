import mongoose,{Schema,Model} from 'mongoose';
import { getStatusSchema,currencyCodes, getStatusArraySchema } from '../utils';
import * as AllTypes from "../types";

type ProductModel = Model<AllTypes.IProduct,{},AllTypes.IProductMethods>;
const ObjectId = Schema.Types.ObjectId;

const concentrationSchema = new Schema<AllTypes.IProduct["concentration"]>({
  amt:{type:Number,required:true},
  unit:{type:String,required:true},
},{_id:false,timestamps:false});
const priceSchema = new Schema<AllTypes.IProduct["price"]>({
  amt:{type:Number,required:true},
  curr:{type:String,required:true,enum:currencyCodes},
  per:{type:String,required:true},
},{_id:false,timestamps:false});
const productSchema = new Schema<AllTypes.IProduct,ProductModel,AllTypes.IProductMethods>({
  status_activity:getStatusArraySchema(Object.values(AllTypes.IProductStatuses),AllTypes.IProductStatuses.COMING_SOON),
  status:{type:String,default:AllTypes.IProductStatuses.COMING_SOON},
  creator:{type:ObjectId,ref:"users",required:true},
  name:{type:String,required:true},
  concentration:{type:concentrationSchema,required:true},
  price:{type:priceSchema,required:true},
  description:{type:String,maxlength:140},
  type:{type:String},
  sku:{type:String},
  receivedOn:{type:Date},
  sellBy:{type:Date}
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

productSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.status_activity.push(status);
  this.status = status.name;
  if(save) await this.save();
};
productSchema.methods.json = function () {
  const json:Partial<AllTypes.IProduct> =  {};
  json.id = this.id;
  json.createdOn = this.createdOn;
  json.creator = this.creator.json() as any;
  json.status = this.status;
  json.name = this.name;
  json.description = this.description;
  json.type = this.type;
  json.sku = this.sku;
  json.concentration = this.concentration;
  json.price = this.price;
  json.receivedOn = this.receivedOn;
  json.sellBy = this.sellBy;
  return json as AllTypes.IProduct;
};

const Product = mongoose.model<AllTypes.IProduct,ProductModel>('products',productSchema);
export default Product;