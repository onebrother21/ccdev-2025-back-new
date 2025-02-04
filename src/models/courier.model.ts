import mongoose,{Schema,Model} from 'mongoose';
import { CommonUtils,getStatusArraySchema,getLicenseSchema,popularColors,stateAbbreviations } from '../utils';
import * as AllTypes from "../types";

type CourierModel = Model<AllTypes.ICourier,{},AllTypes.ICourierMethods>;
const ObjectId = Schema.Types.ObjectId;

const vehicleSchema = new Schema<AllTypes.IVehicle>({
  VIN: { type: String,required:true,validate:/^[A-Z0-9]{17}$/},
  make: { type: String,required:true},
  model: { type: String,required:true},
  trim: { type: String,maxlength:10},
  year: { type: Number,required:true,min:1900,max:2100},
  mileage: { type: Number,required:true,min:1,max:250000},
  color: { type: String,required:true,enum:[...popularColors.map(o => o.name),...popularColors.map(o => o.hex)]},
  plateNo: { type: String,required:true,validate:/^[A-Z0-9]{6,8}$/},
  plateSt: { type: String,required:true,enum:[...stateAbbreviations]},
},{_id:false,timestamps:false});
const insuranceSchema = new Schema<AllTypes.IInsuranceInfo>({
  num:{ type: String,required:true,validate:/^[0-9]{8,10}$/},
  state:{ type: String,required:true,enum:[...stateAbbreviations]},
  expires:{ type: Date,required:true,validate: {
    validator: CommonUtils.isDateWithinInterval.bind(null,"6m"),
    message: 'Invalid license info'
  }},
  agent:{ type: String,required:true},
  insurer:{ type: String,required:true},
  vehicle:{ type: String,required:true},
},{_id:false,timestamps:false});
const courierSchema = new Schema<AllTypes.ICourier,CourierModel,AllTypes.ICourierMethods>({
  approval_activity:getStatusArraySchema(Object.values(AllTypes.IApprovalStatuses),AllTypes.IApprovalStatuses.REQUESTED),
  approval:{type:String,default:AllTypes.IApprovalStatuses.REQUESTED},
  name:{type:String,required:true,validate:/^[a-zA-Z0-9]{2,20}$/,unique: true, lowercase: true},
  img:{type:String},
  title:{type:String},
  bio:{type:String,max:140},
  vehicle:{type:vehicleSchema},
  license:{type:getLicenseSchema()},
  insurance:{type:insuranceSchema},
  user:{type:ObjectId,ref:"users",required:true},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

courierSchema.methods.setApproval = async function (name,info,save){
  const approval = {name,time:new Date(),...(info?{info}:{})};
  this.approval_activity.push(approval);
  this.approval = approval.name;
  if(save) await this.save();
};
courierSchema.methods.json = function () {
  const json:Partial<AllTypes.ICourier> =  {};
  json.id = this.id;
  json.name = this.name;
  json.img = this.img;
  json.title = this.title;
  json.bio = this.bio;
  json.vehicle = this.vehicle;
  json.license = this.license;
  json.insurance = this.insurance;
  json.approval = this.approval;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as AllTypes.ICourier;
};

const Courier = mongoose.model<AllTypes.ICourier,CourierModel>('couriers',courierSchema);
export default Courier;