import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import * as AllTypes from "../types";
import { getStatusArraySchema } from '../utils';


type PaymentModel = Model<AllTypes.IPayment,{},AllTypes.IPaymentMethods>;
const ObjectId = Schema.Types.ObjectId;

const paymentSchema = new Schema<AllTypes.IPayment>({
  statusUpdates:getStatusArraySchema(Object.values(AllTypes.IPaymentStatuses),AllTypes.IPaymentStatuses.DUE_NOW),
  customer: { type:ObjectId, ref: "Customer", required: true },
  order: { type:ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: "USD" },
  method: {
    type: String,
    enum: ["card","debit", "wallet", "bank_transfer"],
    required: true,
  },
  reason:{type:String},
  info:{type:Object},
  transInfo:{type:Object},
  transId: { type: String, required: true, unique: true },
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
paymentSchema.plugin(uniqueValidator);
paymentSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
paymentSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  if(save) await this.save();
};
paymentSchema.methods.json = function () {
  const json:Partial<AllTypes.IPayment> =  {};
  json.id = this.id;
  json.method = this.method;
  json.status = this.status;
  json.amount = this.amount;
  json.currency = this.currency;
  json.status = this.status;
  json.reason = this.reason;
  json.status = this.status;
  json.info = this.info;
  //json.createdOn = this.createdOn;
  json.updatedOn = this.updatedOn;
  return json as AllTypes.IPayment;
};

const Payment = mongoose.model<AllTypes.IPayment,PaymentModel>('payments',paymentSchema);
export default Payment;