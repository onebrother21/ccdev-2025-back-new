import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;

const vehicleSchema = new Schema<Types.IVehicle>({
  VIN: { type: String,required:true,validate:/^[A-Z0-9]{17}$/},
  make: { type: String,required:true},
  model: { type: String,required:true},
  trim: { type: String,maxlength:10},
  year: { type: Number,required:true,min:1900,max:2100},
  mileage: { type: Number,required:true,min:1,max:250000},
  color: { type: String,required:true,enum:[...Utils.popularColors.map(o => o.name),...Utils.popularColors.map(o => o.hex)]},
  plateNo: { type: String,required:true,validate:/^[A-Z0-9]{6,8}$/},
  plateSt: { type: String,required:true,enum:[...Utils.stateAbbreviations]},
},{_id:false,timestamps:false});
const insuranceSchema = new Schema<Types.IInsuranceInfo>({
  num:{ type: String,required:true,validate:/^[0-9]{8,10}$/},
  state:{ type: String,required:true,enum:[...Utils.stateAbbreviations]},
  expires:{ type: Date,required:true,validate: {
    validator: Utils.isDateWithinInterval.bind(null,"6m"),
    message: 'Invalid license info'
  }},
  agent:{ type: String,required:true},
  insurer:{ type: String,required:true},
  vehicle:{ type: String,required:true},
},{_id:false,timestamps:false});

const courierSchema = new Schema<Types.ICourier,Courier,Types.ICourierMethods>({
  approvalUpdates:Utils.getStatusArraySchema(Object.values(Types.IApprovalStatuses),Types.IApprovalStatuses.REQUESTED),
  statusUpdates:Utils.getStatusArraySchema(Object.values(Types.IProfileStatuses),Types.IProfileStatuses.NEW),
  name:{type:String,required:true,validate:/^[a-zA-Z\s]{2,20}$/,unique: true, lowercase: true},
  displayName:{type:String,validate:/^[a-zA-Z0-9]{2,20}$/,sparse: true},
  img:{type:String},
  title:{type:String},
  bio:{type:String,max:140},
  vehicle:{type:vehicleSchema},
  insurance:{type:insuranceSchema},
  license:{type:Utils.getLicenseSchema()},
  location:{type:{type:String,default:"Point"},coordinates:[Number]},
  user:{type:ObjectId,ref:"users",required:true},
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
courierSchema.plugin(uniqueValidator);
courierSchema.index({location:"2dsphere"});
courierSchema.virtual('approval').get(function () {
  return this.approvalUpdates[this.approvalUpdates.length - 1].name;
});
courierSchema.methods.setApproval = async function (name,info,save){
  const approval = {name,time:new Date(),...(info?{info}:{})};
  this.approvalUpdates.push(approval);
  if(save) await this.save();
};
courierSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
courierSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  if(save) await this.save();
};
courierSchema.methods.json = function () {
  const json:Partial<Types.ICourier> =  {};
  json.id = this.id;
  json.displayName = this.displayName;
  json.name = this.name;
  json.img = this.img;
  json.title = this.title;
  json.bio = this.bio;
  json.vehicle = this.vehicle;
  json.license = this.license;
  json.insurance = this.insurance;
  json.approval = this.approval;
  json.info = this.info;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as Types.ICourier;
};

type Courier = Model<Types.ICourier,{},Types.ICourierMethods>;
const Courier:Courier = mongoose.model<Types.ICourier>('couriers',courierSchema);
export default Courier;