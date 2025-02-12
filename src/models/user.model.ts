import mongoose,{Schema,Model} from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";
import { CommonUtils,getStatusArraySchema, logger } from "../utils";
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
  admin:{type:ObjectId,ref:AllTypes.IProfileTypes.ADMIN+"s"},
  courier:{type:ObjectId,ref:AllTypes.IProfileTypes.COURIER+"s"},
  customer:{type:ObjectId,ref:AllTypes.IProfileTypes.CUSTOMER+"s"},
  vendor:{type:ObjectId,ref:AllTypes.IProfileTypes.VENDOR+"s"},
},{_id:false,timestamps:false});
const userSchema = new Schema<AllTypes.IUser,UserModel,AllTypes.IUserMethods>({
  statusUpdates:getStatusArraySchema(Object.values(AllTypes.IUserStatuses),AllTypes.IUserStatuses.NEW),
  username:{type:String,sparse:true},
  name:{type:nameSchema},
  email: { type: String, unique: true, lowercase: true ,required:true},
  mobile: { type: String, unique: true },
  dob:{type:Date},
  pin: { type: String },
  prefs:prefsSchema,
  reset:{type:String},
  verification:{type:String},
  verificationSent:{type:Date},
  profiles:{type:profilesSchema,default:{}},
  info:{type:Object},
},{timestamps:{createdAt:"createdOn",updatedAt:"updatedOn"}});
userSchema.plugin(uniqueValidator);
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
userSchema.methods.getUserContactByMethod = function(method:AllTypes.INotificationSendMethods){
  let to: string | null = null;
  switch (method) {
    case 'email':
      to = this.email || null;
      break;
    case 'sms':
      to = this.mobile || null;
      break;
    case 'push':
      to = this.pushToken || null;
      break;
    case 'in-app':
      to = this.socketId || null;
      break;
    case 'auto':
      try {
        // First attempt to send via WebSocket (check if socketId is available)
        to = this.socketId || null;
      }
      catch (err) {
        // If WebSocket fails, fallback to push (use pushToken)
        to = this.pushToken || null;
      }
      break;
    default:throw new Error('Unknown notification method');
  }
  if (!to) {
    throw new Error(`User does not have a valid ${method} to send notification.`);
  }
  return to;
};
userSchema.methods.getProfile = function(role){return this.profiles[role] || {} as any;};
userSchema.methods.setStatus = async function (name,info,save){
  const status = {name,time:new Date(),...(info?{info}:{})};
  this.statusUpdates.push(status);
  if(save) await this.save();
};
userSchema.methods.preview = function (role){
  const profile = this.profiles[role] || {} as any;
  return {
    name:this.name,
    id:this.id,
    location:this.location,
    img:profile.img,
    title:profile.title,
    role
  };
};
userSchema.virtual('status').get(function () {
  return this.statusUpdates[this.statusUpdates.length - 1].name;
});
userSchema.methods.json = function (role,auth) {
  const json:AllTypes.IUserJson =  {...this.preview(role) as any};
  const profile = this.profiles[role] || null;
  if(auth) {
    json.username = this.username;
    json.status = this.status;
    json.prefs = this.prefs;
    json.age = this.toAge();
    json.profile = profile?profile.json():{} as any;
    json.memberSince = this.createdOn as Date;
    json.lastUpdate = this.updatedOn as Date;
    json.isMgr = this.id == (profile as AllTypes.IVendor).mgr;
    json.info = this.info;
  };
  logger.log({json});
  return json as AllTypes.IUserJson;
};

const User = mongoose.model<AllTypes.IUser,UserModel>('users',userSchema);
export default User;