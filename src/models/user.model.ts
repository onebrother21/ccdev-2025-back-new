import mongoose,{Schema,Model} from 'mongoose';
import { CommonUtils,getStatusArraySchema } from "../utils";
import * as AllTypes from "../types";

type UserModel = Model<AllTypes.IUser,{},AllTypes.IUserMethods>;
const ObjectId = Schema.Types.ObjectId;

const nameSchema = new Schema({
  first: { type: String},
  last: { type: String},
},{_id:false,timestamps:false});
const prefsSchema = new Schema({
  acceptCookies: { type: Date},
  acceptTerms: { type: Date},
  acceptPrivacy: { type: Date},
},{_id:false,timestamps:false});
const profilesSchema = new Schema({
  admin:{type:ObjectId,ref:AllTypes.IProfileTypes.ADMIN},
  courier:{type:ObjectId,ref:AllTypes.IProfileTypes.COURIER},
  customer:{type:ObjectId,ref:AllTypes.IProfileTypes.CUSTOMER},
  vendor:{type:ObjectId,ref:AllTypes.IProfileTypes.VENDOR},
},{_id:false,timestamps:false});
const userSchema = new Schema<AllTypes.IUser,UserModel,AllTypes.IUserMethods>({
  status_activity:getStatusArraySchema(Object.values(AllTypes.IUserStatuses),AllTypes.IUserStatuses.NEW),
  status:{type:String,default:AllTypes.IUserStatuses.NEW},
  username:{type:String,sparse:true},
  name:{type:nameSchema,required:true},
  email: { type: String, unique: true, lowercase: true ,required:true},
  mobile: { type: String, unique: true },
  dob:{type:Date},
  pin: { type: String },
  prefs:prefsSchema,
  reset:{type:String},
  verification:{type:String},
  verificationSent:{type:Date},
  profiles:profilesSchema,
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
//userSchema.method('fullName', function fullName() {return this.firstName + ' ' + this.lastName;});
userSchema.methods.toAge = function toAge(){
  const dob = CommonUtils.dateParserX(this.dob);
  if(dob){
    const yrInMS = 1000 * 60 * 60 * 24 * 365.25;
    const ageInMS = Date.now() - new Date(dob).getTime();
    const ageInYrs = ageInMS/yrInMS;
    const age = Number(ageInYrs.toFixed(0));
    return age;
  }
  else return null;
};
userSchema.methods.getProfile = function(role){return this.profiles?this.profiles[role]:{} as any};
userSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.status_activity.push(status);
  this.status = status.name;
  if(save) await this.save();
};
userSchema.methods.preview = function (role){
  return {
    name:this.name,
    id:this.id,
    location:this.location,
    img:this.getProfile(role).img,
    title:this.getProfile(role).title,
    role
  };
};
userSchema.methods.json = function (role,auth) {
  const json:AllTypes.IUserJson =  {...this.preview(role) as any};
  if(auth) {
    json.username = this.username;
    json.status = this.status;
    json.prefs = this.prefs;
    json.age = this.toAge();
    json.profile = this.getProfile(role)?this.getProfile(role).json():{} as any;
    json.createdOn = this.createdOn;
    json.updatedOn = this.updatedOn;
  };
  return json as AllTypes.IUserJson;
};

const User = mongoose.model<AllTypes.IUser,UserModel>('users',userSchema);
export default User;