import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import Types from "../types";
import Utils from '../utils';

const ObjectId = Schema.Types.ObjectId;

const adminSchema = new Schema<Types.IAdmin,Admin,Types.IAdminMethods>({
  approvalUpdates:Utils.getStatusArraySchema(Object.values(Types.IApprovalStatuses),Types.IApprovalStatuses.REQUESTED),
  statusUpdates:Utils.getStatusArraySchema(Object.values(Types.IProfileStatuses),Types.IProfileStatuses.NEW),
  name:{type:String,required:true,validate:/^[a-zA-Z\s]{2,20}$/,unique: true, lowercase: true},
  displayName:{type:String,validate:/^[a-zA-Z0-9]{2,20}$/,sparse: true},
  img:{type:String},
  title:{type:String},
  bio:{type:String,max:140},
  scopes: { type: [String] },
  location:{type:{type:String,default:"Point"},coordinates:[Number]},
  user:{type:ObjectId,ref:"users",required:true},
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

adminSchema.plugin(uniqueValidator);
adminSchema.index({location:"2dsphere"});
adminSchema.virtual('approval').get(function () {
  return this.approvalUpdates[this.approvalUpdates.length - 1].name;
});
adminSchema.methods.setApproval = async function (name,info,save){
  const approval = {name,time:new Date(),...(info?{info}:{})};
  this.approvalUpdates.push(approval);
  if(save) await this.save();
};
adminSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
adminSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  if(save) await this.save();
};
adminSchema.methods.json = function () {
  const json:Partial<Types.IAdmin> =  {};
  json.id = this.id;
  json.displayName = this.displayName;
  json.name = this.name;
  json.img = this.img;
  json.title = this.title;
  json.bio = this.bio;
  json.scopes = this.scopes;
  json.status = this.status;
  json.approval = this.approval;
  json.location = this.location.coordinates as any;
  json.info = this.info;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as Types.IAdmin;
};

type Admin = Model<Types.IAdmin,{},Types.IAdminMethods>;
const Admin:Admin = mongoose.model<Types.IAdmin>('admins',adminSchema);
export default Admin;