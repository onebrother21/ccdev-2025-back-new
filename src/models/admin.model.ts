import mongoose,{Schema,Model} from 'mongoose';
import { getStatusArraySchema } from "../utils";
import * as AllTypes from "../types";

type AdminModel = Model<AllTypes.IAdmin,{},AllTypes.IAdminMethods>;
const ObjectId = Schema.Types.ObjectId;

const adminSchema = new Schema<AllTypes.IAdmin,AdminModel,AllTypes.IAdminMethods>({
  approval_activity:getStatusArraySchema(Object.values(AllTypes.IApprovalStatuses),AllTypes.IApprovalStatuses.REQUESTED),
  approval:{type:String,default:AllTypes.IApprovalStatuses.REQUESTED},
  name:{type:String,required:true,validate:/^[a-zA-Z0-9]{2,20}$/,unique: true, lowercase: true},
  img:{type:String},
  title:{type:String},
  bio:{type:String,max:140},
  scopes: { type: [String] },
  user:{type:ObjectId,ref:"users",required:true},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});

adminSchema.methods.setApproval = async function (name,info,save){
  const approval = {name,time:new Date(),...(info?{info}:{})};
  this.approval_activity.push(approval);
  this.approval = approval.name;
  if(save) await this.save();
};
adminSchema.methods.json = function () {
  const json:Partial<AllTypes.IAdmin> =  {};
  json.id = this.id;
  json.name = this.name;
  json.img = this.img;
  json.title = this.title;
  json.bio = this.bio;
  json.scopes = this.scopes;
  json.approval = this.approval;
  //json.createdOn = this.createdOn;
  //json.updatedOn = this.updatedOn;
  return json as AllTypes.IAdmin;
};

const Admin = mongoose.model<AllTypes.IAdmin,AdminModel>('admins',adminSchema);
export default Admin;