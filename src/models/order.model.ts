import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;

const addressSchema = new Schema<AddressObj>({
  streetAddr: { type: String,required:true,validate:/^\d+\s[\w\s,\.]+$/},
  city: { type: String,required:true},
  state: { type: String,required:true,enum:[...Utils.stateAbbreviations]},
  postal: { type: String,required:true},
  country: { type: String,required:true},
},{_id:false,timestamps:false});
const itemSchema = new Schema<Types.IOrder["items"][0]>({
  name: { type: String,required:true},
  qty: { type: Number,required:true},
  price: { type: Number,required:true},
  itemId:{type:ObjectId,ref:"products"},
},{_id:false,timestamps:false});
const chargesSchema = new Schema<Types.IOrderCharges>({
  subtotal:{ type: Number,required:true},
  serviceFee: { type: Number,required:true},
  deliveryFee: { type: Number,required:true},
  adminFees: { type: Number,required:true },
  salesTax:{ type: Number,required:true},
  tip:{ type: Number,required:true},
  total:{ type: Number,required:true},
},{_id:false,timestamps:false});

const orderSchema = new Schema<Types.IOrder,Order,Types.IOrder>({
  reqno:{type:Number,required:true},
  statusUpdates:Utils.getStatusArraySchema(Object.values(Types.IOrderStatuses),Types.IOrderStatuses.NEW),
  customer:{type:ObjectId,ref:"customers",required:true},
  vendor:{type:ObjectId,ref:"vendors",required:true},
  courier:{type:ObjectId,ref:"couriers"},
  description:{type:String,maxlength:140},
  total:{type:Number,required:true},
  scheduledFor:{type:Date,required:true},
  deliveryAddress:{type:addressSchema,required:true},
  deliveredOn:{type:Date},
  payment:{type:ObjectId,ref:"payments",required:true},
  items:{type:[itemSchema],required:true},
  charges:{type:chargesSchema,default:() => ({
    subtotal:0,
    serviceFee:0,
    deliveryFee:0,
    adminFees:0,
    salesTax:0,
    tip:0,
    total:0
  })},
  tasks:[{type:ObjectId,ref:"tasks"}],
  notes:[Utils.noteSchema],
  activity:{type:[Object]},
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
orderSchema.plugin(uniqueValidator);
orderSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
orderSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  this.status = status.name;
  if(save) await this.save();
};
orderSchema.methods.calculateCharges = async function(bvars:any) {
  if(bvars && bvars.rates){
    const subtotal = this.items.reduce((o,p) => o + p.price * p.qty,0);
    const serviceFee = (bvars.rates.service || 0) * subtotal;
    const deliveryFee = (bvars.rates.delivery || 0) * subtotal;
    const adminFees = (bvars.rates.admin || 0) * subtotal;
    const subtotalAndFees = subtotal + serviceFee + deliveryFee + adminFees;
    const salesStateObj = Utils.stateSalesTaxRates.filter(o => o.abbr == this.deliveryAddress.state)[0];
    const taxRate = salesStateObj?salesStateObj.rate:null;
    if(taxRate === null){
      this.charges = null;
      this.total = null;
    }
    else {
      const salesTax = taxRate * subtotalAndFees;
      const tip = this.charges?.tip || 0;
      const total = subtotalAndFees + salesTax + tip;
      const charges = {subtotal,serviceFee,deliveryFee,adminFees,salesTax,tip,total};
      this.charges = Object.keys(charges).reduce((o,k) => ({...o,[k]:Number((charges[k] as number).toFixed(2)),}),{}) as Types.IOrderCharges;
      this.total = this.charges.total;
    }
  }
  await this.save();
};
orderSchema.methods.json = function () {
  const json:Partial<Types.IOrder> =  {};
  json.id = this.id;
  json.customer = this.customer.json() as Types.ICustomer;
  json.vendor = this.vendor.json() as Types.IVendor;
  json.courier = this.courier?this.courier.json() as Types.ICourier:null;
  json.description = this.description;
  json.status = this.status;
  json.total = this.total;
  json.scheduledFor = this.scheduledFor;
  json.deliveredOn = this.deliveredOn;
  json.deliveryAddress = this.deliveryAddress;
  json.payment = this.payment;
  json.items = this.items;
  json.notes = this.notes.slice(-10);
  json.tasks = this.tasks.slice(-10);
  json.charges = this.charges;
  json.info = this.info;
  json.createdOn = this.createdOn;
  return json as Types.IOrder;
};

type Order = Model<Types.IOrder,{},Types.IOrderMethods>;
const Order:Order = mongoose.model<Types.IOrder>('orders',orderSchema);
export default Order;